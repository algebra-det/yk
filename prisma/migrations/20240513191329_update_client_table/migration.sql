/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `users` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[cin]` on the table `users` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[link]` on the table `users` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[pin_code]` on the table `users` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `link` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `users` ADD COLUMN `link` VARCHAR(191) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `users_name_key` ON `users`(`name`);

-- CreateIndex
CREATE UNIQUE INDEX `users_cin_key` ON `users`(`cin`);

-- CreateIndex
CREATE UNIQUE INDEX `users_link_key` ON `users`(`link`);

-- CreateIndex
CREATE UNIQUE INDEX `users_pin_code_key` ON `users`(`pin_code`);
