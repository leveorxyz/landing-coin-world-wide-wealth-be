import express, { NextFunction, Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import swaggerUI from "swagger-ui-express";

import demoRoute from "./routes/demo";
import authRoute from "./routes/auth.route";
import propertyRoute from "./routes/property.route";
import paymentRoute from "./routes/payment.route";
import rentRoute from "./routes/rent.route";

import { authMiddleware } from "./utils/middlewares";
import fundDisburseCron from "./cronjobs/disbursement";
import swaggerFile from "./swagger/swagger.json";
import { wrappedResponse } from "./utils/functions";
import prisma from "./configs/prisma.config";

dotenv.config();

const app = express();
const port: number = parseInt(process.env.PORT || "8000");

app.use("/payment", express.raw({ type: "application/json" }), paymentRoute);
app.use(express.json());
app.use(
  cors({
    origin: "*",
  })
);

app.use("/doc", swaggerUI.serve, swaggerUI.setup(swaggerFile));

app.use("/hello", authMiddleware, demoRoute);
app.use("/auth", authRoute);
app.use("/property", propertyRoute);
app.use("/rent", rentRoute);

app.use("*", (_: Request, res: Response) => {
  return wrappedResponse(res, "Not Found", 404, null);
});

app.use(function onError(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  return wrappedResponse(res, err.message, 500, null);
});

const server = app.listen(port, async () => {
  fundDisburseCron.start();
  await prisma.$connect();
  console.log(`⚡️[server]: Server is running on port ${port}`);
});

process.on("SIGINT", async () => {
  await prisma.$disconnect();
  server.close();
  console.log("[server]: Server closed on SIGINT");
});