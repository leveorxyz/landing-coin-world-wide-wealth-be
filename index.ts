import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import swaggerUI from "swagger-ui-express";

import demoRoute from "./routes/demo";
import authRoute from "./routes/auth.route";
import propertyRoute from "./routes/property.route";
import { authMiddleware } from "./utils/middlewares";
import fundDisburseCron from "./cronjobs/disbursement";
import swaggerFile from "./swagger/swagger.json";

dotenv.config();

const app = express();
const port: number = parseInt(process.env.PORT || "8000");

app.use(express.json());
app.use(cors());

app.use("/doc", swaggerUI.serve, swaggerUI.setup(swaggerFile));

app.use("/hello", authMiddleware, demoRoute);
app.use("/auth", authRoute);
app.use("/property", propertyRoute);

app.listen(port, () => {
  fundDisburseCron.start();
  console.log(`⚡️[server]: Server is running on port ${port}`);
});
