import express from "express";
import { list, logUnknown } from "../controllers/ingredientsController.js";

const router = express.Router();

router.get("/", list);
router.post("/unknown", logUnknown);

export default router;
