import express from "express";
import healthRoutes from "./routes/healthRoutes.js";
import recipesRoutes from "./routes/recipesRoutes.js";
import ingredientsRoutes from "./routes/ingredientsRoutes.js";

const app = express();

// Body parsing middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Routes
app.use("/health", healthRoutes);
app.use("/api/recipes", recipesRoutes);
app.use("/api/ingredients", ingredientsRoutes);

export default app;
