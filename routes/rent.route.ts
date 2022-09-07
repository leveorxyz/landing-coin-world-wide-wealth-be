import express from "express";

import {
  getRentDue,
  payRentByAdmin,
  payWithLANDC,
} from "../controllers/rent.controller";
import { methodNotAllowed } from "../utils/functions";
import { authMiddleware } from "../utils/middlewares";

const router = express.Router();

router.route("/due").get(getRentDue).all(methodNotAllowed);
router
  .route("/admin-pay")
  .post(authMiddleware, payRentByAdmin)
  .all(methodNotAllowed);
router.route("/landc-pay").post(payWithLANDC).all(methodNotAllowed);

export default router;
