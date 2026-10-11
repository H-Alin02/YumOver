import { test } from "node:test";
import assert from "node:assert/strict";
import app from "../src/app.js";

test("Rate limiting is applied on POST /api/recipes/suggest with 20 requests every 30 minutes", async () => {
    const server = app.listen(0);
    const PORT = server.address().port;

    try {
        for (let i = 1; i <= 21; i++) {
            const res = await fetch(`http://localhost:${PORT}/api/recipes/suggest`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ pantry: [] }),
            });
            if (i === 21) {
                assert.equal(res.status, 429);
                assert.deepEqual(await res.json(), {error: "Troppe richieste. Riprova più tardi"})
            }else assert.equal(res.status, 400);
        }
    } finally {
        // 4. CLOSE
        server.close();
    }
});