import { PaymentType } from "@prisma/client";
import { CronJob } from "cron";
import { paymentSumByGroup } from "../datasource/rent.datasource";
import { eToNumber } from "../utils/functions";

import {
  landingTokenContract,
  oracleContract,
  protocolContract,
  web3,
} from "../utils/web3.utils";

const fundDisburseCron = new CronJob("0 0 0 * * *", async () => {
  const currentDate = new Date();
  const timeStamp =
    new Date(
      currentDate.getUTCFullYear(),
      currentDate.getUTCMonth(),
      1,
      Math.round(-currentDate.getTimezoneOffset() / 60)
    ).getTime() / 1000;
  let maintenanceAmount = 0;

  // Geting LANDC current value
  const landcUsdValue =
    (await landingTokenContract.methods.getPrice().call()) / 1e18;

  console.log({ timeStamp, landcUsdValue });

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

  console.log("Initial rent:", rents);

  // If Landc payment is less than 60% of total payment we convert
  if (Math.round(rents.TOTAL * 0.6) > rents.LANDC) {
    const convertAmount = Math.round(rents.TOTAL * 0.6 - rents.LANDC);
    const txn_id = (Math.random() + 1).toString(36).substring(7);

    // Dump the tx amount to oracle
    // await oracleContract.methods
    //   .addRentTx(`txn_${txn_id}`, convertAmount)
    //   .send({
    //     gas: 2600000,
    //     gasPrice: 6000000000,
    //     from: web3.eth.defaultAccount,
    //   });

    console.log("rent tx dump");

    // Converting usd amount
    // await landingTokenContract.methods
    //   .convertUSDRentToLandc(convertAmount, `txn_${txn_id}`)
    //   .send({
    //     gas: 2600000,
    //     gasPrice: 6000000000,
    //     from: web3.eth.defaultAccount,
    //   });

    console.log("convert call");

    rents.LANDC += convertAmount;
    rents.USD -= convertAmount;

    console.log("rent after conversion:", rents);
  }

  // Calculate maintenance amount
  if (Math.round(rents.TOTAL * 0.6) < rents.LANDC) {
    maintenanceAmount = Math.round(rents.LANDC - rents.TOTAL * 0.6);
  }

  // Disburse amount
  let disbursementAmount = eToNumber(
    Math.round(((rents.TOTAL * 0.6) / landcUsdValue) * 1e18)
  );
  let maintenanceValue = eToNumber(
    Math.round((maintenanceAmount / landcUsdValue) * 1e18)
  );
  console.log("disbursement amount:", { disbursementAmount, maintenanceValue });
  // await protocolContract.methods
  //   .distributePayment(disbursementAmount, maintenanceValue, timeStamp)
  //   .send({
  //     gas: 2600000,
  //     gasPrice: 6000000000,
  //     from: web3.eth.defaultAccount,
  //   });
  console.log("disburse");
});

export default fundDisburseCron;
