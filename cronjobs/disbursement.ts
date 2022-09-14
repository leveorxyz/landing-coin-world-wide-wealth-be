import { CronJob } from "cron";

import { landKingTokenContract } from "../utils/web3.utils";

const fundDisburseCron = new CronJob("0 * * * * *", async () => {
  const currentDate = new Date();
  const timeStamp =
    new Date(
      currentDate.getUTCFullYear(),
      currentDate.getUTCMonth(),
      1,
      Math.round(-currentDate.getTimezoneOffset() / 60)
    ).getTime() / 1000;

  const landcUsdValue =
    (await landKingTokenContract.methods.getPrice().call()) / 1e18;
  console.log(landcUsdValue);
});

export default fundDisburseCron;
