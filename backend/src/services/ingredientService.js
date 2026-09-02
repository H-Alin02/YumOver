import { prisma } from "../config/db.js";

export const getAllIngredients = async () => 
  prisma.ingredient.findMany({
    select: {
      key: true,
      display: true,
      category: { select: { slug: true, label: true } },
    },
    orderBy: { key: "asc" },
  });
