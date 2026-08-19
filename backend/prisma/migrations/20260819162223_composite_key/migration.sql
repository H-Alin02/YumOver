/*
  Warnings:

  - The primary key for the `recipe_ingredient` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE "recipe_ingredient" DROP CONSTRAINT "recipe_ingredient_pkey",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "recipe_ingredient_pkey" PRIMARY KEY ("id");

-- CreateIndex
CREATE INDEX "recipe_ingredient_recipe_id_ingredient_id_idx" ON "recipe_ingredient"("recipe_id", "ingredient_id");
