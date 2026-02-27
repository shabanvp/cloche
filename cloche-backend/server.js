const express = require("express");
const cors = require("cors");
const multer = require("multer");
const path = require("path");

try {
  const authRoutes = require("./auth");
  const productRoutes = require("./products");
  const leadRoutes = require("./leads");
  const messageRoutes = require("./messages");

  const app = express();

  app.use(cors());
  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));

  app.use(express.static(path.join(__dirname, "..", "public")));
  app.use("/uploads", express.static("uploads"));

  // Root route -> serve landing page at domain root
  app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "public", "index.html"));
  });

  // Health endpoint for uptime checks
  app.get("/api/health", (req, res) => {
    res.json({ message: "CLOCHE Server is running", status: "online" });
  });

  app.use("/api/auth", authRoutes);
  app.use("/api/products", productRoutes);
  app.use("/api/leads", leadRoutes);
  app.use("/api/messages", messageRoutes);

  // Global Error Handler
  app.use((err, req, res, next) => {
    console.error("Global Error Handler Catch:", err);
    if (err instanceof multer.MulterError) {
      return res.status(400).json({ message: `Upload Error: ${err.message}` });
    }
    res.status(500).json({ message: err.message || "Internal Server Error" });
  });

  // 404 Handler
  app.use((req, res) => {
    res.status(404).json({ message: `Route not found: ${req.method} ${req.originalUrl}` });
  });

  const PORT = Number(process.env.PORT) || 5001;
  const HOST = process.env.HOST || "0.0.0.0";
  app.listen(PORT, HOST, () => {
    console.log(`CLOCHE Server: http://localhost:${PORT}`);
    console.log(`Landing Page: http://localhost:${PORT}/`);
  });
} catch (error) {
  console.error("Server Error:", error.message);
  console.error("Stack:", error.stack);
  process.exit(1);
}
