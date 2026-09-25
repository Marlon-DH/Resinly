import "dotenv/config";

import express, { type Express, type Request, type Response } from "express";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import { Pool } from "pg";
import { prisma } from "./lib/prisma.js";

const app: Express = express();

app.use(cors({ origin: true}));

app.use(express.json());

const port = process.env.PORT || 3000;

export const pool = new Pool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

//Registros de req HTTP do morgan
app.use(morgan("dev"));

//Cabeçalho de segurança helmet
app.use(helmet());

app.get("/", (req: Request, res: Response) => {
  res.send("Hello World!");
});