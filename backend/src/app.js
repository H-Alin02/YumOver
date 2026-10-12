import express from "express";
import healthRoutes from "./routes/healthRoutes.js";
import recipesRoutes from "./routes/recipesRoutes.js";
import ingredientsRoutes from "./routes/ingredientsRoutes.js";
import errorHandler from "./middlewares/errorMiddleware.js";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import cors from "cors";
import helmet from "helmet"

const HERE = dirname(fileURLToPath(import.meta.url));
const DIST = join(HERE, "..", "..", "frontend", "dist");

const app = express();

app.use(helmet())

// CORS middleware
app.use(cors({ origin: "http://localhost:5173" }));

// Body parsing middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Routes
app.use("/health", healthRoutes);
app.use("/api/recipes", recipesRoutes);
app.use("/api/ingredients", ingredientsRoutes);

// Serves static files for the frontend
app.use(express.static(DIST));

// SPA fallback, returns index.html
app.get("/{*splat}", (req, res) => {
    res.sendFile(join(DIST, "index.html"));
});

app.use(errorHandler);

export default app;
