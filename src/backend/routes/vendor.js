const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Vendor = require("../models/Vendors");

const router = express.Router();

// POST /api/vendor/register
router.post("/register", async (req, res) => {
  try {
    const { name, phone, area, foodType, username, password } = req.body;

    const exists = await Vendor.findOne({ $or: [{ username }, { phone }] });
    if (exists) return res.status(409).json({ message: "User already exists" });

    const passwordHash = await bcrypt.hash(password, 10);

    await Vendor.create({
      name,
      phone,
      area,
      foodType,
      username,
      passwordHash,
    });

    return res.status(201).json({ message: "Registered successfully" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
});

// POST /api/vendor/login
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    const vendor = await Vendor.findOne({ username });
    if (!vendor) return res.status(401).json({ message: "Invalid credentials" });

    const match = await bcrypt.compare(password, vendor.passwordHash);
    if (!match) return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { id: vendor._id, username: vendor.username },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.json({ token, vendor: { id: vendor._id, name: vendor.name } });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
