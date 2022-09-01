import express from "express";
import dotenv from "dotenv";
import demoRoute from "./routes/demo";
import authRoute from "./routes/auth.route";
import propertyRoute from "./routes/property.route";

import { authMiddleware } from "./utils/middlewares";

dotenv.config();

const app = express();
const port: number = parseInt(process.env.PORT || "8000");
app.use(express.json());
app.use("/hello", authMiddleware, demoRoute);
app.use("/auth", authRoute);
app.use("/property", propertyRoute);
app.listen(port, () => {
  console.log(`⚡️[server]: Server is running on port ${port}`);
});
