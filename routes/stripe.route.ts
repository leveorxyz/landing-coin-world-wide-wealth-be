import express from "express";

import { createPaymentIntent } from "../controllers/payment.controller";
import { methodNotAllowed } from "../utils/functions";

const router = express.Router();

router.route("/intent").post(createPaymentIntent).all(methodNotAllowed);

export default router;
