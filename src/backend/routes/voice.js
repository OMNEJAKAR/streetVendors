const express = require("express");
const multer = require("multer");
const router = express.Router();
const { transcribeAudio } = require("../../lib/transcribe"); // External logic
const Product = require("../models/Product");

const upload = multer({ storage: multer.memoryStorage() });

router.post("/search", upload.single("audio"), async (req, res) => {
  try {
    if (!req.file) {
      return res.json({ transcript: "", matches: [] });
    }

    const transcript = await transcribeAudio(req.file.buffer); // Implement this!
    const matches = await Product.find({
      name: { $regex: transcript, $options: "i" },
    });

    res.json({ transcript, matches });
  } catch (e) {
    console.error("Voice search failed:", e);
    res.status(500).json({ transcript: "", matches: [] });
  }
});

module.exports = router;