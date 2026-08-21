import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import "dotenv/config";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { z } from "zod";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

const HERE = dirname(fileURLToPath(import.meta.url));
const DATA = join(HERE, "..", "..", "data");

const read = (file) => JSON.parse(readFileSync(join(DATA, file), "utf8"));

// Zod Schemas
const CategorySchema = z.object({
  id: z.string().min(1), // nel file si chiama id, nella tabella slug
  label: z.string().min(1),
  scope: z.string().min(1),
});

const IngredientSchema = z.object({
  key: z.string().min(1),
  display: z.string().min(1),
  category: z.string().min(1),
  is_staple: z.boolean(),
  derives_from: z.string().nullable(),
  states: z.array(z.string()),
  variants: z.array(z.string()).optional(),
});

const MentionSchema = z.object({
  key: z.string().min(1),
  as_written: z.string().min(1),
  quantity: z.string().min(1),
  required_state: z.string().nullable(),
});

const RecipeSchema = z.object({
  id: z.number().int().positive(),
  title: z.string().min(1),
  cuisine: z.string().min(1),
  servings: z.number().int().positive(),
  prep_time: z.number().int().positive(),
  difficulty: z.enum(["easy", "medium", "hard"]),
  reviewed: z.boolean(),
  instructions: z.array(z.string()).min(1),
  tags: z.array(z.string()),
  ingredients: z.array(MentionSchema).min(1),
});

// Validate
const parseOrStop = (schema, data, what) => {
  const result = schema.safeParse(data);
  if (!result.success) {
    console.error(`Not valid data in ${what}:`);
    console.error(z.prettifyError(result.error));
    process.exit(1);
  }
  return result.data;
};

const categories = parseOrStop(
  z.array(CategorySchema),
  read("ingredient-categories.json"),
  "ingredient-categories.json",
);

const ingredients = parseOrStop(
  z.array(IngredientSchema),
  read("ingredients.json").ingredients, // le voci stanno dentro la chiave "ingredients"
  "ingredients.json",
);

const recipes = parseOrStop(
  z.array(RecipeSchema),
  read("recipes-seed.json"),
  "recipes-seed.json",
);

const main = async () => {
  console.log("Seeding data...");

  // Empty in reverse order
  await prisma.recipeIngredient.deleteMany();
  await prisma.recipe.deleteMany();
  await prisma.ingredient.deleteMany();
  await prisma.category.deleteMany();

  // Categories
  await prisma.category.createMany({
    data: categories.map((c) => ({
      slug: c.id,
      label: c.label,
      scope: c.scope,
    })),
  });

  // Get category id
  const categoryRows = await prisma.category.findMany({
    select: { id: true, slug: true },
  });

  const categoryIdBySlug = new Map(categoryRows.map((c) => [c.slug, c.id]));

  // Ingredients
  await prisma.ingredient.createMany({
    data: ingredients.map((i) => ({
      key: i.key,
      display: i.display,
      category_id: categoryIdBySlug.get(i.category),
      is_staple: i.is_staple,
      states: i.states,
      derives_from_id: null, // seconda passata, blocco 7
    })),
  });

  // Get ingredient ids
  const ingredientRows = await prisma.ingredient.findMany({
    select: { id: true, key: true },
  });
  const ingredientIdByKey = new Map(ingredientRows.map((i) => [i.key, i.id]));

  // Add derivations
  for (const i of ingredients.filter((i) => i.derives_from)) {
    await prisma.ingredient.update({
      where: { key: i.key },
      data: { derives_from_id: ingredientIdByKey.get(i.derives_from) },
    });
  }

  // Recipes
  await prisma.recipe.createMany({
    data: recipes.map((r) => ({
      id: r.id,
      title: r.title,
      cuisine: r.cuisine,
      servings: r.servings,
      prep_time: r.prep_time,
      difficulty: r.difficulty,
      reviewed: r.reviewed,
      instructions: r.instructions,
      tags: r.tags,
    })),
  });

  // Ingredient mentions in recipes
  const mentions = recipes.flatMap((r) =>
    r.ingredients.map((m) => ({
      recipe_id: r.id,
      ingredient_id: ingredientIdByKey.get(m.key),
      as_written: m.as_written,
      quantity: m.quantity,
      required_state: m.required_state,
    })),
  );

  await prisma.recipeIngredient.createMany({ data: mentions });

  // Final count
  const counts = {
    category: await prisma.category.count(),
    ingredient: await prisma.ingredient.count(),
    recipe: await prisma.recipe.count(),
    recipe_ingredient: await prisma.recipeIngredient.count(),
  };
  console.table(counts);

  console.log("Seeding completed!");
};

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
