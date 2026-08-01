import { test } from "node:test";
import assert from "node:assert/strict";
import app from "../src/app.js";

test("Get /health responds 200 with status OK", async () => {
  // 1. PREPARE
  const server = app.listen(0);
  const PORT = server.address().port;

  try {
    // 2. EXECUTE
    const res = await fetch(`http://localhost:${PORT}/health`);

    // 3. ASSERT
    assert.equal(res.status, 200);
    assert.deepEqual(await res.json(), { status: "OK" });
  } finally {
    // 4. CLOSE
    server.close();
  }
});
