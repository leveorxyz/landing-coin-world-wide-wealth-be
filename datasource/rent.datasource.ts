import prisma from "../configs/prisma.config";

export const createRent = async (
  rent: number,
  year: string,
  month: string,
  propertyId: string
) => {
  return prisma.rentCollected.create({
    data: {
      rent: rent,
      year: year,
      month: month,
      propertyId: propertyId,
    },
  });
};

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
  year: string
) => {
  return prisma.rentCollected.create({
    data: {
      propertyId: id,
      rent: amount,
      month: month,
      year: year,
    },
  });
};
