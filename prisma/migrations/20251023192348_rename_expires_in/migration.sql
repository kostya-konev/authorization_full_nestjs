/*
  Warnings:

  - You are about to drop the column `expires_in` on the `accounts` table. All the data in the column will be lost.
  - Added the required column `expires_at` to the `accounts` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "accounts" DROP COLUMN "expires_in",
ADD COLUMN     "expires_at" INTEGER NOT NULL;
