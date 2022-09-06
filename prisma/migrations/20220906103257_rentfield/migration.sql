/*
  Warnings:

  - Added the required column `rent` to the `RentCollected` table without a default value. This is not possible if the table is not empty.
  - Added the required column `rent` to the `RentDue` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_RentCollected" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "month" TEXT NOT NULL,
    "year" TEXT NOT NULL,
    "rent" INTEGER NOT NULL,
    "propertyId" TEXT NOT NULL,
    CONSTRAINT "RentCollected_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "Property" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_RentCollected" ("id", "month", "propertyId", "year") SELECT "id", "month", "propertyId", "year" FROM "RentCollected";
DROP TABLE "RentCollected";
ALTER TABLE "new_RentCollected" RENAME TO "RentCollected";
CREATE TABLE "new_RentDue" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "month" TEXT NOT NULL,
    "year" TEXT NOT NULL,
    "rent" INTEGER NOT NULL,
    "propertyId" TEXT NOT NULL,
    CONSTRAINT "RentDue_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "Property" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_RentDue" ("id", "month", "propertyId", "year") SELECT "id", "month", "propertyId", "year" FROM "RentDue";
DROP TABLE "RentDue";
ALTER TABLE "new_RentDue" RENAME TO "RentDue";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
