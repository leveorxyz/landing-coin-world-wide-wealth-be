import { PaymentType } from "@prisma/client";
import { CronJob } from "cron";
import { paymentSumByGroup } from "../datasource/rent.datasource";

import {
  landKingTokenContract,
  oracleContract,
  web3,
} from "../utils/web3.utils";

const fundDisburseCron = new CronJob("*/20 * * * * *", async () => {
  const currentDate = new Date();
  const timeStamp =
    new Date(
      currentDate.getUTCFullYear(),
      currentDate.getUTCMonth(),
      1,
      Math.round(-currentDate.getTimezoneOffset() / 60)
    ).getTime() / 1000;

  // Geting LANDC current value
  const landcUsdValue =
    (await landKingTokenContract.methods.getPrice().call()) / 1e18;

  // Querying total payments
  const payments = await paymentSumByGroup();
  const rents = { TOTAL: 0, LANDC: 0, USD: 0 };
  payments.map((payment) =>
    payment.paymentType
      ? (rents[payment.paymentType] = payment._sum.rent || 0)
      : null
  );
  rents.TOTAL = Object.keys(PaymentType).reduce(
    (a: number, b: string) => a + rents[b as PaymentType],
    0
  );

  rents.LANDC = Math.round(rents.LANDC * landcUsdValue);

  // If Landc payment is less than 60% of total payment we convert
  if (Math.round(rents.TOTAL * 0.6) < rents.LANDC) {
    const convertAmount = Math.round(rents.TOTAL * 0.6 - rents.LANDC);
    const txn_id = (Math.random() + 1).toString(36).substring(7);

    // Dump the tx amount to oracle
    await oracleContract.methods
      .addRentTx(`txn_${txn_id}`, convertAmount)
      .send({
        gas: 2600000,
        gasPrice: 4000000000,
        from: web3.eth.defaultAccount,
      });

    // Converting usd amount
    await landKingTokenContract.methods
      .convertUSDRentToLandc(convertAmount, `txn_${txn_id}`)
      .send({
        gas: 2600000,
        gasPrice: 4000000000,
        from: web3.eth.defaultAccount,
      });

    rents.TOTAL -= convertAmount;
    rents.LANDC += convertAmount;
  }
});

export default fundDisburseCron;
