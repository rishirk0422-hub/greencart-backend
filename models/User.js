const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  mobile: String,
  expectedPrice: String, // for user (seller)
  role: {
    type: String,
    enum: ["user", "collector"],
  },

  address: String, // ✅ important for collector
});

module.exports = mongoose.model("User", userSchema);