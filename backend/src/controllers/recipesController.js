import { prisma } from "../config/db.js";

export const suggest = async (req, res) => {
  return res.status(200).json({ status: "OK" });
};