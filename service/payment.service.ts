import stripe from "stripe";
import dotenv from "dotenv";

dotenv.config();

const stripeInstance = new stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2022-08-01",
});

export const disburseAmount = async (amount: number) => {
  const transferConfigs = [
    {
      amount: Math.round((3 * amount) / 100),
      destination: "acct_1Lew4jLGZ1kjen9H",
    },
    {
      amount: Math.round(amount / 100),
      destination: "acct_1Lew4jLGZ1kjen9H",
    },
  ];

  transferConfigs.map(async (transferConfig) => {
    try {
      await stripeInstance.transfers.create({
        ...transferConfig,
        currency: "usd",
      });
    } catch (e: any) {
      console.log(e);
    }
  });
};
