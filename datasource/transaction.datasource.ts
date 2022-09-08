import prisma from "../configs/prisma.config";

export const createTransaction = async (
  publicAddress: string,
  amount: string,
  pricePaid: number,
  type: string
) => {
  return prisma.transactionInfo.create({
    data: {
      publicAddress: publicAddress,
      amount: amount,
      pricePaid: pricePaid,
      type: type,
    },
  });
};

export const findTransactionById = async (id: string) => {
  return prisma.transactionInfo.findUnique({
    where: {
      transactionId: id,
    },
  });
};

export const findbyWalletAddress = async (
  publicAddress: string,
  queryCondition: Object = {}
) => {
  return prisma.transactionInfo.findMany({
    where: {
      publicAddress: publicAddress,
      ...queryCondition,
    },
  });
};
