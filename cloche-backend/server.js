const express = require("express");
const cors = require("cors");
const multer = require("multer");
const path = require("path");

// 🔹 Load Supabase early
const supabase = require("./supabase");

// 🔹 Load routes
const authRoutes = require("./auth");
const productRoutes = require("./products");
const leadRoutes = require("./leads");
const messageRoutes = require("./messages");

const app = express();

app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// 🔹 Serve frontend
app.use(express.static(path.join(__dirname, "..", "public")));
app.use("/uploads", express.static("uploads"));

// 🔹 Root page
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "public", "index.html"));
});

// 🔹 Health check
app.get("/api/health", (req, res) => {
  res.json({ message: "CLOCHE Server is running", status: "online" });
});

// 🔹 Supabase test endpoint
app.get("/api/test-db", async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("boutiques")
      .select("id, boutique_name")
      .limit(1);

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 🔹 API routes
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/leads", leadRoutes);
app.use("/api/messages", messageRoutes);

// 🔹 Global error handler
app.use((err, req, res, next) => {
  console.error("Global Error Handler Catch:", err);
  if (err instanceof multer.MulterError) {
    return res.status(400).json({ message: `Upload Error: ${err.message}` });
  }
  res.status(500).json({ message: err.message || "Internal Server Error" });
});

// 🔹 404 handler
app.use((req, res) => {
  res.status(404).json({
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
});

// 🔹 Start server
const PORT = Number(process.env.PORT) || 5001;
const HOST = process.env.HOST || "0.0.0.0";

app.listen(PORT, HOST, () => {
  console.log(`CLOCHE Server running on port ${PORT}`);
});