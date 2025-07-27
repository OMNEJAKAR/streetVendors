const express = require("express");
const Vendor = require("../models/Vendors");
const { onTimeRepayRewards, getLevelFromXp, LEVELS } = require("../services/loyalty");

const router = express.Router();
const INTEREST_RATE = 0.015; // 1.5% per month
const GRACE_DAYS = 15;

// Borrow
router.post("/borrow", async (req, res) => {
  try {
    const { vendorId, amount } = req.body;
    const v = await Vendor.findById(vendorId);
    if (!v) return res.status(404).json({ message: "Vendor not found" });

    if (amount <= 0) return res.status(400).json({ message: "Invalid amount" });
    if (v.creditUsed + amount > v.creditLimit)
      return res.status(400).json({ message: "Credit limit exceeded" });

    v.creditUsed += amount;

    const dueDate = new Date();
    dueDate.setMonth(dueDate.getMonth() + 1);

    v.creditTxns.push({
      type: "borrow",
      amount,
      balanceAfter: v.creditUsed,
      dueDate,
      interestRate: INTEREST_RATE,
    });

    await v.save();
    res.json({ creditUsed: v.creditUsed, creditLimit: v.creditLimit, dueDate });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Server error" });
  }
});

// Repay
router.post("/repay", async (req, res) => {
  try {
    const { vendorId, amount } = req.body;
    const v = await Vendor.findById(vendorId);
    if (!v) return res.status(404).json({ message: "Vendor not found" });
    if (amount <= 0) return res.status(400).json({ message: "Invalid amount" });

    const oldUsed = v.creditUsed;
    v.creditUsed = Math.max(0, v.creditUsed - amount);

    v.creditTxns.push({
      type: "repay",
      amount,
      balanceAfter: v.creditUsed,
    });

    // reward for on-time repayment (simple: any repayment when creditUsed decreased)
    if (v.creditUsed < oldUsed) {
      const { xp, coins } = onTimeRepayRewards(amount);
      v.xp += xp;
      v.coins += coins;
      v.level = getLevelFromXp(v.xp).name;
    }

    await v.save();
    res.json({
      creditUsed: v.creditUsed,
      coins: v.coins,
      xp: v.xp,
      level: v.level,
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Server error" });
  }
});

// Quick status widget API
router.get("/status/:vendorId", async (req, res) => {
  const v = await Vendor.findById(req.params.vendorId).select(
    "level xp coins creditLimit creditUsed amountSpent profit rating"
  );
  if (!v) return res.status(404).json({ message: "Vendor not found" });

  const currentLevel = getLevelFromXp(v.xp);
  // find next level requirement
  const next = LEVELS.find((l) => l.minXp > currentLevel.minXp);
  const nextXp = next ? next.minXp : currentLevel.minXp; // last level has no next
  const progress =
    next ? Math.min(100, Math.round(((v.xp - currentLevel.minXp) / (nextXp - currentLevel.minXp)) * 100))
         : 100;

  res.json({
    level: v.level,
    rating: v.rating,
    xp: v.xp,
    coins: v.coins,
    amountSpent: v.amountSpent,
    profit: v.profit,
    credit: {
      limit: v.creditLimit,
      used: v.creditUsed,
      available: v.creditLimit - v.creditUsed,
    },
    levelProgress: progress,
    nextLevelAt: next ? next.minXp : null,
  });
});

module.exports = router;
