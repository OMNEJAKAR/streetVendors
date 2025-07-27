require("dotenv").config();
const mongoose = require("mongoose");
const BulkGroup = require("../models/BulkGroup");

(async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Mongo connected");

    await BulkGroup.deleteMany({});
    console.log("🧹 Cleared bulk groups");

    const now = new Date();
    const docs = [
      {
        name: "Onions (Nasik A Grade)",
        category: "Vegetables",
        actualPrice: 28,
        bulkPrice: 22,
        minQtyTarget: 500,     // 500 kg
        currentQty: 120,
        participants: 8,
        deadline: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 3),
        unit: "kg",
        imageUrl: "https://images.unsplash.com/photo-1508747703725-719777637510?w=400&q=80",
        desc: "Fresh A-grade onions directly from farmers.",
      },
      {
        name: "Basmati Rice (25kg bag)",
        category: "Grains",
        actualPrice: 1600,
        bulkPrice: 1400,
        minQtyTarget: 100,     // 100 bags
        currentQty: 35,
        participants: 12,
        deadline: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 5),
        unit: "bag",
        imageUrl: "https://images.unsplash.com/photo-1604908554049-1d9311c7f2b2?w=400&q=80",
        desc: "Premium basmati rice, 25kg pack.",
      },
      {
        name: "Refined Sunflower Oil (15L can)",
        category: "Oil",
        actualPrice: 1650,
        bulkPrice: 1499,
        minQtyTarget: 200,
        currentQty: 70,
        participants: 25,
        deadline: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 2),
        unit: "can",
        imageUrl: "https://images.unsplash.com/photo-1510627498534-cf7e9002facc?w=400&q=80",
        desc: "Refined sunflower oil, FSSAI certified.",
      },
    ];

    const inserted = await BulkGroup.insertMany(docs);
    console.log(`✅ Inserted ${inserted.length} bulk groups`);
    process.exit(0);
  } catch (e) {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  }
})();
