import express from "express";

import {
  postWebhook,
  rentCollectionWebhook,
} from "../controllers/payment.controller";
import { methodNotAllowed } from "../utils/functions";

const router = express.Router();

router.route("/webhook").post(postWebhook).all(methodNotAllowed);
router
  .route("/rent-collection")
  .post(rentCollectionWebhook)
  .all(methodNotAllowed);

export default router;
