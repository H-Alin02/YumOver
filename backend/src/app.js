import express from "express";
import healthRoutes from "./routes/healthRoutes.js";
import recipesRoutes from "./routes/recipesRoutes.js";
import ingredientsRoutes from "./routes/ingredientsRoutes.js";
import cors from "cors";

const app = express();

// CORS middleware
app.use(cors({origin: "http://localhost:5173"}));

// Body parsing middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Routes
app.use("/health", healthRoutes);
app.use("/api/recipes", recipesRoutes);
app.use("/api/ingredients", ingredientsRoutes);

export default app;
