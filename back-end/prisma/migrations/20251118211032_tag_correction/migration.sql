/*
  Warnings:

  - The `tags` column on the `Post` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Made the column `updateAt` on table `Post` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "public"."Post" ALTER COLUMN "updateAt" SET NOT NULL,
DROP COLUMN "tags",
ADD COLUMN     "tags" TEXT[];

-- DropEnum
DROP TYPE "public"."TagType";
