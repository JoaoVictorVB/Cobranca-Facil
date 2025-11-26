/*
  Warnings:

  - A unique constraint covering the columns `[invite_token]` on the table `business_relationships` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "business_relationships" ADD COLUMN     "invite_token" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "business_relationships_invite_token_key" ON "business_relationships"("invite_token");
