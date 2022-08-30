import express from "express";
import dotenv from "dotenv";

import demoRoute from "./routes/demo";
import authRoute from "./routes/auth.route";
import { authMiddleware } from "./utils/middlewares";
import fundDisburseCron from "./cronjobs/disbursement";

dotenv.config();

const app = express();
const port: number = parseInt(process.env.PORT || "8000");

app.use(express.json());

app.use("/hello", authMiddleware, demoRoute);
app.use("/auth", authRoute);

app.listen(port, () => {
  fundDisburseCron.start();
  console.log(`⚡️[server]: Server is running on port ${port}`);
});
