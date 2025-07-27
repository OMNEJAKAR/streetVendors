// server.js
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const vendorRoutes = require("./routes/vendor");
const dealsRoutes = require("./routes/deals");
const storageRoutes = require("./routes/storage");

const app = express();

// Improved CORS configuration
app.use(cors({
  origin: "*", // Allow all origins for now (you can restrict later)
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
}));

app.use(express.json());

// Add error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: "Internal server error" });
});

// Routes
app.use("/api/vendor", vendorRoutes);
app.use("/api/deals", dealsRoutes);
app.use("/api/storage", storageRoutes);

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({ status: "OK" });
});

const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
    app.listen(PORT, () => console.log(`Server running on ${PORT}`));
  })
  .catch((e) => {
    console.error("MongoDB connection error:", e);
    process.exit(1);
  });