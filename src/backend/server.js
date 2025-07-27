// server.js
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const profileRoutes = require("./routes/profile");


const vendorRoutes = require("./routes/vendor");
const dealsRoutes = require("./routes/deals");

const app = express();
app.use(cors({ origin: "http://localhost:3000", credentials: true  }));
app.use(express.json());

app.use("/api/vendor", vendorRoutes);
app.use("/api/deals", dealsRoutes);
app.use("/api/profile", profileRoutes);

const PORT = process.env.PORT || 5000;
console.log("MONGO_URI =", process.env.MONGO_URI);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
    app.listen(PORT, () => console.log(`Server running on ${PORT}`));
  })
  .catch((e) => console.error(e));
