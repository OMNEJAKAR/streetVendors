const express = require("express");
const BulkGroup = require("../models/BulkGroup");
const BulkGroupParticipation = require("../models/BulkGroupParticipation");
const auth = require("../middleware/auth"); // Ensure token-based auth works

const router = express.Router();

// GET all bulk groups
router.get("/", async (req, res) => {
  try {
    const groups = await BulkGroup.find();
    res.json(groups);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch bulk groups" });
  }
});

// JOIN a bulk group
router.post("/join/:id", auth, async (req, res) => {
  try {
    const groupId = req.params.id;
    const vendorId = req.user.id; // Comes from JWT

    const bulkGroup = await BulkGroup.findById(groupId);
    if (!bulkGroup) return res.status(404).json({ message: "Group not found" });

    // Increment current quantity
    bulkGroup.currentQty += 1;
    await bulkGroup.save();

    // Save participation
    const participation = new BulkGroupParticipation({
      vendor: vendorId,
      bulkGroup: groupId,
      qty: 1,
      joinedAt: new Date(),
    });
    await participation.save();

    res.json({ message: "Joined successfully", bulkGroup });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to join group" });
  }
});

module.exports = router;
