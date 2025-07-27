const mongoose = require("mongoose");

const storageProviderSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, enum: ["Cold", "Dry", "Both"], required: true },
  location: { type: String, required: true },
  distance: { type: Number },
  ratePerKgPerDay: { type: Number, required: true },
  capacity: { type: Number },
  availableCapacity: { type: Number },
  rating: { type: String, default: "0" },
  contact: { type: String },
  amenities: [{ type: String }],
  isActive: { type: Boolean, default: true },
});

module.exports = mongoose.model("StorageProvider", storageProviderSchema);