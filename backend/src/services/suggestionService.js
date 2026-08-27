import { prisma } from "../config/db.js";

export const getAllRecipes = async () =>
  prisma.recipe.findMany({
    include: { recipeIngredients: { include: { ingredient: true } } },
  });


export const buildWorkerPayload = (pantry, candidates, ingredients) => {
  // Lookup table
  const keyById = new Map(ingredients.map((i) => [i.id, i.key]));

  // Payload that matches SuggestRequest in worker schema
  return {
    pantry,
    recipes: candidates.map((r) => ({
      id: r.id,
      title: r.title,
      instructions: r.instructions,
      ingredients: r.recipeIngredients.map((ri) => ({
        key: ri.ingredient.key,
        as_written: ri.as_written,
        quantity: ri.quantity,
        required_state: ri.required_state,
      })),
    })),

    ingredients: ingredients.map((i) => ({
      key: i.key,
      is_staple: i.is_staple,
      derives_from: i.derives_from_id ? keyById.get(i.derives_from_id) : null,
    })),
  };
};

export const requestSuggestions = async (payload) => {
  const workerRes = await fetch(`${process.env.WORKER_URL}/suggest`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!workerRes.ok) throw new Error("Worker request failed");
  return workerRes.json();
};

export const mapSuggestions = (workerResults, candidates) => {
  const recipeById = new Map(candidates.map((r) => [r.id, r]));

  return workerResults
    .filter((result) => result.adapted.feasible)
    .map((result) => {
      const recipe = recipeById.get(result.recipe_id);
      return {
        id: result.recipe_id,
        title: result.adapted.title,
        instructions: result.adapted.steps,
        substitutions: result.adapted.substitutions,
        originalTitle: recipe.title,
        score: result.score,
        matched: result.matched,
        missing: result.missing,
      };
    });
};
