// server.js
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dealsRoutes = require("./routes/deals");
const vendorRoutes = require("./routes/vendor");
const bulkGroupRoutes = require("./routes/bulkgroups");
const creditRoutes = require("./routes/credit");
const profileRoutes = require("./routes/profile");
const storageRoutes = require("./routes/storage");
const products = require("./routes/products");
const voiceRoutes = require("../backend/routes/voice");

// const voiceRoutes = require("./routes/voice");

const app = express();
app.use(cors({
  origin: "*", // Allow all origins for now (you can restrict later)
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
}));
app.use(express.json());

app.use("/api/vendor", vendorRoutes);
app.use("/api/deals", dealsRoutes);
app.use("/api/bulk-groups", bulkGroupRoutes);
app.use("/api/credit", creditRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/storage", storageRoutes);
app.use("/api/products", products);
// app.use("/api/voice", voiceRoutes);
app.use("/api/voice", voiceRoutes);


app.post("/search", async (req, res) => {
  try {
    const { transcript } = req.body;

    if (!transcript) {
      return res.json({ transcript: "", matches: [] });
    }

    // Perform case-insensitive search
    const matches = await Product.find({
      name: { $regex: transcript, $options: "i" }
    });

    res.json({ transcript, matches });
  } catch (error) {
    console.error("Search error:", error);
    res.status(500).json({ transcript: "", matches: [] });
  }
});


const PORT =  5000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
    app.listen(PORT, () => console.log(`Server running on ${PORT}`));
  })
  .catch((e) => console.error(e));
