// seed.js
require('dotenv').config();
const mongoose = require("mongoose");
const StorageProvider = require("../models/StorageProvider");

mongoose.connect(process.env.MONGO_URI, {
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
  {
  "name": "Eco Dry Storage",
  "type": "Dry",
  "location": "Hyderabad",
  "distance": 8,
  "ratePerKgPerDay": 1.5,
  "capacity": 800,
  "availableCapacity": 320,
  "rating": "4.0",
  "contact": "7654321098",
  "amenities": [
    "Pest Control",
    "Fire Safety System",
    "Humidity Control"
  ],
  "isActive":true
},
{
  "name": "Premium Cold Storage",
  "type": "Cold",
  "location": "Chennai",
  "distance": 15,
  "ratePerKgPerDay": 3,
  "capacity": 1500,
  "availableCapacity": 950,
  "rating": "4.5",
  "contact": "8765432109",
  "amenities": [
    "24x7 Access",
    "Security Cameras",
    "Temperature Monitoring",
    "Insurance"
  ],
  "isActive": true
}
];

StorageProvider.insertMany(dummyProviders)
  .then(() => {
    console.log("✅ Dummy data inserted");
    mongoose.disconnect();
  })
  .catch((err) => {
    console.error("❌ Insert error:", err);
  });