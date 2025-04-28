// src/index.ts
import cors from "cors";
import express from "express";
import gameRoutes from "./routes/gameRoutes";
import authRoutes from "./routes/authRoutes";
import adminRoutes from "./routes/adminRoutes";

const app = express();
const PORT = 3000;

app.use(express.json());

app.use(cors({
  origin: "http://localhost:5173", // or "*" in dev if needed
  credentials: true // just in case you handle cookies later
}));



app.use("/api", gameRoutes);

app.use('/api/auth', authRoutes);  // ✅ This is correct — authRoutes is a Router, not a function

app.use("/api/admin", adminRoutes);

app.get("/", (req, res) => {
  res.send("Welcome to Cluely! 🧠");
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
