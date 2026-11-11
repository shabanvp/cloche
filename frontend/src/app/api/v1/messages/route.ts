import { NextResponse } from "next/server";
import { getAuthenticatedCustomerUser } from "@/lib/customerAuth";
import { requireAuthenticatedVendor } from "@/lib/vendorAuth";
import { supabaseFetch } from "@/lib/supabase";

export interface ChatMessage {
  id: string;
  sender: "customer" | "vendor" | "system";
  senderName: string;
  senderAvatar?: string;
  text: string;
  createdAt: string;
  isRead: boolean;
  quotation?: {
    amount: number;
    title: string;
    details?: string;
    status: "pending" | "accepted" | "declined";
  };
}

export interface ConversationItem {
  id: string;
  leadId?: string;
  vendorId: string;
  vendorName: string;
  vendorCategory: string;
  vendorAvatar: string;
  vendorCity: string;
  vendorPhone?: string;
  customerName: string;
  customerEmail?: string;
  customerPhone?: string;
  eventType: string;
  eventDate?: string;
  guestCount?: number;
  estimatedBudget?: number;
  status: "new" | "replied" | "quoted" | "confirmed" | "completed";
  unreadCount: number;
  lastMessageSnippet: string;
  lastMessageTime: string;
  messages: ChatMessage[];
}

