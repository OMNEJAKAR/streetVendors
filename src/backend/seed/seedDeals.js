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
          "https://th.bing.com/th/id/R.aec693d88f7ae4951e40d09628bf0d51?rik=CW53xf12MiejtQ&riu=http%3a%2f%2fwww.ppfoods.in%2frice-flour-bowl-363077472.jpg&ehk=hOO1hVHoOQGYVvEvdZI%2fg4YkuMZv4CN%2b5X7h%2bPwpujE%3d&risl=&pid=ImgRaw&r=0",
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
          "https://th.bing.com/th/id/R.aec693d88f7ae4951e40d09628bf0d51?rik=CW53xf12MiejtQ&riu=http%3a%2f%2fwww.ppfoods.in%2frice-flour-bowl-363077472.jpg&ehk=hOO1hVHoOQGYVvEvdZI%2fg4YkuMZv4CN%2b5X7h%2bPwpujE%3d&risl=&pid=ImgRaw&r=0",
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
          "https://tse3.mm.bing.net/th/id/OIP.JMRIOYp2jmlICSlEma_3gQHaE7?rs=1&pid=ImgDetMain&o=7&rm=3",
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
