import "dotenv/config";
import express from "express";
import cors from "cors";
import pool from "./database/Connection";
import UserRoute from "./routes/UserRoute"
import googleAuthRoutes from "./routes/GoogleAuth"

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use("/auth", googleAuthRoutes);
app.use("/user", UserRoute)

pool.query("SELECT NOW()", (err) => {
  if (!err) {
    console.log("DB Connected to InterviewSpark!");
  }
});

app.get("/api/health", (req, res) => {
  res.json({ message: "Server is running" });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});