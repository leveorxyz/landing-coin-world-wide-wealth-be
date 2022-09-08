import express from "express";

import {
  createPaymentIntent,
  createRentPaymentIntent,
} from "../controllers/payment.controller";
import { methodNotAllowed } from "../utils/functions";

const router = express.Router();

router.route("/intent").post(createPaymentIntent).all(methodNotAllowed);
router
  .route("/rent-intent")
  .post(createRentPaymentIntent)
  .all(methodNotAllowed);

export default router;
