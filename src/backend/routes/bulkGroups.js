const express = require("express");
const BulkGroup = require("../models/BulkGroup");
const BulkGroupParticipation = require("../models/BulkGroupParticipation");

const router = express.Router();

// Get all bulk groups
router.get("/", async (req, res) => {
  try {
    const groups = await BulkGroup.find();
    res.json(groups);
  } catch (e) {
    res.status(500).json({ message: "Failed to fetch bulk groups" });
  }
});

// Join bulk group (no auth)
router.post("/join/:id", async (req, res) => {
  try {
    const groupId = req.params.id;
    const bulkGroup = await BulkGroup.findById(groupId);
    if (!bulkGroup) return res.status(404).json({ message: "Group not found" });

    bulkGroup.currentQty += req.body.qty || 1;
    await bulkGroup.save();

    res.json({ message: "Joined successfully", group: bulkGroup });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Failed to join group" });
  }
});

// POST /api/bulk-groups/:id/join
router.post("/:id/join", async (req, res) => {
  try {
    const { vendorId, qty } = req.body; // Expect vendorId from frontend

    const bulkGroup = await BulkGroup.findById(req.params.id);
    if (!bulkGroup) return res.status(404).json({ message: "Group not found" });

    bulkGroup.currentQty += qty || 1;
    bulkGroup.participants += 1;
    await bulkGroup.save();

    // Create participation record
    await BulkGroupParticipation.create({
      vendor: vendorId,
      bulkGroup: bulkGroup._id,
      qty,
    });

    res.json({ message: "Joined successfully", group: bulkGroup });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Failed to join group" });
  }
});


module.exports = router;
