import "dotenv/config";

import express, { type Express, type Request, type Response } from "express";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import { prisma } from "./lib/prisma.js";

const app: Express = express();
const DEFAULT_USER_EMAIL = "dev@resinly.local";

app.use(cors({ origin: process.env.FRONTEND_URL ?? true }));
app.use(express.json());
app.use(morgan("dev"));
app.use(helmet());

const port = Number(process.env.PORT ?? 3000);

async function getOrCreateDefaultUser() {
  return prisma.user.upsert({
    where: { email: DEFAULT_USER_EMAIL },
    update: {},
    create: {
      email: DEFAULT_USER_EMAIL,
      name: "Usuário local",
    },
  });
}

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

app.get("/users", async (_req: Request, res: Response) => {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
  });

  res.json(users);
});

app.post("/users", async (req: Request, res: Response) => {
  const { email, name } = req.body ?? {};

  if (!email || typeof email !== "string") {
    return res.status(400).json({ message: "Email é obrigatório." });
  }

  const user = await prisma.user.create({
    data: {
      email,
      name: typeof name === "string" ? name : undefined,
    },
  });

  return res.status(201).json(user);
});

app.get("/characters", async (_req: Request, res: Response) => {
  const user = await getOrCreateDefaultUser();

  const characters = await prisma.character.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
  });

  res.json(characters);
});

app.post("/characters", async (req: Request, res: Response) => {
  const { name, element, rarity, imageUrl } = req.body ?? {};

  if (!name || typeof name !== "string") {
    return res
      .status(400)
      .json({ message: "Nome do personagem é obrigatório." });
  }

  const user = await getOrCreateDefaultUser();

  const character = await prisma.character.create({
    data: {
      name,
      element: typeof element === "string" ? element : null,
      rarity: typeof rarity === "number" ? rarity : null,
      imageUrl: typeof imageUrl === "string" ? imageUrl : null,
      userId: user.id,
    },
  });

  return res.status(201).json(character);
});

app.put("/characters/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, element, rarity, imageUrl } = req.body ?? {};

  const character = await prisma.character.update({
    where: { id },
    data: {
      name: typeof name === "string" ? name : undefined,
      element: typeof element === "string" ? element : undefined,
      rarity: typeof rarity === "number" ? rarity : undefined,
      imageUrl: typeof imageUrl === "string" ? imageUrl : undefined,
    },
  });

  res.json(character);
});

app.delete("/characters/:id", async (req: Request, res: Response) => {
  const { id } = req.params;

  await prisma.character.delete({ where: { id } });

  res.status(204).send();
});

app.get("/weapons", async (_req: Request, res: Response) => {
  const user = await getOrCreateDefaultUser();

  const weapons = await prisma.weapon.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
  });

  res.json(weapons);
});

app.post("/weapons", async (req: Request, res: Response) => {
  const { name, type, rarity, imageUrl } = req.body ?? {};

  if (!name || typeof name !== "string") {
    return res.status(400).json({ message: "Nome da arma é obrigatório." });
  }

  const user = await getOrCreateDefaultUser();

  const weapon = await prisma.weapon.create({
    data: {
      name,
      type: typeof type === "string" ? type : null,
      rarity: typeof rarity === "number" ? rarity : null,
      imageUrl: typeof imageUrl === "string" ? imageUrl : null,
      userId: user.id,
    },
  });

  return res.status(201).json(weapon);
});

app.put("/weapons/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, type, rarity, imageUrl } = req.body ?? {};

  const weapon = await prisma.weapon.update({
    where: { id },
    data: {
      name: typeof name === "string" ? name : undefined,
      type: typeof type === "string" ? type : undefined,
      rarity: typeof rarity === "number" ? rarity : undefined,
      imageUrl: typeof imageUrl === "string" ? imageUrl : undefined,
    },
  });

  res.json(weapon);
});

app.delete("/weapons/:id", async (req: Request, res: Response) => {
  const { id } = req.params;

  await prisma.weapon.delete({ where: { id } });

  res.status(204).send();
});

app.get("/builds", async (_req: Request, res: Response) => {
  const user = await getOrCreateDefaultUser();

  const builds = await prisma.build.findMany({
    where: { userId: user.id },
    orderBy: { priority: "desc" },
    include: {
      character: true,
      weapon: true,
    },
  });

  res.json(builds);
});

app.post("/builds", async (req: Request, res: Response) => {
  const { title, notes, priority, characterId, weaponId } = req.body ?? {};

  if (!title || typeof title !== "string") {
    return res.status(400).json({ message: "Título do build é obrigatório." });
  }

  const user = await getOrCreateDefaultUser();

  const build = await prisma.build.create({
    data: {
      title,
      notes: typeof notes === "string" ? notes : null,
      priority: typeof priority === "number" ? priority : 0,
      userId: user.id,
      characterId: typeof characterId === "string" ? characterId : null,
      weaponId: typeof weaponId === "string" ? weaponId : null,
    },
    include: {
      character: true,
      weapon: true,
    },
  });

  return res.status(201).json(build);
});

app.put("/builds/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  const { title, notes, priority, characterId, weaponId } = req.body ?? {};

  const build = await prisma.build.update({
    where: { id },
    data: {
      title: typeof title === "string" ? title : undefined,
      notes: typeof notes === "string" ? notes : undefined,
      priority: typeof priority === "number" ? priority : undefined,
      characterId: typeof characterId === "string" ? characterId : undefined,
      weaponId: typeof weaponId === "string" ? weaponId : undefined,
    },
    include: {
      character: true,
      weapon: true,
    },
  });

  res.json(build);
});

app.delete("/builds/:id", async (req: Request, res: Response) => {
  const { id } = req.params;

  await prisma.build.delete({ where: { id } });

  res.status(204).send();
});

app.listen(port, () => {
  console.log(`Servidor iniciado em: http://localhost:${port}`);
});
