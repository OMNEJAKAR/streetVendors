const mongoose = require("mongoose");

const bulkGroupSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    category: { type: String, required: true },
    actualPrice: { type: Number, required: true },
    bulkPrice: { type: Number, required: true }, // lower than actual
    minQtyTarget: { type: Number, required: true }, // target quantity to unlock price
    currentQty: { type: Number, default: 0 },
    participants: { type: Number, default: 0 },
    deadline: { type: Date, required: true },
    imageUrl: { type: String },
    unit: { type: String, default: "kg" },
    desc: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("BulkGroup", bulkGroupSchema);
