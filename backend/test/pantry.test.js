import { test } from "node:test";
import assert from "node:assert/strict";
import app from "../src/app.js";

const rejectedPantries = [
    { name: "no ingredients", pantry: [] },
    {
        name: "eleven ingredients",
        pantry: ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k"],
    },
];

for (const { name, pantry } of rejectedPantries) {
    test(`POST /api/recipes/suggest rejects a pantry with ${name}`, async () => {
        const server = app.listen(0);
        const PORT = server.address().port;

        try {
            const res = await fetch(`http://localhost:${PORT}/api/recipes/suggest`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ pantry }),
            });

            assert.equal(res.status, 400);
            assert.ok((await res.json()).error);
        } finally {
            server.close();
        }
    });
}
