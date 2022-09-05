import express from "express";
import { methodNotAllowed } from "../utils/functions";
import {
  createProperty,
  getAllProperties,
  getPropertyById,
  updateTenantStatus,
} from "../controllers/property.controller";

const router = express.Router();

router.route("/create").post(createProperty).all(methodNotAllowed);
router.route("/").get(getAllProperties).all(methodNotAllowed);
router
  .route("/:id")
  .get(getPropertyById)
  .patch(updateTenantStatus)
  .all(methodNotAllowed);

export default router;
