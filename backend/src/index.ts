import "dotenv/config";

import express, { type Express, type Request, type Response } from "express";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import { prisma } from "./lib/prisma.js";

const app: Express = express();

app.use(cors({ origin: process.env.FRONTEND_URL ?? true }));
app.use(express.json());
app.use(morgan("dev"));
app.use(helmet());

const port = Number(process.env.PORT ?? 3000);

app.get("/", (_req: Request, res: Response) => {
  res.json({
    message: "Resinly API funcionando",
    status: "ok",
  });
});

app.get("/health", async (_req: Request, res: Response) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.json({ ok: true, database: "connected" });
  } catch (error) {
    console.error("Database health check failed:", error);
    res.status(500).json({ ok: false, database: "disconnected" });
  }
});

app.listen(port, () => {
  console.log(`Servidor iniciado em: http://localhost:${port}`);
});
