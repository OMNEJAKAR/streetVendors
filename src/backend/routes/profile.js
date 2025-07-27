const express = require("express");
// const auth = require("../middleware/auth");  // <- not using it now
const Vendor = require("../models/Vendors");
const Order = require("../models/Order");
const BulkGroupParticipation = require("../models/BulkGroupParticipation");

const router = express.Router();

// GET /api/profile/:vendorId
router.get("/:vendorId", async (req, res) => {
  try {
    const vendorId = req.params.vendorId;   // <— use param instead of req.user
    if (!vendorId) return res.status(400).json({ message: "vendorId is required" });

    const vendor = await Vendor.findById(vendorId).select("name username phone");
    if (!vendor) return res.status(404).json({ message: "Vendor not found" });

    const orders = await Order.find({ vendor: vendorId }).sort({ createdAt: -1 });

    const participations = await BulkGroupParticipation
      .find({ vendor: vendorId })
      .populate("bulkGroup");

    const amountSpent    = orders.reduce((sum, o) => sum + (o.totalPaid || 0), 0);
    const amountOriginal = orders.reduce((sum, o) => sum + (o.totalOriginal || 0), 0);
    const profit         = amountOriginal - amountSpent;
    const creditScore    = Math.min(900, 600 + Math.floor(amountSpent / 1000));

    res.json({
      vendor,
      stats: {
        amountSpent,
        amountOriginal,
        profit,
        creditScore,
        totalOrders: orders.length,
        bulkGroupsJoined: participations.length,
      },
      orders,
      bulkGroups: participations
        .filter(p => p.bulkGroup)   // safety
        .map(p => ({
          id: p.bulkGroup._id,
          name: p.bulkGroup.name,
          bulkPrice: p.bulkGroup.bulkPrice,
          actualPrice: p.bulkGroup.actualPrice,
          minQtyTarget: p.bulkGroup.minQtyTarget,
          currentQty: p.bulkGroup.currentQty,
          deadline: p.bulkGroup.deadline,
          qty: p.qty || 0,
          joinedAt: p.joinedAt,
        })),
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
