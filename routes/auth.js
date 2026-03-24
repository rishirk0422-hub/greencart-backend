const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const SECRET = "9923493506"

// SIGNUP
router.post("/signup", async (req, res) => {
    try {
      const { name, email, password, role, address } = req.body;
  
      // 🛑 collector must have address
      if (role === "collector" && !address) {
        return res.status(400).json({ msg: "Address required for collector" });
      }
  
      const user = await User.create({
        name,
        email,
        password,
        role,
        address
      });
  
      res.json({ msg: "Signup success" });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

// LOGIN
router.post("/login", async (req, res) => {
    try {
      const { email, password, role } = req.body;
  
      const user = await User.findOne({ email, password });
  
      if (!user) {
        return res.status(400).json({ msg: "Invalid credentials" });
      }
  
      // 🚨 ROLE CHECK
      if (user.role !== role) {
        return res.status(403).json({ msg: "Wrong role selected" });
      }
  
      const token = jwt.sign(
        { id: user._id, role: user.role },
        SECRET
      );
  
      res.json({
        token,
        user
      });
  
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

module.exports = router;