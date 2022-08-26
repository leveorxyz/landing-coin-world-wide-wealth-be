import { PrismaClient, User } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import _ from "lodash";
import dotenv from "dotenv";
import { Request, Response } from "express";

dotenv.config();
const prisma = new PrismaClient();

export const login = async (req: Request, res: Response) => {
  try {
    await prisma.$connect();
    const { email, password } = req.body as User;
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });
    if (!user) {
      return res.status(400).send({
        message: "Invalid email or password",
        statusCode: 400,
        result: null,
      });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).send({
        message: "Invalid email or password",
        statusCode: 400,
        result: null,
      });
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
    await prisma.$connect();
    const { name, email, password } = req.body as User;
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });
    if (user) {
      return res.status(400).send({
        message: "User already exists",
        statusCode: 400,
        result: null,
      });
    }
    const hash = await bcrypt.hash(password, 12);
    const newUser = await prisma.user.create({
      data: {
        name: name,
        email: email,
        password: hash,
      },
    });
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
