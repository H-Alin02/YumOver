/*
  Warnings:

  - You are about to drop the `ingredient_alias` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "ingredient_alias" DROP CONSTRAINT "ingredient_alias_ingredient_id_fkey";

-- DropTable
DROP TABLE "ingredient_alias";
