import prisma from "../configs/prisma.config";

export const createNewProperty = async (
  name: string,
  boughtFrom: string,
  price: number,
  location: string,
  image: string,
  legalDoc: string,
  tenantStatus: boolean
) => {
  return prisma.property.create({
    data: {
      name: name,
      boughtFrom: boughtFrom,
      price: price,
      location: location,
      image: image,
      legalDoc: legalDoc,
      tenantStatus: tenantStatus,
    },
  });
};

export const findPropertyById = async (id: string) => {
  return prisma.property.findUnique({
    where: {
      id,
    },
  });
};

export const findAllProperties = async () => {
  return prisma.property.findMany();
};

export const updateProperty = async (id: string, status: boolean) => {
  return prisma.property.update({
    where: {
      id,
    },
    data: {
      tenantStatus: status,
    },
  });
};

export const updatePropertyDueDate = async (id: string, newDueDate: string) => {
  return prisma.property.update({
    where: {
      id,
    },
    data: {
      rentDueDate: newDueDate,
    },
  });
};
