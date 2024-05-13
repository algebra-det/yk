/*
  Warnings:

  - You are about to drop the column `autorised_capital` on the `users` table. All the data in the column will be lost.
  - Added the required column `authorised_capital` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `users` DROP COLUMN `autorised_capital`,
    ADD COLUMN `authorised_capital` INTEGER NOT NULL;
