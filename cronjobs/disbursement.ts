import { CronJob } from "cron";

const fundDisburseCron = new CronJob("0 0 0 7 * *", () => {
  const currentDate = new Date();
  const timeStamp =
    new Date(
      currentDate.getUTCFullYear(),
      currentDate.getUTCMonth(),
      1,
      Math.round(-currentDate.getTimezoneOffset() / 60)
    ).getTime() / 1000;
  console.log("disbursement done");
});

export default fundDisburseCron;
