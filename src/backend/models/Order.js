const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema({
  deal: { type: mongoose.Schema.Types.ObjectId, ref: "Deal", required: true },
  name: String,
  qty: Number,
  unitPrice: Number,        // what user actually paid
  originalPrice: Number,    // MRP / original (to compute savings)
});

const orderSchema = new mongoose.Schema(
  {
    vendor: { type: mongoose.Schema.Types.ObjectId, ref: "Vendor", required: true },
    items: [orderItemSchema],
    totalPaid: Number,
    totalOriginal: Number,   // sum(originalPrice * qty)
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
