import { prisma } from "../config/db.js";
import {
  buildWorkerPayload,
  getAllRecipes,
  mapSuggestions,
  requestSuggestions,
} from "../services/suggestionService.js";
import { z } from "zod";

const suggestSchema = z.object({
  pantry: z.array(z.string().trim().min(1).max(100)).min(1).max(10)
});

export const suggest = async (req, res) => {
  const result = suggestSchema.safeParse(req.body);
  if (!result.success) {
    return res
      .status(400)
      .json({ error: "Pantry must be an array of 1 to 10 ingredients keys." });
  }

  const [candidates, ingredients] = await Promise.all([
    getAllRecipes(),
    prisma.ingredient.findMany(),
  ]);

  if (candidates.length === 0) {
    return res.status(200).json({ results: [] });
  }

  const payload = buildWorkerPayload(result.data.pantry, candidates, ingredients);

  let data;
  try {
    data = await requestSuggestions(payload);
  } catch {
    return res.status(502).json({ error: "Worker unavailable" });
  }

  const results = mapSuggestions(data.results, candidates);
  return res.status(200).json({ results });
};
