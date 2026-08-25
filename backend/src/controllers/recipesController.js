import { prisma } from "../config/db.js";
import {
  buildWorkerPayload,
  getCandidateRecipes,
  mapSuggestions,
  requestSuggestions,
} from "../services/suggestionService.js";

export const suggest = async (req, res) => {
  const { pantry } = req.body;

  if (!Array.isArray(pantry) || pantry.length === 0) {
    return res
      .status(400)
      .json({ error: "Pantry must be a non-empty array of ingredient keys" });
  }

  const [candidates, ingredients] = await Promise.all([
    getCandidateRecipes(pantry),
    prisma.ingredient.findMany(),
  ]);

  if (candidates.length === 0) {
    return res.status(200).json({ results: [] });
  }

  const payload = buildWorkerPayload(pantry, candidates, ingredients);

  let data;
  try {
    data = await requestSuggestions(payload);
  } catch {
    return res.status(502).json({ error: "Worker unavailable" });
  }

  const workerResults = mapSuggestions(data.results, candidates);
  return res.status(200).json({ workerResults });
};
