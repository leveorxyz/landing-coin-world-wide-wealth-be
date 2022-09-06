import express from "express";

import { getRentDue } from "../controllers/rent.controller";
import { methodNotAllowed } from "../utils/functions";

const router = express.Router();

router.route("/due").get(getRentDue).all(methodNotAllowed);

export default router;
