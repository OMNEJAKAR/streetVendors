const mongoose = require("mongoose");

const creditTxnSchema = new mongoose.Schema(
  {
    type: { type: String, enum: ["borrow", "repay", "interest"], required: true },
    amount: { type: Number, required: true },
    balanceAfter: { type: Number, required: true },
    note: String,
    createdAt: { type: Date, default: Date.now },
    dueDate: Date,            // only for borrow
    interestRate: Number,     // snapshot
  },
  { _id: false }
);

const vendorSchema = new mongoose.Schema(
  {
    name: String,
    username: { type: String, unique: true },
    phone: String,
    area: String,
    foodType: String,
    passwordHash: String,

    // Loyalty
    level: { type: String, default: "Bronze" },   // Bronze, Silver, Gold, Platinum
    xp: { type: Number, default: 0 },             // used for level progress
    rating: { type: Number, default: 0 },         // 0..5
    coins: { type: Number, default: 0 },

    // Spend / profit stats (denormalized for quick read)
    amountSpent: { type: Number, default: 0 },
    profit: { type: Number, default: 0 },

    // Credit
    creditLimit: { type: Number, default: 5000 },
    creditUsed: { type: Number, default: 0 },
    creditTxns: [creditTxnSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Vendor", vendorSchema);
