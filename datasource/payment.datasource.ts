import { PrismaClient, TransactionInfo } from "@prisma/client";

const prisma = new PrismaClient();

export const createTransaction = async (
  publicAddress: string,
  amount: number,
  pricePaid: number,
  type: string
) => {
  await prisma.$connect();

  return prisma.transactionInfo
    .create({
      data: {
        publicAddress: publicAddress,
        amount: amount,
        pricePaid: pricePaid,
        type: type,
      },
    })
    .then(async (transaction: TransactionInfo | null) => {
      await prisma.$disconnect();
      return transaction;
    });
};

export const findTransactionById = async (id: string) => {
  await prisma.$connect();
  return prisma.transactionInfo
    .findUnique({
      where: {
        transactionId: id,
      },
    })
    .then(async (transaction: TransactionInfo | null) => {
      await prisma.$disconnect();
      return transaction;
    })
    .catch(async (e: Error) => {
      await prisma.$disconnect();
      throw e;
    });
};

export const findbyWalletAddress = async (
  publicAddress: string,
  queryCondition: Object = {}
) => {
  await prisma.$connect();
  return prisma.transactionInfo
    .findMany({
      where: {
        publicAddress: publicAddress,
        ...queryCondition,
      },
    })
    .then(async (transaction: TransactionInfo[] | null) => {
      await prisma.$disconnect();
      return transaction;
    })
    .catch(async (e: Error) => {
      await prisma.$disconnect();
      throw e;
    });
};
