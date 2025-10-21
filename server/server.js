import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";

dotenv.config();
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Basic test route
app.get("/", (req, res) => {
  res.send("🍰 Cake Bakery API is running...");
});

// Import routes (we’ll add later)
import cakeRoutes from "./routes/cakeRoutes.js";
import authRoutes from "./routes/authRoutes.js";
app.use("/api/cakes", cakeRoutes);
app.use("/api/auth", authRoutes);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
