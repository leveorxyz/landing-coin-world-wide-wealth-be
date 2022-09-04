import { PrismaClient, Property } from "@prisma/client";

const prisma = new PrismaClient();

export const createNewProperty = async (
  name: string,
  boughtFrom: string,
  price: number,
  location: string,
  image: string,
  legalDoc: string,
  tenantStatus: boolean,
  rentDueDate: string
) => {
  await prisma.$connect();
  return prisma.property
    .create({
      data: {
        name: name,
        boughtFrom: boughtFrom,
        price: price,
        location: location,
        image: image,
        legalDoc: legalDoc,
        tenantStatus: tenantStatus,
        rentDueDate: rentDueDate,
      },
    })
    .then(async (property: Property | null) => {
      await prisma.$disconnect();
      return property;
    });
};

export const findPropertyById = async (id: string) => {
  await prisma.$connect();
  return prisma.property
    .findUnique({
      where: {
        id,
      },
    })
    .then(async (property: Property | null) => {
      await prisma.$disconnect();
      return property;
    })
    .catch(async (e: Error) => {
      await prisma.$disconnect();
      throw e;
    });
};

export const findAllProperties = async () => {
  await prisma.$connect();
  return prisma.property
    .findMany()
    .then(async (properties: Property[] | null) => {
      await prisma.$disconnect();
      return properties;
    })
    .catch(async (e: Error) => {
      await prisma.$disconnect();
      throw e;
    });
};
