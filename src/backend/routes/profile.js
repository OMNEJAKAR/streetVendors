const express = require("express");
const auth = require("../middleware/auth");
const Vendor = require("../models/Vendors");
const Order = require("../models/Order");
const BulkGroupParticipation = require("../models/BulkGroupParticipation");
const BulkGroup = require("../models/BulkGroup");

const router = express.Router();

router.get("/", auth, async (req, res) => {
  try {
    const vendorId = req.user.id;

    // Fetch vendor details
    const vendor = await Vendor.findById(vendorId).select("name username phone");

    // Fetch vendor orders
    const orders = await Order.find({ vendor: vendorId }).sort({ createdAt: -1 });

    // Fetch bulk group participations
    const participations = await BulkGroupParticipation.find({ vendor: vendorId })
      .populate("bulkGroup");

    // Calculate totals
    const amountSpent = orders.reduce((sum, o) => sum + (o.totalPaid || 0), 0);
    const amountOriginal = orders.reduce((sum, o) => sum + (o.totalOriginal || 0), 0);
    const profit = amountOriginal - amountSpent;

    // Fake credit score (you can adjust logic)
    const creditScore = Math.min(900, 600 + Math.floor(amountSpent / 1000));

    // Prepare bulk group data
    const bulkGroups = participations
      .filter((p) => p.bulkGroup) // skip if group is deleted
      .map((p) => ({
        id: p.bulkGroup._id,
        name: p.bulkGroup.name,
        bulkPrice: p.bulkGroup.bulkPrice,
        actualPrice: p.bulkGroup.actualPrice,
        minQtyTarget: p.bulkGroup.minQtyTarget,
        currentQty: p.bulkGroup.currentQty,
        deadline: p.bulkGroup.deadline,
        qty: p.qty || 0,
        joinedAt: p.joinedAt,
      }));

    res.json({
      vendor,
      stats: {
        amountSpent,
        amountOriginal,
        profit,
        creditScore,
        totalOrders: orders.length,
        bulkGroupsJoined: bulkGroups.length,
      },
      orders,
      bulkGroups,
    });
  } catch (e) {
    console.error("Profile fetch error:", e);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
