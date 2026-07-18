const express = require("express");
const router = express.Router();
const supabase = require("../supabase");
const { requireAuth } = require("../middleware/authMiddleware");

// Ensure all routes are protected
router.use(requireAuth);

/**
 * Valid Status Transitions:
 * - pending -> confirmed, rejected, cancelled
 * - confirmed -> completed, cancelled, rescheduled
 */
const isValidTransition = (current, next) => {
    const transitions = {
        'pending': ['confirmed', 'rejected', 'cancelled'],
        'confirmed': ['completed', 'cancelled', 'rescheduled', 'pending'], // vendor might move back to pending
        'rescheduled': ['confirmed', 'rejected', 'cancelled'],
        'rejected': [],
        'cancelled': [],
        'completed': []
    };
    return transitions[current]?.includes(next);
};

/**
 * GET /api/appointments
 * Fetch appointments based on role
 */
router.get("/", async (req, res) => {
    try {
        const { id: userId, role } = req.user;
        
        let query = supabase.from("appointments").select(`
            *,
            users:user_id(name, email),
            boutiques:boutique_id(boutique_name, city)
        `).order('appointment_date', { ascending: true });

        if (role === "user") {
            query = query.eq("user_id", userId);
        } else if (role === "vendor") {
            query = query.eq("boutique_id", userId);
        } else if (role !== "admin") {
            return res.status(403).json({ success: false, message: "Forbidden" });
        }

        const { data, error } = await query;
        if (error) {
            if (error.message.includes("relation") && error.message.includes("does not exist")) return res.json({ success: true, data: [] });
            throw error;
        }

        res.json({ success: true, data });
    } catch (err) {
        console.error("[Appointments GET]", err.message);
        res.status(500).json({ success: false, message: "Server error" });
    }
});

/**
 * POST /api/appointments
 * Customer books an appointment
 */
router.post("/", async (req, res) => {
    try {
        const { id: userId, role } = req.user;
        if (role !== "user") return res.status(403).json({ success: false, message: "Only customers can book appointments" });

        const { boutique_id, appointment_date, appointment_time, notes } = req.body;
        if (!boutique_id || !appointment_date || !appointment_time) {
            return res.status(400).json({ success: false, message: "Missing required fields" });
        }

        // Validate date is not in the past
        const appointmentDateTime = new Date(`${appointment_date}T${appointment_time}`);
        if (appointmentDateTime < new Date()) {
            return res.status(400).json({ success: false, message: "Cannot book an appointment in the past" });
        }

        // Prevent duplicate bookings
        const { data: existing, error: checkErr } = await supabase
            .from("appointments")
            .select("id")
            .eq("boutique_id", boutique_id)
            .eq("appointment_date", appointment_date)
            .eq("appointment_time", appointment_time)
            .in("status", ["pending", "confirmed"])
            .maybeSingle();

        if (existing) {
            return res.status(409).json({ success: false, message: "This time slot is already booked or requested" });
        }

        const { data, error } = await supabase
            .from("appointments")
            .insert([{ user_id: userId, boutique_id, appointment_date, appointment_time, notes, status: "pending" }])
            .select()
            .single();

        if (error) throw error;
        res.status(201).json({ success: true, data, message: "Appointment requested successfully" });
    } catch (err) {
        console.error("[Appointments POST]", err.message);
        res.status(500).json({ success: false, message: "Server error" });
    }
});

/**
 * PATCH /api/appointments/:id
 * Vendor/Admin/Customer update status or details
 */
router.patch("/:id", async (req, res) => {
    try {
        const { id: userId, role } = req.user;
        const appointmentId = req.params.id;
        const { status, appointment_date, appointment_time, notes } = req.body;

        // Fetch current
        const { data: current, error: fetchErr } = await supabase
            .from("appointments")
            .select("*")
            .eq("id", appointmentId)
            .single();

        if (fetchErr || !current) return res.status(404).json({ success: false, message: "Appointment not found" });

        // Authorization checks
        if (role === "user" && current.user_id !== userId) return res.status(403).json({ success: false, message: "Forbidden" });
        if (role === "vendor" && current.boutique_id !== userId) return res.status(403).json({ success: false, message: "Forbidden" });

        let updateData = {};

        // Customer can only cancel
        if (role === "user") {
            if (status !== "cancelled") return res.status(403).json({ success: false, message: "Customers can only cancel appointments" });
            updateData.status = "cancelled";
        }
        
        // Vendor can update status
        if (role === "vendor") {
            if (status) {
                if (!isValidTransition(current.status, status)) {
                    return res.status(400).json({ success: false, message: `Invalid status transition from ${current.status} to ${status}` });
                }
                updateData.status = status;
            }
            if (appointment_date && appointment_time) {
                updateData.appointment_date = appointment_date;
                updateData.appointment_time = appointment_time;
                if (!status) updateData.status = "rescheduled";
            }
        }

        // Admin can edit anything
        if (role === "admin") {
            if (status) updateData.status = status;
            if (appointment_date) updateData.appointment_date = appointment_date;
            if (appointment_time) updateData.appointment_time = appointment_time;
            if (notes) updateData.notes = notes;
        }

        if (Object.keys(updateData).length === 0) return res.status(400).json({ success: false, message: "Nothing to update" });

        const { data, error } = await supabase
            .from("appointments")
            .update(updateData)
            .eq("id", appointmentId)
            .select()
            .single();

        if (error) throw error;
        res.json({ success: true, data, message: "Appointment updated" });
    } catch (err) {
        console.error("[Appointments PATCH]", err.message);
        res.status(500).json({ success: false, message: "Server error" });
    }
});

/**
 * DELETE /api/appointments/:id
 * Only Admin can delete permanently
 */
router.delete("/:id", async (req, res) => {
    try {
        const { role } = req.user;
        if (role !== "admin") return res.status(403).json({ success: false, message: "Only admins can delete appointments" });

        const { error } = await supabase.from("appointments").delete().eq("id", req.params.id);
        if (error) throw error;

        res.json({ success: true, message: "Appointment deleted permanently" });
    } catch (err) {
        console.error("[Appointments DELETE]", err.message);
        res.status(500).json({ success: false, message: "Server error" });
    }
});

module.exports = router;
