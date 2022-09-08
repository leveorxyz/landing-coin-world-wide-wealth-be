import dotenv from "dotenv";
import stripe from "stripe";
import { Request, Response } from "express";
import {
  generateNextDueDate,
  parseParam,
  wrappedResponse,
} from "../utils/functions";
import { disburseAmount } from "../service/payment.service";
import { oracleContract, web3 } from "../utils/web3.utils";
import {
  findPropertyById,
  updatePropertyDueDate,
} from "../datasource/property.datasource";
import { createTransaction } from "../datasource/transaction.datasource";
import { createRentCollected } from "../datasource/rent.datasource";
dotenv.config();

const stripeInstance = new stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2022-08-01",
});
const endpointSecret = process.env.ENDPOINT_SECRET!;

export const createPaymentIntent = async (req: Request, res: Response) => {
  const paymentIntent = await stripeInstance.paymentIntents.create({
    amount: req.body.amount,
    currency: "usd",
    payment_method_types: ["card"],
    description: req.body.description,
    metadata: {
      amount: req.body.amount,
      publicAddress: req.body.publicAddress,
    },
  });
  console.log(paymentIntent);
  return wrappedResponse(res, "Payment intent created", 200, paymentIntent);
};

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
    if (jsonBody.data.object.description === "Buy LANDC") {
      const metadata = jsonBody.data.object.metadata as TokenBuyPayload;

      console.log(jsonBody.data.object.metadata);

      await createTransaction(
        metadata.publicAddress,
        metadata.amount,
        jsonBody.data.object.amount,
        "Buy"
      );
      oracleContract.methods
        .addBuyTx(
          jsonBody.data.object.balance_transaction,
          jsonBody.data.object.amount
        )
        .send({
          gas: 2600000,
          gasPrice: 4000000000,
          from: web3.eth.defaultAccount,
        });
    }
    disburseAmount(jsonBody.data.object.amount);
    return wrappedResponse(res, "payment success", 200, null);
  }
  return res.status(200).send({});
};

export const rentCollectionWebhook = async (req: Request, res: Response) => {
  const stripeRentInstance = new stripe(process.env.RENT_STRIPE_SECRET_KEY!, {
    apiVersion: "2022-08-01",
  });
  const rentEndpointSecret = process.env.RENT_ENDPOINT_SECRET!;
  const stripeSignature = req.headers["stripe-signature"];
  let event;

  try {
    event = stripeRentInstance.webhooks.constructEvent(
      req.body,
      stripeSignature!,
      rentEndpointSecret
    );
  } catch (err: any) {
    console.log(err.message);
    return wrappedResponse(res, `Webhook error ${err.message}`, 400, null);
  }

  // Handle the event
  if (event.type === "charge.succeeded") {
    const jsonBody = JSON.parse(req.body.toString());
    if (jsonBody.data.object.description) {
      const propertyId = jsonBody.data.object.description;
      const property = await findPropertyById(propertyId);
      if (!property) {
        return wrappedResponse(res, "Property not found", 404, null);
      }
      let currentDate = new Date();
      let nextDate = generateNextDueDate();
      let amount = jsonBody.data.object.amount as number;
      await createRentCollected(
        propertyId,
        amount,
        (currentDate.getUTCMonth() + 1).toString(),
        currentDate.getUTCFullYear().toString()
      );

      await updatePropertyDueDate(property.id, nextDate);
      return wrappedResponse(res, "rent collection success", 200, null);
    }
  }
  return res.status(200).send({});
};
