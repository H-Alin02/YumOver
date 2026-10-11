import express from "express";
import { suggest } from "../controllers/recipesController.js";
import limiter from '../middlewares/rateLimitMiddleware.js'
const router = express.Router();

// Rate-limited route
router.post("/suggest", limiter, suggest)

export default router;