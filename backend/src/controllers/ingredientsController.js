import { getAllIngredients } from "../services/ingredientService.js";

export const list = async (req, res) => {
  const ingredients = await getAllIngredients();
  return res.status(200).json({ ingredients });
};