export async function GET(req: Request) {
  try {
    const customerUser = await getAuthenticatedCustomerUser(req).catch(() => null);
    const vendorAuth = await requireAuthenticatedVendor(req).catch(() => null);

    let dbConversations: ConversationItem[] = [];

    // 1. If authenticated as Customer, query customer leads & quotations from database
    if (customerUser?.userId) {
      const customerId = customerUser.userId;
      const customerEmail = customerUser.email;

      let query = `leads?customer_id=eq.${encodeURIComponent(customerId)}&deleted_at=is.null&order=created_at.desc&select=*,vendors(*)`;
      if (customerEmail) {
        query = `leads?or=(customer_id.eq.${encodeURIComponent(customerId)},customer_email.eq.${encodeURIComponent(customerEmail)})&deleted_at=is.null&order=created_at.desc&select=*,vendors(*)`;
      }
      const { data: leads } = await supabaseFetch(query);

      if (Array.isArray(leads) && leads.length > 0) {
        const leadIds = leads.map((l: any) => l.id).filter(Boolean);

        // Fetch genuine quotations for these leads
        let quotationsByLead: Record<string, any[]> = {};
        if (leadIds.length > 0) {
          const { data: quotations } = await supabaseFetch(
            `quotations?lead_id=in.(${leadIds.map((id: string) => encodeURIComponent(id)).join(",")})&order=created_at.desc&select=*,quotation_items(*)`
          );
          if (Array.isArray(quotations)) {
            for (const q of quotations) {
              const k = String(q.lead_id);
              if (!quotationsByLead[k]) quotationsByLead[k] = [];
              quotationsByLead[k].push(q);
            }
          }
        }

        // Fetch genuine chat messages / activities for these leads
        let activitiesByLead: Record<string, any[]> = {};
        if (leadIds.length > 0) {
          const { data: activities } = await supabaseFetch(
            `lead_activities?lead_id=in.(${leadIds.map((id: string) => encodeURIComponent(id)).join(",")})&order=created_at.asc`
          );
          if (Array.isArray(activities)) {
            for (const act of activities) {
              const k = String(act.lead_id);
              if (!activitiesByLead[k]) activitiesByLead[k] = [];
              activitiesByLead[k].push(act);
            }
          }
        }

        dbConversations = leads.map((lead: any, idx: number) => {
          const v = lead.vendors || {};
          const leadQuotes = quotationsByLead[String(lead.id)] || [];
          const leadActs = activitiesByLead[String(lead.id)] || [];

          const msgs: ChatMessage[] = [];

          // Initial lead inquiry message
          if (lead.message) {
            msgs.push({
              id: `db-msg-${lead.id}-inquiry`,
              sender: "customer",
              senderName: lead.customer_name || customerUser.fullName || "You",
              text: lead.message,
              createdAt: lead.created_at ? new Date(lead.created_at).toLocaleString("en-IN") : "Recently",
              isRead: true,
            });
          }

          // Thread messages from database lead_activities
          for (const act of leadActs) {
            if (act.activity_type === "vendor_message") {
              msgs.push({
                id: `act-${act.id}`,
                sender: "vendor",
                senderName: v.name || v.boutique_name || "Wedding Vendor",
                senderAvatar: v.logo || v.cover_image || "",
                text: act.description,
                createdAt: act.created_at ? new Date(act.created_at).toLocaleString("en-IN") : "Recently",
                isRead: true,
              });
            } else if (act.activity_type === "client_message") {
              msgs.push({
                id: `act-${act.id}`,
                sender: "customer",
                senderName: lead.customer_name || customerUser.fullName || "You",
                text: act.description,
                createdAt: act.created_at ? new Date(act.created_at).toLocaleString("en-IN") : "Recently",
                isRead: true,
              });
            }
          }

          // Thread quotations from database
          for (const quote of leadQuotes) {
            msgs.push({
              id: `db-msg-${lead.id}-quote-${quote.id}`,
              sender: "vendor",
              senderName: v.name || v.boutique_name || "Wedding Vendor",
              senderAvatar: v.logo || v.cover_image || "",
              text: `Here is our official quotation for your event on ${lead.event_date || "your wedding date"}.`,
              createdAt: quote.created_at ? new Date(quote.created_at).toLocaleString("en-IN") : "Recently",
              isRead: quote.status !== "pending",
              quotation: {
                amount: Number(quote.total_amount || 0),
                title: quote.title || "Custom Vendor Quotation",
                details: quote.notes || quote.terms || "Includes selected event services and professional crew.",
                status: quote.status || "pending",
              },
            });
          }

          // Fallback initial notice if inquiry had no text
          if (msgs.length === 0) {
            msgs.push({
              id: `db-msg-${lead.id}-default`,
              sender: "customer",
              senderName: lead.customer_name || customerUser.fullName || "You",
              text: "Quote request submitted for wedding planning.",
              createdAt: lead.created_at ? new Date(lead.created_at).toLocaleString("en-IN") : "Recently",
              isRead: true,
            });
          }

          const hasUnread = msgs.some((m) => !m.isRead && m.sender === "vendor");
          const latestMsg = msgs[msgs.length - 1];

          return {
            id: `conv-lead-${lead.id}`,
            leadId: String(lead.id),
            vendorId: String(lead.vendor_id || v.id || `v-${idx}`),
            vendorName: v.name || v.boutique_name || "Wedding Vendor",
            vendorCategory: v.category || "Wedding Services",
            vendorAvatar: v.logo || v.cover_image || "https://images.unsplash.com/photo-1519741497674-611481863552?w=400&q=80",
            vendorCity: v.city || lead.city || "Kerala",
            vendorPhone: v.phone || "",
            customerName: lead.customer_name || customerUser.fullName || "Customer",
            customerEmail: lead.customer_email || customerUser.email,
            customerPhone: lead.customer_phone,
            eventType: lead.event_type || "Wedding",
            eventDate: lead.event_date,
            guestCount: lead.guest_count,
            estimatedBudget: lead.estimated_budget,
            status: leadQuotes.length > 0 ? "quoted" : lead.status === "new" ? "new" : "replied",
            unreadCount: hasUnread ? 1 : 0,
            lastMessageSnippet: latestMsg ? latestMsg.text : "Inquiry submitted.",
            lastMessageTime: latestMsg ? latestMsg.createdAt : "Recently",
            messages: msgs,
          };
        });
      }
    }
    // 2. If authenticated as Vendor, query vendor leads
    else if (vendorAuth && vendorAuth.vendorId) {
      const vendorId = vendorAuth.vendorId;
      const { data: vendorLeads } = await supabaseFetch(
        `leads?vendor_id=eq.${encodeURIComponent(vendorId)}&deleted_at=is.null&order=created_at.desc&select=*,vendors(*)`
      );

      if (Array.isArray(vendorLeads) && vendorLeads.length > 0) {
        const leadIds = vendorLeads.map((l: any) => l.id).filter(Boolean);

        // Fetch quotations
        let quotationsByLead: Record<string, any[]> = {};
        if (leadIds.length > 0) {
          const { data: quotations } = await supabaseFetch(
            `quotations?lead_id=in.(${leadIds.map((id: string) => encodeURIComponent(id)).join(",")})&order=created_at.desc&select=*,quotation_items(*)`
          );
          if (Array.isArray(quotations)) {
            for (const q of quotations) {
              const k = String(q.lead_id);
              if (!quotationsByLead[k]) quotationsByLead[k] = [];
              quotationsByLead[k].push(q);
            }
          }
        }

        // Fetch activities
        let activitiesByLead: Record<string, any[]> = {};
        if (leadIds.length > 0) {
          const { data: activities } = await supabaseFetch(
            `lead_activities?lead_id=in.(${leadIds.map((id: string) => encodeURIComponent(id)).join(",")})&order=created_at.asc`
          );
          if (Array.isArray(activities)) {
            for (const act of activities) {
              const k = String(act.lead_id);
              if (!activitiesByLead[k]) activitiesByLead[k] = [];
              activitiesByLead[k].push(act);
            }
          }
        }

        dbConversations = vendorLeads.map((lead: any) => {
          const v = lead.vendors || {};
          const leadQuotes = quotationsByLead[String(lead.id)] || [];
          const leadActs = activitiesByLead[String(lead.id)] || [];

          const msgs: ChatMessage[] = [];
          if (lead.message) {
            msgs.push({
              id: `vlead-msg-${lead.id}-inquiry`,
              sender: "customer",
              senderName: lead.customer_name || "Client",
              text: lead.message,
              createdAt: lead.created_at ? new Date(lead.created_at).toLocaleString("en-IN") : "Recently",
              isRead: lead.status !== "new",
            });
          }

          for (const act of leadActs) {
            if (act.activity_type === "vendor_message") {
              msgs.push({
                id: `act-${act.id}`,
                sender: "vendor",
                senderName: v.name || "You",
                senderAvatar: v.logo || "",
                text: act.description,
                createdAt: act.created_at ? new Date(act.created_at).toLocaleString("en-IN") : "Recently",
                isRead: true,
              });
            } else if (act.activity_type === "client_message") {
              msgs.push({
                id: `act-${act.id}`,
                sender: "customer",
                senderName: lead.customer_name || "Client",
                text: act.description,
                createdAt: act.created_at ? new Date(act.created_at).toLocaleString("en-IN") : "Recently",
                isRead: true,
              });
            }
          }

          for (const quote of leadQuotes) {
            msgs.push({
              id: `vlead-quote-${quote.id}`,
              sender: "vendor",
              senderName: v.name || "You",
              senderAvatar: v.logo || "",
              text: `Official quotation submitted.`,
              createdAt: quote.created_at ? new Date(quote.created_at).toLocaleString("en-IN") : "Recently",
              isRead: true,
              quotation: {
                amount: Number(quote.total_amount || 0),
                title: quote.title || "Vendor Quotation",
                details: quote.notes || quote.terms || "",
                status: quote.status || "pending",
              },
            });
          }

          if (msgs.length === 0) {
            msgs.push({
              id: `vlead-msg-${lead.id}`,
              sender: "customer",
              senderName: lead.customer_name || "Client",
              text: "Inquiry submitted through Cloche profile.",
              createdAt: lead.created_at ? new Date(lead.created_at).toLocaleString("en-IN") : "Recently",
              isRead: lead.status !== "new",
            });
          }

          const latestMsg = msgs[msgs.length - 1];

          return {
            id: `conv-vendor-lead-${lead.id}`,
            leadId: String(lead.id),
            vendorId: String(vendorId),
            vendorName: v.name || "Your Business",
            vendorCategory: v.category || "Vendor",
            vendorAvatar: v.logo || "",
            vendorCity: lead.city || v.city || "Kerala",
            customerName: lead.customer_name || "New Client",
            customerEmail: lead.customer_email,
            customerPhone: lead.customer_phone,
            eventType: lead.event_type || "Wedding",
            eventDate: lead.event_date,
            guestCount: lead.guest_count,
            estimatedBudget: lead.estimated_budget,
            status: leadQuotes.length > 0 ? "quoted" : lead.status || "new",
            unreadCount: lead.status === "new" ? 1 : 0,
            lastMessageSnippet: latestMsg ? latestMsg.text : (lead.message || "Customer requested quote."),
            lastMessageTime: latestMsg ? latestMsg.createdAt : "Recently",
            messages: msgs,
          };
        });
      }
    }

    const totalUnread = dbConversations.reduce((sum, c) => sum + (c.unreadCount || 0), 0);

    return NextResponse.json({
      success: true,
      statusCode: 200,
      data: {
        conversations: dbConversations,
        totalUnread,
        authenticatedUser: customerUser
          ? { name: customerUser.fullName, email: customerUser.email, role: "customer" }
          : (vendorAuth && vendorAuth.user ? { name: vendorAuth.user.fullName || vendorAuth.user.email || "Vendor", role: "vendor" } : null),
      },
    });
  } catch (err: any) {
    console.error("[MESSAGES_API_GET] Error:", err);
    return NextResponse.json({
      success: true,
      statusCode: 200,
      data: {
        conversations: [],
        totalUnread: 0,
        authenticatedUser: null,
      },
    });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { leadId, conversationId, text, sender = "customer" } = body;

    if (!text || !text.trim()) {
      return NextResponse.json(
        { success: false, statusCode: 400, error: { message: "Message content cannot be blank." } },
        { status: 400 }
      );
    }

    const trimmedText = text.trim();

    // If attached to a genuine database lead, record activity in Supabase
    if (leadId) {
      await supabaseFetch(`lead_activities`, {
        method: "POST",
        headers: { Prefer: "return=representation" },
        body: JSON.stringify({
          lead_id: leadId,
          activity_type: sender === "vendor" ? "vendor_message" : "client_message",
          description: trimmedText,
        }),
      }).catch((e) => {
        console.warn("[MESSAGES_API_POST] lead_activities write warning:", e);
        return null;
      });
    }

    const newMessage: ChatMessage = {
      id: `msg-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      sender,
      senderName: sender === "customer" ? "You" : "Vendor Team",
      text: trimmedText,
      createdAt: new Date().toLocaleTimeString("en-IN", { hour: "numeric", minute: "2-digit" }),
      isRead: true,
    };

    return NextResponse.json({
      success: true,
      statusCode: 201,
      data: {
        message: newMessage,
        conversationId,
      },
    });
  } catch (err: any) {
    console.error("[MESSAGES_API_POST] Error:", err);
    return NextResponse.json(
      { success: false, statusCode: 500, error: { message: "Failed to send message." } },
      { status: 500 }
    );
  }
}
