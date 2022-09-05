import express from "express";

import { postWebhook } from "../controllers/payment.controller";
import { methodNotAllowed } from "../utils/functions";

const router = express.Router();

router.route("/webhook").post(postWebhook).all(methodNotAllowed);
