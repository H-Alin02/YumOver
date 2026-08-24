import express from "express";
import { suggest } from "../controllers/recipesController.js";

const router = express.Router();

router.post("/suggest", suggest)

export default router;