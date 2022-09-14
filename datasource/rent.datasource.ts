import { PaymentType } from "@prisma/client";
import prisma from "../configs/prisma.config";

export const getAllRentByPropertyId = async (propertyId: string) => {
  return prisma.rentCollected.findMany({
    where: {
      propertyId: propertyId,
    },
  });
};

export const createRentCollected = async (
  id: string,
  amount: number,
  month: string,
  year: string,
  payementType: PaymentType
) => {
  return prisma.rentCollected.create({
    data: {
      propertyId: id,
      rent: amount,
      month: month,
      year: year,
      payementType: payementType,
    },
  });
};
