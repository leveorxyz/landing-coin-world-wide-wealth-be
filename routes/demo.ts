import express from "express";
import { methodNotAllowed } from "../utils/functions";
import { sendHello } from "../controllers/demo";

const router = express.Router();

router.route("/").get(sendHello).all(methodNotAllowed);

export default router;
