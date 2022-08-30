import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import dotenv from "dotenv";

import { responseWrapper } from "./functions";
import { findUserById } from "../datasource/auth.datasource";

dotenv.config();

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.headers.authorization) {
    return res
      .status(401)
      .json(responseWrapper("No Autorization token present", 400, null));
  }

  try {
    let jwtPayload = jwt.verify(
      req.headers.authorization,
      process.env.SECRET!
    ) as JWTPayload;

    const user = await findUserById(jwtPayload.id);
    if (!user) {
      return res.status(401).send(responseWrapper("Invalid token", 400, null));
    }
    next();
  } catch (e: any) {
    if (e instanceof jwt.JsonWebTokenError && e.message != "jwt expired") {
      return res.status(400).json(responseWrapper("Invalid token", 400, null));
    }
    return res.status(400).json(responseWrapper(e.message, 400, null));
  }
};
