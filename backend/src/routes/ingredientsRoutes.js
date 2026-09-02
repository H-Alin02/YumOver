import express from "express";
import { list } from "../controllers/ingredientsController.js";

const router = express.Router();

router.get("/", list);

export default router;
