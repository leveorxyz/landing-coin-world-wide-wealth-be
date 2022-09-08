import prisma from "../configs/prisma.config";

export const findUserByEmail = async (email: string) => {
  return prisma.user.findUnique({
    where: {
      email,
    },
  });
};

export const createUser = async (
  name: string,
  email: string,
  password: string,
  publicAddress: string,
  location: string
) => {
  return prisma.user.create({
    data: {
      name: name,
      email: email,
      password: password,
      publicAddress: publicAddress,
      location: location,
    },
  });
};

export const findUserById = async (id: string) => {
  return prisma.user.findUnique({
    where: {
      id,
    },
  });
};
