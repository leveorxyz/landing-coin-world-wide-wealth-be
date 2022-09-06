-- CreateTable
CREATE TABLE "TransactionInfo" (
    "transactionId" TEXT NOT NULL PRIMARY KEY,
    "publicAddress" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "pricePaid" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "type" TEXT NOT NULL
);
