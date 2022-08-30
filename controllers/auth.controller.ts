import { User } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { Request, Response } from "express";

import { findUserByEmail, createUser } from "../datasource/auth.datasource";
import { wrappedResponse } from "../utils/functions";

dotenv.config();

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body as User;
    const user = await findUserByEmail(email);
    if (!user) {
      return wrappedResponse(res, "Invalid Username or password", 400, null);
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return wrappedResponse(res, "Invalid Username or password", 400, null);
    }
    const token = jwt.sign(
      {
        id: user.id,
      },
      process.env.SECRET as string,
      {
        expiresIn: "30d",
      }
    );
    return wrappedResponse(res, "Login Successful", 200, { token });
  } catch (e: any) {
    return wrappedResponse(res, e.message, 500, null);
  }
};

export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body as User;
    const user = await findUserByEmail(email);
    if (user) {
      return wrappedResponse(res, "User already exists", 400, null);
    }
    const hash = await bcrypt.hash(password, 12);
    await createUser(name, email, hash);
    return wrappedResponse(res, "User created successfully", 201, null);
  } catch (e: any) {
    return wrappedResponse(res, e.message, 500, null);
  }
};
