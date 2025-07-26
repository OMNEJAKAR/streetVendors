require("dotenv").config();
const mongoose = require("mongoose");
const Deal = require("../models/Deal");

(async function seed() {
  try {
    if (!process.env.MONGO_URI) {
      console.error("MONGO_URI missing in .env");
      process.exit(1);
    }

    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Mongo connected");

    // Optional: wipe collection first
    await Deal.deleteMany({});
    console.log("🧹 Cleared deals collection");

    const now = new Date();
    const docs = [
      {
        name: "Fresh Potatoes",
        category: "Vegetables",
        price: 15,
        originalPrice: 25,
        discount: 40,
        stock: 50, // number!
        expires: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 3),
        condition: "Fresh",
        tags: ["Fresh", "Local", "Bulk"],
        status: "Extra Stock",
        imageUrl:
          "https://images.unsplash.com/photo-1604908177233-4ab9a97a52f3?crop=entropy&cs=tinysrgb&fit=crop&w=400&q=80",
        type: "surplus",
      },
      {
        name: "Rice Flour",
        category: "Grains",
        price: 30,
        originalPrice: 45,
        discount: 33,
        stock: 20,
        expires: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1),
        condition: "Good",
        tags: ["Premium", "Organic"],
        status: "Near Expiry",
        imageUrl:
          "https://images.unsplash.com/photo-1627323479905-3e5b2f989833?crop=entropy&cs=tinysrgb&fit=crop&w=400&q=80",
        type: "surplus",
      },
      {
        name: "Fresh Tomatoes",
        category: "Vegetables",
        price: 20,
        originalPrice: 30,
        discount: 33,
        stock: 30,
        expires: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 2),
        condition: "Fresh",
        tags: ["Fresh", "Local"],
        status: "",
        imageUrl:
          "https://images.unsplash.com/photo-1617159861239-0b7f8c7d7c5b?crop=entropy&cs=tinysrgb&fit=crop&w=400&q=80",
        type: "active",
      },
    ];

    const inserted = await Deal.insertMany(docs);
    console.log(`✅ Inserted ${inserted.length} deals`);

    const count = await Deal.countDocuments();
    console.log(`📊 Total deals in DB now: ${count}`);

    process.exit(0);
  } catch (e) {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  }
})();
