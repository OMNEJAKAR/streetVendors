const express = require("express");
const router = express.Router();
const Deal = require("../models/Deal");

// GET all deals or filter by type (e.g., surplus)
router.get("/", async (req, res) => {
  try {
    const { type } = req.query;
    const query = type ? { type } : {};
    const deals = await Deal.find(query).sort({ createdAt: -1 });
    res.json(deals);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch deals" });
  }
});

module.exports = router;
