// src/index.ts

import express from "express";
import gameRoutes from "./routes/gameRoutes";
import authRoutes from "./routes/authRoutes";

const app = express();
const PORT = 3000;

app.use(express.json());

app.use('/api/auth', authRoutes); // ✅ This is correct — authRoutes is a Router, not a function

// ✅ This is correct — gameRoutes is a Router, not a function
app.use("/api", gameRoutes);

app.get("/", (req, res) => {
  res.send("Welcome to Cluely! 🧠");
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
