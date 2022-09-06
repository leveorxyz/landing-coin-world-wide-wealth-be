-- CreateTable
CREATE TABLE "RentDue" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "month" TEXT NOT NULL,
    "year" TEXT NOT NULL,
    "propertyId" TEXT NOT NULL,
    CONSTRAINT "RentDue_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "Property" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "RentCollected" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "month" TEXT NOT NULL,
    "year" TEXT NOT NULL,
    "propertyId" TEXT NOT NULL,
    CONSTRAINT "RentCollected_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "Property" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
