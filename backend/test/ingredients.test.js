import "dotenv/config";
import { test } from "node:test";
import assert from "node:assert/strict";
import app from "../src/app.js";
import { prisma } from "../src/config/db.js";

// 1. Prepare Mock Data
const fakeData = [
  {
    key: "olio-di-oliva",
    display: "Olio di oliva",
    category: { slug: "condiments", label: "Condimenti" },
  },
  {
    key: "zucchine",
    display: "Zucchine",
    category: { slug: "vegetables", label: "Ortaggi" },
  },
];

test("GET /api/ingredients returns the vocabulary with key, display and category", async (t) => {
  // 2. Mock
  const originalFindMany = prisma.ingredient.findMany;
  prisma.ingredient.findMany = async () => fakeData;
  t.after(() => {
    prisma.ingredient.findMany = originalFindMany;
  });

  // 3. Prepare and Execute
  const server = app.listen(0);
  const PORT = server.address().port;

  try {
    const res = await fetch(`http://localhost:${PORT}/api/ingredients`);
    // 4. Assert
    assert.equal(res.status, 200);
    assert.deepEqual(await res.json(), {
      ingredients: [
        {
          key: "olio-di-oliva",
          display: "Olio di oliva",
          category: { slug: "condiments", label: "Condimenti" },
        },
        {
          key: "zucchine",
          display: "Zucchine",
          category: { slug: "vegetables", label: "Ortaggi" },
        },
      ],
    });
  } finally {
    server.close();
  }
});
