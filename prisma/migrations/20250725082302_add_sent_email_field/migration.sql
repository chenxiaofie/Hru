/*
  Warnings:

  - Added the required column `sentEmail` to the `MailLog` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "MailLog" ADD COLUMN     "sentEmail" TEXT NOT NULL;
