import { CronJob } from "cron";

const fundDisburseCron = new CronJob("0 0 0 * * *", () => {
  console.log("disbursement done");
});

export default fundDisburseCron;
