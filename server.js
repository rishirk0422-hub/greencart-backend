require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

// ✅ middlewares
app.use(cors());
app.use(
  cors({
    origin: [
      "http://localhost:3000", // local
      "https://greencart-frontend-delta.vercel.app" // 🔥 replace with your real Vercel URL
    ],
    credentials: true
  })
);
app.use(express.json());



console.log("🚀 STARTING SERVER...");

// ✅ connect MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch(err => console.log("❌ DB ERROR:", err));

// ✅ routes
const authRoutes = require("./routes/auth");
app.use("/auth", authRoutes);

// ✅ models
const Scrap = require("./models/Scrap");
const User = require("./models/User");

// ✅ auth middleware
const auth = require("./middleware/auth");


// 🌐 test route
app.get("/", (req, res) => {
  res.send("API Running 🚀");
});

app.put("/scrap/:id", auth, async (req, res) => {
  try {
    const collector = await User.findById(req.user.id);

    const updated = await Scrap.findByIdAndUpdate(
      req.params.id,
      {
        status: "accepted",
        collectorId: req.user.id,
        collectorName: collector.name,
        collectorAddress: collector.address
      },
      { new: true }
    );

    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/scrap", auth, async (req, res) => {
  try {
    const scrap = await Scrap.create({
      ...req.body,
      createdBy: req.user.id, // ✅ SAVE USER ID
      exectedprice:req.body.expectedPrice
    });

    res.json(scrap);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


app.get("/scrap", auth, async (req, res) => {
  try {
    let data;

    if (req.user.role === "collector") {
      // 🚚 Collector sees:
      data = await Scrap.find({
        $or: [
          { status: "pending" }, // all pending
          { collectorId: req.user.id }, // assigned to him
        ],
      });
    } else {
      // 👤 User sees only own orders
      data = await Scrap.find({
        createdBy: req.user.id,
      });
    }

    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// ✅ ACCEPT SCRAP (COLLECTOR)
app.put("/scrap/:id", auth, async (req, res) => {
  try {
    const updated = await Scrap.findByIdAndUpdate(
      req.params.id,
      {
        status: "accepted",
        collectorId: req.user.id
      },
      { new: true }
    );

    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// ✅ COMPLETE SCRAP
app.put("/scrap/complete/:id", auth, async (req, res) => {
  try {
    const updated = await Scrap.findByIdAndUpdate(
      req.params.id,
      { status: "completed" },
      { new: true }
    );

    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// 🚀 start server
app.listen(5000, () => {
  console.log("✅ Server running on port 5000");
});