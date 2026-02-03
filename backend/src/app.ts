import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { v2 as cloudinary } from "cloudinary";
import { env } from "./config/env";
import { apiRouter } from "./routes";
import { errorHandler } from "./middlewares/errorHandler";

export const app = express();

cloudinary.config({ cloudinary_url: env.CLOUDINARY_URL });

app.use(helmet());
app.use(cors({ origin: env.CORS_ORIGIN, credentials: true }));
app.use(express.json({ limit: "1mb" }));
app.use(morgan("dev"));

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use("/api", apiRouter);

app.use((_req, res) => {
  res.status(404).json({ error: { message: "Not Found" } });
});

app.use(errorHandler);
