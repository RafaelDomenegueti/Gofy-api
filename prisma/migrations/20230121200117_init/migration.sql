/*
  Warnings:

  - The primary key for the `tb_contentTags` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `tb_contentTags` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "tb_contentTags" DROP CONSTRAINT "tb_contentTags_pkey",
DROP COLUMN "id",
ADD CONSTRAINT "tb_contentTags_pkey" PRIMARY KEY ("contentId", "tagId");
