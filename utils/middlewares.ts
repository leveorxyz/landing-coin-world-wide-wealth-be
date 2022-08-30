import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

import { responseWrapper } from "./functions";

dotenv.config();

export const authMiddleware = (
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
    let jwtPayload = jwt.verify(req.headers.authorization, process.env.SECRET!);
    console.log(jwtPayload);
    next();
  } catch (e: any) {
    if (e instanceof jwt.JsonWebTokenError) {
      return res.status(400).json(responseWrapper("Invalid token", 400, null));
    }
    return res.status(400).json(responseWrapper(e.message, 400, null));
  }
};
