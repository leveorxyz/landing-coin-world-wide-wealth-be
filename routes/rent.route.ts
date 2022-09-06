import express from "express";

import { getRentDue, payRentByAdmin } from "../controllers/rent.controller";
import { methodNotAllowed } from "../utils/functions";
import { authMiddleware } from "../utils/middlewares";

const router = express.Router();

router.route("/due").get(getRentDue).all(methodNotAllowed);
router.route("/admin-pay").post(payRentByAdmin).all(methodNotAllowed);

export default router;
