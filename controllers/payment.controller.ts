import dotenv from "dotenv";
import stripe from "stripe";
import { Request, Response } from "express";
import { wrappedResponse } from "../utils/functions";
import { disburseAmount } from "../service/payment.service";
import { oracleContract, web3 } from "../utils/web3.utils";

dotenv.config();

const stripeInstance = new stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2022-08-01",
});
const endpointSecret = process.env.ENDPOINT_SECRET!;

export const postWebhook = async (req: Request, res: Response) => {
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
    const jsonBody = JSON.parse(req.body.toString());
    if (jsonBody.data.object.description === "Buy Token") {
      oracleContract.methods
        .addBuyTx(
          jsonBody.data.object.balance_transaction,
          jsonBody.data.object.amount
        )
        .send({
          gas: 2600000,
          gasPrice: 3650000000,
          from: web3.eth.defaultAccount,
        });
    }
    disburseAmount(jsonBody.data.object.amount);
    return wrappedResponse(res, "payment success", 200, null);
  }
  return res.status(200).send({});
};
