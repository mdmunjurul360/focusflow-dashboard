import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

const app = express();

// ✅ middleware
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI?.trim();

// ✅ DB connect
const connectDB = async () => {
  if (!MONGODB_URI) {
    console.log("⚠️ MONGODB_URI is not set. Skipping database connection.");
    return;
  }

  try {
    await mongoose.connect(MONGODB_URI);
    console.log("✅ MongoDB Connected");
  } catch (err) {
    console.error("❌ DB Error:", err instanceof Error ? err.message : err);
  }
};

connectDB();

// ✅ Feedback Schema
const feedbackSchema = new mongoose.Schema({
  message: String,
  image: String,
});

const Feedback = mongoose.model("Feedback", feedbackSchema);

// ✅ Routes
app.get("/", (req, res) => {
  res.send("API running...");
});

// 🔥 NEW: feedback route
app.post("/feedback", async (req, res) => {
  try {
    console.log("Incoming:", req.body);

    const { message, image } = req.body;

    const newFeedback = new Feedback({ message, image });
    await newFeedback.save();

    res.send("Saved ✅");
  } catch (err) {
    console.log(err);
    res.status(500).send("Error ❌");
  }
});

// ✅ server run
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});