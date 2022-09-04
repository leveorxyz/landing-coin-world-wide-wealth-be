-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Property" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "boughtFrom" TEXT NOT NULL,
    "price" INTEGER NOT NULL,
    "location" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "legalDoc" TEXT NOT NULL,
    "tenantStatus" BOOLEAN NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "rentDueDate" TEXT NOT NULL
);
INSERT INTO "new_Property" ("boughtFrom", "createdAt", "id", "image", "legalDoc", "location", "name", "price", "rentDueDate", "tenantStatus") SELECT "boughtFrom", "createdAt", "id", "image", "legalDoc", "location", "name", "price", "rentDueDate", "tenantStatus" FROM "Property";
DROP TABLE "Property";
ALTER TABLE "new_Property" RENAME TO "Property";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
