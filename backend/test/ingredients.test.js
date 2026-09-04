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

test("POST /api/ingredients/unknown logs the term and answers 204", async (t) => {
  const lines = [];
  t.mock.method(console, "log", (line) => lines.push(line));

  const server = app.listen(0);
  const PORT = server.address().port;

  try {
    const res = await fetch(`http://localhost:${PORT}/api/ingredients/unknown`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ term: "  friarielli  " }),
    });

    assert.equal(res.status, 204);
    assert.equal(await res.text(), "");

    const logged = lines
      .map((line) => JSON.parse(line))
      .find((entry) => entry.event === "unknown_ingredient");

    assert.equal(logged.term, "friarielli");
    assert.ok(!Number.isNaN(Date.parse(logged.at)));
  } finally {
    server.close();
  }
});

test("POST /api/ingredients/unknown rejects empty and oversized terms with 400", async () => {
  const server = app.listen(0);
  const PORT = server.address().port;

  const post = (body) =>
    fetch(`http://localhost:${PORT}/api/ingredients/unknown`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

  try {
    assert.equal((await post({ term: "   " })).status, 400);
    assert.equal((await post({ term: "a".repeat(101) })).status, 400);
    assert.equal((await post({})).status, 400);
  } finally {
    server.close();
  }
});