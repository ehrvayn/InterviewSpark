import "dotenv/config";
import express from "express";
import cors from "cors";
import pool from "./database/Connection";
import UserRoute from "./routes/UserRoute";
import googleAuthRoutes from "./routes/OAuthRoute";
import InterviewRoute from "./routes/InterviewRoute";
import PaymentRoute from "./routes/PaymentRoute";

const app = express();
const PORT = process.env.PORT || 5000;

if (!process.env.JWT_SECRET) {
  throw new Error("JWT_SECRET is not set!");
}
if (!process.env.PAYMONGO_SECRET_KEY) {
  throw new Error("PAYMONGO_SECRET_KEY is not set!");
}

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  }),
);
app.use(express.json());
app.set('trust proxy', 1);
app.use("/auth", googleAuthRoutes);
app.use("/user", UserRoute);
app.use("/interview", InterviewRoute);
app.use("/payment", PaymentRoute);

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
