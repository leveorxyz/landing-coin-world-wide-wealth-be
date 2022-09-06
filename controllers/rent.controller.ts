import {
  findPropertyById,
  updatePropertyDueDate,
} from "../datasource/property.datasource";
import { Request, Response } from "express";
import { wrappedResponse } from "../utils/functions";

export const getRentDue = async (req: Request, res: Response) => {
  const property = await findPropertyById((req.query.id || "") as string);

  if (!property) {
    return wrappedResponse(res, "Property not found", 404, null);
  }

  const currentDate = new Date();
  const lastPaymentDate = new Date(property.rentDueDate as string);
  let months =
    (currentDate.getUTCFullYear() - lastPaymentDate.getUTCFullYear()) * 12 + 1;
  months += currentDate.getUTCMonth();
  months -= lastPaymentDate.getUTCMonth();
  months = months < 0 ? 0 : months;
  const result = months * property.price;
  return wrappedResponse(res, "Due rent calculated successfully", 200, result);
};

export const payRentByAdmin = async (req: Request, res: Response) => {
  const property = await findPropertyById(req.body.id || "");
  if (!property) {
    return wrappedResponse(res, "Property not found", 404, null);
  }

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
  await updatePropertyDueDate(property.id, nextDate.toISOString());
  return wrappedResponse(res, "Updated successfuly", 200, null);
};
