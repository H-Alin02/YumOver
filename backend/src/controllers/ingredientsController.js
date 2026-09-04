import { z } from "zod";
import { getAllIngredients } from "../services/ingredientService.js";

const unknownTermSchema = z.object({
  term: z.string().trim().min(1).max(100),
});

export const list = async (req, res) => {
  const ingredients = await getAllIngredients();
  return res.status(200).json({ ingredients });
};

export const logUnknown = (req, res) => {
  const parsed = unknownTermSchema.safeParse(req.body);

  if (!parsed.success) {
    return res
      .status(400)
      .json({ error: "Term must be a string of 1 to 100 characters" });
  }

  console.log(
    JSON.stringify({
      event: "unknown_ingredient",
      term: parsed.data.term,
      at: new Date().toISOString(),
    }),
  );

  return res.status(204).end();
};
