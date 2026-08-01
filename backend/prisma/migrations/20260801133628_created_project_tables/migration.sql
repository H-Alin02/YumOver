/*
  Warnings:

  - You are about to drop the `Test` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "Test";

-- CreateTable
CREATE TABLE "category" (
    "id" SERIAL NOT NULL,
    "slug" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "scope" TEXT NOT NULL,

    CONSTRAINT "category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ingredient" (
    "id" SERIAL NOT NULL,
    "key" TEXT NOT NULL,
    "display" TEXT NOT NULL,
    "category_id" INTEGER NOT NULL,
    "is_staple" BOOLEAN NOT NULL DEFAULT false,
    "derives_from_id" INTEGER,
    "states" TEXT[] DEFAULT ARRAY[]::TEXT[],

    CONSTRAINT "ingredient_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ingredient_alias" (
    "alias" TEXT NOT NULL,
    "display" TEXT NOT NULL,
    "ingredient_id" INTEGER NOT NULL,

    CONSTRAINT "ingredient_alias_pkey" PRIMARY KEY ("alias")
);

-- CreateTable
CREATE TABLE "recipe" (
    "id" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "cuisine" TEXT NOT NULL,
    "servings" INTEGER NOT NULL,
    "prep_time" INTEGER NOT NULL,
    "difficulty" TEXT NOT NULL,
    "reviewed" BOOLEAN NOT NULL DEFAULT false,
    "instructions" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "tags" TEXT[] DEFAULT ARRAY[]::TEXT[],

    CONSTRAINT "recipe_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "recipe_ingredient" (
    "recipe_id" INTEGER NOT NULL,
    "ingredient_id" INTEGER NOT NULL,
    "as_written" TEXT NOT NULL,
    "quantity" TEXT NOT NULL,
    "required_state" TEXT,

    CONSTRAINT "recipe_ingredient_pkey" PRIMARY KEY ("recipe_id","ingredient_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "category_slug_key" ON "category"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "ingredient_key_key" ON "ingredient"("key");

-- CreateIndex
CREATE INDEX "recipe_ingredient_ingredient_id_idx" ON "recipe_ingredient"("ingredient_id");

-- AddForeignKey
ALTER TABLE "ingredient" ADD CONSTRAINT "ingredient_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ingredient" ADD CONSTRAINT "ingredient_derives_from_id_fkey" FOREIGN KEY ("derives_from_id") REFERENCES "ingredient"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ingredient_alias" ADD CONSTRAINT "ingredient_alias_ingredient_id_fkey" FOREIGN KEY ("ingredient_id") REFERENCES "ingredient"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "recipe_ingredient" ADD CONSTRAINT "recipe_ingredient_recipe_id_fkey" FOREIGN KEY ("recipe_id") REFERENCES "recipe"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "recipe_ingredient" ADD CONSTRAINT "recipe_ingredient_ingredient_id_fkey" FOREIGN KEY ("ingredient_id") REFERENCES "ingredient"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
