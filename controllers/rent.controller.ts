import {
  findPropertyById,
  updatePropertyDueDate,
} from "../datasource/property.datasource";
import { createRentCollected } from "../datasource/rent.datasource";
import { Request, Response } from "express";
import { generateNextDueDate, wrappedResponse } from "../utils/functions";

export const getRentDue = async (req: Request, res: Response) => {
  const property = await findPropertyById((req.query.id || "") as string);

  if (!property) {
    return wrappedResponse(res, "Property not found", 404, null);
  }

  if (!property.rentDueDate) {
    return wrappedResponse(res, "Due rent calculated successfully", 200, 0);
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
  let nextDate = generateNextDueDate();
  await updatePropertyDueDate(property.id, nextDate);
  return wrappedResponse(res, "Updated successfuly", 200, null);
};

export const payWithLANDC = async (req: Request, res: Response) => {
  const { amount, propertyId } = req.body;
  const property = await findPropertyById(propertyId);
  if (!property) {
    return wrappedResponse(res, "Property not found", 404, null);
  }
  let currentDate = new Date();
  let nextDate = generateNextDueDate();
  await createRentCollected(
    propertyId,
    amount,
    (currentDate.getUTCMonth() + 1).toString(),
    currentDate.getUTCFullYear().toString()
  );

  await updatePropertyDueDate(property.id, nextDate);
  return wrappedResponse(res, "rent collection success", 200, null);
};
