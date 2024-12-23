/*
  Warnings:

  - Added the required column `isApproved` to the `Contract` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Contract" ADD COLUMN     "approvedBy" INTEGER,
ADD COLUMN     "isApproved" BOOLEAN NOT NULL;
