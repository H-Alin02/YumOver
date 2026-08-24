import express from "express";
import healthRoutes from "./routes/healthRoutes.js";
import recipesRoutes from "./routes/recipesRoutes.js";

const app = express();

// Body parsing middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Routes
app.use("/health", healthRoutes);
app.use("/api/recipes", recipesRoutes);

export default app;
