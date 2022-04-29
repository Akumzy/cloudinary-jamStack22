/*
  Warnings:

  - The primary key for the `ChatRoomMember` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - A unique constraint covering the columns `[chatRoomId,userId]` on the table `ChatRoomMember` will be added. If there are existing duplicate values, this will fail.
  - The required column `id` was added to the `ChatRoomMember` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- AlterTable
ALTER TABLE `ChatRoomMember` DROP PRIMARY KEY,
    ADD COLUMN `id` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- CreateIndex
CREATE UNIQUE INDEX `ChatRoomMember_chatRoomId_userId_key` ON `ChatRoomMember`(`chatRoomId`, `userId`);
