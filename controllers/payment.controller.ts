import dotenv from "dotenv";
import stripe from "stripe";
import { Request, Response } from "express";
import { wrappedResponse } from "../utils/functions";

dotenv.config();

const stripeInstance = new stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2022-08-01",
});
const endpointSecret = process.env.ENDPOINT_SECRET!;

export const postWebhook = (req: Request, res: Response) => {
  const stripeSignature = req.headers["stripe-signature"];
  let event;

  try {
    event = stripeInstance.webhooks.constructEvent(
      req.body,
      stripeSignature!,
      endpointSecret
    );
  } catch (err: any) {
    console.log(err.message);
    return wrappedResponse(res, `Webhook error ${err.message}`, 400, null);
  }

  // Handle the event
  if (event.type === "charge.succeeded") {
    console.log("sucesssss");
    return wrappedResponse(res, "payment success", 200, null);
  }
  console.log(event.type);
  return res.status(200).send({});
};
