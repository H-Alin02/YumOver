import "dotenv/config";
import { test } from "node:test";
import assert from "node:assert/strict";
import app from "../src/app.js";
import { prisma } from "../src/config/db.js";

test("POST /api/recipes/suggest returns mapped recipes for a matching pantry", async (t) => {
  // 1. PREPARE MOCK DATA
  const fakeRecipes = [
    {
      id: 3,
      title: "Carbonara",
      instructions: ["Cuoci la pasta", "Manteca con uova e guanciale"],
      recipeIngredients: [
        { ingredient: { key: "spaghetti" } },
        { ingredient: { key: "guanciale" } },
        { ingredient: { key: "uova" } },
      ],
    },
  ];

  const fakeIngredients = [
    { id: 1, key: "spaghetti", is_staple: false, derives_from_id: null },
    { id: 2, key: "guanciale", is_staple: false, derives_from_id: null },
    { id: 3, key: "uova", is_staple: false, derives_from_id: null },
  ];

  const fakeWorkerResponse = {
    results: [
      {
        recipe_id: 3,
        score: 0.9,
        matched: ["spaghetti", "guanciale", "uova"],
        missing: [],
        adapted: {
          recipe_id: 3,
          feasible: true,
          title: "Carbonara con le uova",
          steps: ["Cuoci la pasta", "Manteca con uova e guanciale"],
          substitutions: [
            {
              original_key: "tuorli",
              replacement_key: "uova",
              reason: "Le uova intere danno la stessa base grassa.",
            },
          ],
          unfeasible_reason: null,
        },
      },
    ],
  };

  // 2. MOCK PRISMA AND THE WORKER FETCH
  const workerUrl = `${process.env.WORKER_URL}/suggest`;
  const realFetch = globalThis.fetch;

  // Prisma model methods are Proxy-backed, so direct assignment works where t.mock.method does not.
  const originalRecipeFindMany = prisma.recipe.findMany;
  const originalIngredientFindMany = prisma.ingredient.findMany;

  prisma.recipe.findMany = async () => fakeRecipes;
  prisma.ingredient.findMany = async () => fakeIngredients;

  t.after(() => {
    prisma.recipe.findMany = originalRecipeFindMany;
    prisma.ingredient.findMany = originalIngredientFindMany;
  });

  t.mock.method(globalThis, "fetch", async (url, options) => {
    if (url === workerUrl) {
      return new Response(JSON.stringify(fakeWorkerResponse), { status: 200 });
    }
    return realFetch(url, options); // not the worker: pass through to the real fetch
  });

  const server = app.listen(0);
  const PORT = server.address().port;

  try {
    // 3. EXECUTE: call the gateway route (real HTTP)
    const res = await fetch(`http://localhost:${PORT}/api/recipes/suggest`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pantry: ["spaghetti", "guanciale", "uova"] }),
    });

    // 4. ASSERT
    assert.equal(res.status, 200);
    assert.deepEqual(await res.json(), {
      results: [
        {
          id: 3,
          title: "Carbonara con le uova",
          instructions: ["Cuoci la pasta", "Manteca con uova e guanciale"],
          substitutions: [
            {
              original_key: "tuorli",
              replacement_key: "uova",
              reason: "Le uova intere danno la stessa base grassa.",
            },
          ],
          originalTitle: "Carbonara",
          score: 0.9,
          matched: ["spaghetti", "guanciale", "uova"],
          missing: [],
        },
      ],
    });
  } finally {
    server.close();
  }
});
