// seed.js
const mongoose = require("mongoose");
const StorageProvider = require("./models/StorageProvider");

mongoose.connect("mongodb://127.0.0.1:27017/vendormart", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const dummyProviders = [
  {
    name: "Fresh Cold Storage",
    type: "Cold",
    location: "Bangalore",
    distance: 10,
    ratePerKgPerDay: 2.5,
    capacity: 1000,
    availableCapacity: 700,
    rating: "4.2",
    contact: "9876543210",
    amenities: ["24x7 Access", "Security Cameras"],
    isActive: true,
  },
  {
    name: "Safe Dry Storage",
    type: "Dry",
    location: "Mysore",
    distance: 50,
    ratePerKgPerDay: 1.8,
    capacity: 500,
    availableCapacity: 250,
    rating: "4.5",
    contact: "9998887776",
    amenities: ["Covered", "Near Highway"],
    isActive: true,
  },
];

StorageProvider.insertMany(dummyProviders)
  .then(() => {
    console.log("✅ Dummy data inserted");
    mongoose.disconnect();
  })
  .catch((err) => {
    console.error("❌ Insert error:", err);
  });
