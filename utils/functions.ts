import { Request, Response, NextFunction } from "express";

export const methodNotAllowed = (
  req: Request,
  res: Response,
  next: NextFunction
) => res.status(405).send({ error: "Method not allowed" });

export const wrappedResponse = (
  res: Response,
  message: string,
  statusCode: number,
  result: Object | null | string
): Response<GlobalResponse> => {
  return res.status(statusCode).json({
    message,
    statusCode,
    result,
  });
};

export const parseParam = (paramString: string) => {
  const params = paramString.split("&");
  const result = {};
  params.forEach((paramCouple: string) => {
    const [key, value] = paramCouple.split("=");
    (result as any)[key] = value;
  });
  return result;
};

export const generateNextDueDate = () => {
  let currentDate = new Date();
  let nextDate =
    currentDate.getUTCMonth() === 11
      ? new Date(
          currentDate.getUTCFullYear(),
          0,
          1,
          Math.round(-currentDate.getTimezoneOffset() / 60)
        )
      : new Date(
          currentDate.getUTCFullYear(),
          currentDate.getUTCMonth() + 1,
          1,
          Math.round(-currentDate.getTimezoneOffset() / 60)
        );
  return nextDate.toISOString();
};