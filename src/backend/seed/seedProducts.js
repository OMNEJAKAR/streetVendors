require("dotenv").config();
const mongoose = require("mongoose");
const Product = require("../models/Product");

const data = [
  {
    name: "Tomatoes (Fresh)",
    category: "Vegetables",
    price: 20,
    originalPrice: 28,
    unit: "kg",
    stock: 120,
    imageUrl: "https://tse3.mm.bing.net/th/id/OIP.JMRIOYp2jmlICSlEma_3gQHaE7?rs=1&pid=ImgDetMain&o=7&rm=3", // climb close-up ripe tomatoes :contentReference[oaicite:2]{index=2}
    description: "Farm fresh tomatoes",
    tags: ["fresh", "local"],
  },
  {
    name: "Basmati Rice 25kg",
    category: "Grains",
    price: 1450,
    originalPrice: 1650,
    unit: "bag",
    stock: 30,
    imageUrl: "https://tse1.mm.bing.net/th/id/OIP.v7lLiTThX1UppEvhlSzdzwHaJ4?rs=1&pid=ImgDetMain&o=7&rm=3", // burlap rice bags :contentReference[oaicite:3]{index=3}
    description: "Premium long grain basmati rice",
    tags: ["bulk", "wholesale"],
  },
  {
    name: "Onions (Nasik)",
    category: "Vegetables",
    price: 22,
    originalPrice: 28,
    unit: "kg",
    stock: 500,
    imageUrl: "https://tse3.mm.bing.net/th/id/OIP.gFx6NiKHARprKWoPaUasoQHaFd?rs=1&pid=ImgDetMain&o=7&rm=3", // pile of onions close-up :contentReference[oaicite:4]{index=4}
    description: "A‑grade onions from Nasik",
    tags: ["bulk"],
  },
  {
    name: "Refined Sunflower Oil 5L",
    category: "Oil & Ghee",
    price: 780,
    originalPrice: 850,
    unit: "can",
    stock: 50,
    imageUrl: "https://th.bing.com/th/id/OIP.m7Nhf8UeKj_duCUPhnWXQQHaDt?w=304&h=175&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3", // cooking oil bottle :contentReference[oaicite:5]{index=5}
    description: "Light and healthy sunflower oil",
    tags: ["cooking", "bulk"],
  },
  {
    name: "Masoor Dal 1kg",
    category: "Pulses",
    price: 95,
    originalPrice: 110,
    unit: "packet",
    stock: 100,
    imageUrl: "https://th.bing.com/th/id/OIP.dcf2GnWz92w5zwddQqallgHaHa?w=123&h=180&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3", // lentils bowl style (rice image but representative) :contentReference[oaicite:6]{index=6}
    description: "Protein-rich red lentils",
    tags: ["vegan", "protein"],
  },
  {
    name: "Tata Salt 1kg",
    category: "Spices & Condiments",
    price: 25,
    originalPrice: 32,
    unit: "packet",
    stock: 150,
    imageUrl: "https://th.bing.com/th/id/OIP.Ot2x3xpw0v7KKG-ecaHAvgHaHa?w=130&h=180&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3", // placeholder (salt) :contentReference[oaicite:7]{index=7}
    description: "Iodized pure salt",
    tags: ["essential", "daily use"],
  },
  {
    name: "Wheat Flour 10kg",
    category: "Grains",
    price: 320,
    originalPrice: 370,
    unit: "bag",
    stock: 40,
    imageUrl: "https://th.bing.com/th/id/OIP.h3SYcHa-Sn0qx8yZOn8PCQHaEK?w=276&h=180&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3", // reuse rice bag style for grains category :contentReference[oaicite:8]{index=8}
    description: "Stone-ground whole wheat atta",
    tags: ["baking", "bulk"],
  },
  {
    name: "Green Tea Pack",
    category: "Beverages",
    price: 185,
    originalPrice: 220,
    unit: "box",
    stock: 25,
    imageUrl: "https://th.bing.com/th/id/OIP.iQ_YJYMB8qTchvsV0rMu8wHaJ4?w=129&h=180&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3", // general beverage tea cup style :contentReference[oaicite:9]{index=9}
    description: "Refreshing detox blend",
    tags: ["health", "antioxidants"],
  },
  {
    name: "Detergent Powder 1kg",
    category: "Household",
    price: 78,
    originalPrice: 95,
    unit: "packet",
    stock: 60,
    imageUrl: "https://th.bing.com/th/id/OIP.SjcQ4uSn_SfPlZWCbyBWhQHaFh?w=245&h=183&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3", // placeholder cleaning product style :contentReference[oaicite:10]{index=10}
    description: "Bright clean for tough stains",
    tags: ["cleaning", "daily use"],
  },
  {
    name: "Toor Dal 1kg",
    category: "Pulses",
    price: 120,
    originalPrice: 135,
    unit: "packet",
    stock: 80,
    imageUrl: "https://th.bing.com/th/id/OIP.fHzuclT9zQLTVOapnvOOiwHaF0?w=242&h=190&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3", // same as masoor dal lentils bowl placeholder :contentReference[oaicite:11]{index=11}
    description: "Split pigeon peas",
    tags: ["protein", "wholesale"],
  },
  {
    name: "Fresh Tomatoes 1kg",
    category: "Vegetables",
    price: 40,
    originalPrice: 50,
    unit: "kg",
    stock: 25,
    imageUrl: "https://tse3.mm.bing.net/th/id/OIP.JMRIOYp2jmlICSlEma_3gQHaE7?rs=1&pid=ImgDetMain&o=7&rm=3", // fresh tomatoes pile :contentReference[oaicite:12]{index=12}
    description: "Farm-fresh juicy tomatoes",
    tags: ["perishable", "fresh"],
  },
  {
    name: "Red Chillies 500g",
    category: "Spices & Condiments",
    price: 130,
    originalPrice: 155,
    unit: "packet",
    stock: 35,
    imageUrl: "https://th.bing.com/th/id/OIP.ocBGoNSYsKRc61r_t1lSEwHaE6?w=264&h=180&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3", // red onions but similar texture, placeholder for chillies :contentReference[oaicite:13]{index=13}
    description: "Sun-dried red chillies",
    tags: ["hot", "seasonal"],
  },
  {
    name: "Steel Scrubber Pack of 3",
    category: "Household",
    price: 45,
    originalPrice: 55,
    unit: "pack",
    stock: 70,
    imageUrl: "https://th.bing.com/th/id/OIP.Zx1oJGokCby_8HllVz-Y2gHaHa?w=173&h=180&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3", // placeholder household cleaning style :contentReference[oaicite:14]{index=14}
    description: "Durable steel scrubbers",
    tags: ["cleaning", "kitchen"],
  },
  {
    name: "Moong Dal 1kg",
    category: "Pulses",
    price: 105,
    originalPrice: 120,
    unit: "packet",
    stock: 85,
    imageUrl: "https://th.bing.com/th/id/OIP.UYCFngu8AikXdFcX54dqOwEyDM?w=294&h=196&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3", // same lentils placeholder :contentReference[oaicite:15]{index=15}
    description: "Split yellow gram",
    tags: ["light", "protein"],
  },
  {
    name: "Garam Masala 100g",
    category: "Spices & Condiments",
    price: 55,
    originalPrice: 65,
    unit: "packet",
    stock: 45,
    imageUrl: "https://th.bing.com/th/id/OIP.x-KyR2FOS_16-lRmxgd2ZAHaE8?w=304&h=203&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3", // placeholder spices jar/red product :contentReference[oaicite:16]{index=16}
    description: "Fragrant spice blend",
    tags: ["aromatic", "cooking"],
  },
  {
    name: "Fresh Milk 1L",
    category: "Dairy",
    price: 58,
    originalPrice: 62,
    unit: "bottle",
    stock: 90,
    imageUrl: "https://th.bing.com/th/id/OIP.Og9b5khSVRBNSoBZu7J8UwHaLI?w=186&h=280&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3", // placeholder bottle style :contentReference[oaicite:17]{index=17}
    description: "Pasteurized farm milk",
    tags: ["perishable", "daily use"],
  },
  {
    name: "Besan 1kg",
    category: "Flour & Baking",
    price: 85,
    originalPrice: 95,
    unit: "packet",
    stock: 50,
    imageUrl: "https://th.bing.com/th/id/OIP.IV_BekInnhznYjIozKzqLwHaE8?w=277&h=185&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3", // grains style placeholder :contentReference[oaicite:18]{index=18}
    description: "Finely ground chickpea flour",
    tags: ["baking", "protein"],
  },
  {
    name: "Parle-G Biscuits 800g",
    category: "Snacks",
    price: 85,
    originalPrice: 95,
    unit: "pack",
    stock: 120,
    imageUrl: "https://th.bing.com/th/id/OIP.o0pK9Ganj9SgBFtxDsQmnwHaE0?w=264&h=180&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3", // snack/food shot placeholder :contentReference[oaicite:19]{index=19}
    description: "Classic glucose biscuits",
    tags: ["snack", "children"],
  },
  {
    name: "Coriander Powder 200g",
    category: "Spices & Condiments",
    price: 48,
    originalPrice: 55,
    unit: "packet",
    stock: 40,
    imageUrl: "https://th.bing.com/th/id/OIP.CeniWrIMCs8C97ApvuYMHgHaE8?w=301&h=200&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3", // spice texture placeholder :contentReference[oaicite:20]{index=20}
    description: "Ground coriander seeds",
    tags: ["aromatic", "essential"],
  },
  {
    name: "Onions 1kg",
    category: "Vegetables",
    price: 35,
    originalPrice: 45,
    unit: "kg",
    stock: 60,
    imageUrl: "https://tse3.mm.bing.net/th/id/OIP.gFx6NiKHARprKWoPaUasoQHaFd?rs=1&pid=ImgDetMain&o=7&rm=3", // onions pile :contentReference[oaicite:21]{index=21}
    description: "Locally sourced onions",
    tags: ["essential", "fresh"],
  },
  {
    name: "Plastic Storage Box 10L",
    category: "Household",
    price: 110,
    originalPrice: 135,
    unit: "piece",
    stock: 20,
    imageUrl: "https://th.bing.com/th/id/OIP.6jXnz36KbbDDlOqGrelcfAHaHa?w=190&h=190&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3", // placeholder household product :contentReference[oaicite:22]{index=22}
    description: "Transparent durable plastic",
    tags: ["storage", "utility"],
  }
];

(async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Mongo connected");
    await Product.deleteMany({});
    await Product.insertMany(data);
    console.log("✅ Seeded products:", data.length);
    process.exit(0);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
})();