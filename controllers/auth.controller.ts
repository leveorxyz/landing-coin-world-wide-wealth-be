import { User } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import _ from "lodash";
import dotenv from "dotenv";
import { Request, Response } from "express";

import { findUserByEmail, createUser } from "../datasource/auth.datasource";
import { responseWrapper } from "../utils/functions";

dotenv.config();

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body as User;
    const user = await findUserByEmail(email);
    if (!user) {
      return res
        .status(400)
        .send(responseWrapper("Invalid Username or password", 400, null));
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(400)
        .send(responseWrapper("Invalid Username or password", 400, null));
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
    return res.status(200).send({
      message: "Login Successful",
      statusCode: 200,
      result: {
        token,
      },
    });
  } catch (e) {
    console.log(e);
    res.status(500).send(e);
  }
};

export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body as User;
    const user = await findUserByEmail(email);
    if (user) {
      return res.status(400).send({
        message: "User already exists",
        statusCode: 400,
        result: null,
      });
    }
    const hash = await bcrypt.hash(password, 12);
    await createUser(name, email, hash);
    return res.status(201).send({
      message: "User created successfully",
      statusCode: 201,
      result: null,
    });
  } catch (e) {
    console.log(e);
    res.status(500).send(e);
  }
};
