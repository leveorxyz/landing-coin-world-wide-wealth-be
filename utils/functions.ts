import { Request, Response, NextFunction } from "express";

export const methodNotAllowed = (
  req: Request,
  res: Response,
  next: NextFunction
) => res.status(405).send({ error: "Method not allowed" });

export const responseWrapper = (
  message: string,
  statusCode: Number,
  result: Object | null | string
): GlobalResponse => {
  return {
    message,
    statusCode,
    result,
  };
};
