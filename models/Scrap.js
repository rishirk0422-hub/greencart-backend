const mongoose = require("mongoose");

const scrapSchema = new mongoose.Schema(
  {
    type: String,
    weight: String,
    address: String,
    expectedPrice: String,
    status: {
      type: String,
      default: "pending"
    },

    // 👤 USER WHO CREATED
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },

    // 🚚 COLLECTOR INFO
    collectorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    collectorName: String,
    collectorAddress: String
  },
  {
    timestamps: true // ✅ adds createdAt & updatedAt
  }
);

module.exports = mongoose.model("Scrap", scrapSchema);