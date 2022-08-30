import express from "express";
import { methodNotAllowed } from "../utils/functions";
import { login, register } from "../controllers/auth.controller";

const router = express.Router();

router.route("/login").post(login).all(methodNotAllowed);
router.route("/register").post(register).all(methodNotAllowed);

export default router;
