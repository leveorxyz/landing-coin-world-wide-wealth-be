import { PrismaClient, User } from "@prisma/client";

const prisma = new PrismaClient();

export const findUserByEmail = async (email: string) => {
  await prisma.$connect();
  return prisma.user
    .findUnique({
      where: {
        email,
      },
    })
    .then(async (user: User | null) => {
      await prisma.$disconnect();
      return user;
    }).catch(async (e: Error) => {
      await prisma.$disconnect();
      throw e;
    });
};

export const createUser = async (
  name: string,
  email: string,
  password: string
) => {
  await prisma.$connect();
  return prisma.user
    .create({
      data: {
        name: name,
        email: email,
        password: password,
      },
    })
    .then(async (user: User | null) => {
      await prisma.$disconnect();
      return user;
    });
};

export const findUserById = async (id: string) => {
  await prisma.$connect();
  return prisma.user
    .findUnique({
      where: {
        id,
      },
    })
    .then(async (user: User | null) => {
      await prisma.$disconnect();
      return user;
    })
    .catch(async (e: Error) => {
      await prisma.$disconnect();
      throw e;
    });
};