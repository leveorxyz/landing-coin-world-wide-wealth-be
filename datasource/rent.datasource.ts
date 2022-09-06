import { PrismaClient, RentCollected } from "@prisma/client";

const prisma = new PrismaClient();

export const createRent = async (
  rent: number,
  year: string,
  month: string,
  propertyId: string
) => {
  await prisma.$connect();
  return prisma.rentCollected
    .create({
      data: {
        rent: rent,
        year: year,
        month: month,
        propertyId: propertyId,
      },
    })
    .then(async (rent: RentCollected | null) => {
      await prisma.$disconnect();
      return rent;
    });
};

export const getAllRentCollectedbyPropertyId = async (propertyId: string) => {
  await prisma.$connect();
  return prisma.rentCollected
    .findMany({
      where: {
        propertyId: propertyId,
      },
    })
    .then(async (rent: RentCollected[] | null) => {
      await prisma.$disconnect();
      return rent;
    })
    .catch(async (e: Error) => {
      await prisma.$disconnect();
      throw e;
    });
};
