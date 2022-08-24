import express from "express";
import dotenv from "dotenv";
import demoRoute from "./routes/demo";

dotenv.config();

const app = express();
const port: number = parseInt(process.env.PORT || "8000");

app.use("/", demoRoute);

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running on port ${port}`);
});
