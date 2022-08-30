import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import dotenv from "dotenv";

import { wrappedResponse } from "./functions";
import { findUserById } from "../datasource/auth.datasource";

dotenv.config();

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.headers.authorization) {
    return wrappedResponse(res, "No Autorization token present", 400, null);
  }

  try {
    let jwtPayload = jwt.verify(
      req.headers.authorization,
      process.env.SECRET!
    ) as JWTPayload;

    const user = await findUserById(jwtPayload.id);
    if (!user) {
      return wrappedResponse(res, "Invalid token", 400, null);
    }

    res.locals.user = user;
    next();
  } catch (e: any) {
    if (e instanceof jwt.JsonWebTokenError && e.message != "jwt expired") {
      return wrappedResponse(res, "Invalid token", 400, null);
    }
    return wrappedResponse(res, e.message, 400, null);
  }
};
