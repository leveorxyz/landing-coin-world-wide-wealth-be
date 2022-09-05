import dotenv from "dotenv";
import stripe from "stripe";
import { Request, Response } from "express";

dotenv.config();

const stripeInstance = new stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2022-08-01",
});
const endpointSecret = "somekey";

export const postWebhook = (req: Request, res: Response) => {
  console.log(req.body);
  res.send("ok");
};
