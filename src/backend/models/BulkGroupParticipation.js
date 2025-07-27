const mongoose = require("mongoose");

const bulkGroupParticipationSchema = new mongoose.Schema(
  {
    vendor: { type: mongoose.Schema.Types.ObjectId, ref: "Vendor", required: true },
    bulkGroup: { type: mongoose.Schema.Types.ObjectId, ref: "BulkGroup", required: true },
    qty: { type: Number, default: 0 },
    joinedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.model("BulkGroupParticipation", bulkGroupParticipationSchema);
