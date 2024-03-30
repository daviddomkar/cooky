/*
  Warnings:

  - You are about to drop the column `url` on the `files` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "files_url_key";

-- AlterTable
ALTER TABLE "files" DROP COLUMN "url";
