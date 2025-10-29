import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";

import connectDB from "./config/nationalIDdb.js";
import nationalIDRouter from "./routes/nationalIDRoutes.js";
import Counter from "./models/Counter.js";
dotenv.config();
console.log("CLIENT_URL from .env:", process.env.CLIENT_URL);

const PORT = process.env.PORT || 7001;
const app = express();

app.use(
  cors({
    origin: [
      process.env.CLIENT_URL || "http://localhost:5173",
      "http://localhost:5173", // Explicitly add frontend URL
      "https://GLA-university-graduate-document.onrender.com",
    ],
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.json());

// Debug middleware to log response headers
app.use((req, res, next) => {
  const originalEnd = res.end;
  res.end = function (...args) {
    console.log("--- National ID API Response Headers ---");
    console.log(res.getHeaders());
    console.log("----------------------------------------");
    originalEnd.apply(this, args);
  };
  next();
});

app.use("/api/national-ids", nationalIDRouter);

app.get("/", (req, res) => {
  res.send("National id api running...");
});

// Initialize Counter
const initializeCounter = async () => {
  const existingCounter = await Counter.findOne({ id: "nationalId" });
  if (!existingCounter) {
    await Counter.create({ id: "nationalId", seq: 0 });
    console.log("Counter initialized for nationalId");
  }
};

app.listen(PORT, () => {
  connectDB();
  initializeCounter(); // Initialize the counter when the server starts
  console.log(`Server running on port http://localhost:${PORT}`);
});
