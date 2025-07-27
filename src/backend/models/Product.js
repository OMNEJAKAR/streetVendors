const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    category: { type: String, required: true, trim: true },   // Vegetables, Fruits, Grains, etc.
    price: { type: Number, required: true },                   // Selling price
    originalPrice: { type: Number },                           // Optional MRP/regular price
    unit: { type: String, default: "kg" },                     // kg, piece, litre, etc.
    stock: { type: Number, default: 0 },
    imageUrl: { type: String, default: "" },
    description: { type: String, default: "" },
    tags: [{ type: String }],
    isSurplus: { type: Boolean, default: false },              // if you want to reuse list for surplus
  },
  { timestamps: true }
);

// Virtual discount %
productSchema.virtual("discount").get(function () {
  if (!this.originalPrice || this.originalPrice <= 0) return 0;
  return Math.round(((this.originalPrice - this.price) / this.originalPrice) * 100);
});

productSchema.set("toJSON", { virtuals: true });
productSchema.set("toObject", { virtuals: true });
productSchema.index({ name: "text", category: "text", tags: "text" });


module.exports = mongoose.model("Product", productSchema);
