const mongoose = require("mongoose");

const dealSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    category: { type: String, required: true },
    price: { type: Number, required: true },
    originalPrice: { type: Number, required: true },
    discount: { type: Number, required: true },
    stock: { type: Number, required: true },          // <- NUMBER
    expires: { type: Date, required: true },
    condition: { type: String, enum: ["Fresh", "Good", "Average"], default: "Fresh" },
    tags: [{ type: String }],
    status: { type: String, default: "" },            // e.g. "Extra Stock"
    imageUrl: { type: String },
    type: { type: String, enum: ["surplus", "active"], required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Deal", dealSchema);
