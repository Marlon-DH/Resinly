import "dotenv/config";

import express, { type Express, type Request, type Response } from "express";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import { prisma } from "./lib/prisma.js";

type WeekDay =
  | "MONDAY"
  | "TUESDAY"
  | "WEDNESDAY"
  | "THURSDAY"
  | "FRIDAY"
  | "SATURDAY"
  | "SUNDAY";

const app: Express = express();
const DEFAULT_USER_EMAIL = "dev@resinly.local";
const VALID_DAYS: WeekDay[] = [
  "MONDAY",
  "TUESDAY",
  "WEDNESDAY",
  "THURSDAY",
  "FRIDAY",
  "SATURDAY",
  "SUNDAY",
];

const fallbackCharacters = [
  {
    id: "char-aether",
    name: "Aether",
    title: "Viajante",
    element: "Anemo",
    rarity: 5,
    weaponType: "Espada",
    imageUrl: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "char-keqing",
    name: "Keqing",
    title: "Espada do céu",
    element: "Electro",
    rarity: 5,
    weaponType: "Espada",
    imageUrl: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "char-venti",
    name: "Venti",
    title: "Bardo dos ventos",
    element: "Anemo",
    rarity: 5,
    weaponType: "Arco",
    imageUrl: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

const fallbackWeapons = [
  {
    id: "wp-abs",
    name: "Absolvição",
    type: "Espada",
    rarity: 5,
    imageUrl: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "wp-aqua",
    name: "Aqua Simulacra",
    type: "Arco",
    rarity: 5,
    imageUrl: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "wp-prim",
    name: "Primordial Jade Cutter",
    type: "Espada",
    rarity: 5,
    imageUrl: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

const inMemoryData = {
  characters: [...fallbackCharacters],
  weapons: [...fallbackWeapons],
  agenda: [] as Array<{
    id: string;
    userId: string;
    characterId: string | null;
    weaponId: string | null;
    title: string | null;
    priority: number;
    day: WeekDay;
    notes: string | null;
    createdAt: string;
    updatedAt: string;
    character?: (typeof fallbackCharacters)[number] | null;
    weapon?: (typeof fallbackWeapons)[number] | null;
  }>,
};

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

function normalizeDays(value: unknown): WeekDay[] {
  if (!Array.isArray(value)) {
    return [];
  }

  const normalized = value
    .map((item) => (typeof item === "string" ? item.toUpperCase() : ""))
    .filter((item): item is WeekDay => VALID_DAYS.includes(item as WeekDay));

  return [...new Set(normalized)];
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
      name: typeof name === "string" ? name : null,
    },
  });

  return res.status(201).json(user);
});

app.get("/characters", async (req: Request, res: Response) => {
  const search =
    typeof req.query.search === "string" ? req.query.search.trim() : "";
  const element =
    typeof req.query.element === "string" ? req.query.element : undefined;
  const rarity = req.query.rarity ? Number(req.query.rarity) : undefined;
  const weaponType =
    typeof req.query.weaponType === "string" ? req.query.weaponType : undefined;

  try {
    const characters = await prisma.character.findMany({
      where: {
        AND: [
          search
            ? {
                OR: [
                  { name: { contains: search, mode: "insensitive" } },
                  { title: { contains: search, mode: "insensitive" } },
                ],
              }
            : {},
          element ? { element: { equals: element, mode: "insensitive" } } : {},
          rarity ? { rarity } : {},
          weaponType
            ? { weaponType: { contains: weaponType, mode: "insensitive" } }
            : {},
        ],
      },
      include: {
        farmDays: true,
      },
      orderBy: { name: "asc" },
    });

    return res.json(characters);
  } catch (error) {
    let filtered = [...inMemoryData.characters];

    if (search) {
      filtered = filtered.filter(
        (character) =>
          character.name.toLowerCase().includes(search.toLowerCase()) ||
          (character.title ?? "").toLowerCase().includes(search.toLowerCase()),
      );
    }

    if (element) {
      filtered = filtered.filter(
        (character) =>
          character.element?.toLowerCase() === element.toLowerCase(),
      );
    }

    if (rarity) {
      filtered = filtered.filter((character) => character.rarity === rarity);
    }

    if (weaponType) {
      filtered = filtered.filter(
        (character) =>
          character.weaponType?.toLowerCase() === weaponType.toLowerCase(),
      );
    }

    return res.json(filtered);
  }
});

app.post("/characters", async (req: Request, res: Response) => {
  const { name, title, element, rarity, weaponType, imageUrl, farmDays } =
    req.body ?? {};

  if (!name || typeof name !== "string") {
    return res
      .status(400)
      .json({ message: "Nome do personagem é obrigatório." });
  }

  const normalizedDays = normalizeDays(farmDays);

  try {
    const character = await prisma.character.create({
      data: {
        name,
        title: typeof title === "string" ? title : null,
        element: typeof element === "string" ? element : null,
        rarity: typeof rarity === "number" ? rarity : null,
        weaponType: typeof weaponType === "string" ? weaponType : null,
        imageUrl: typeof imageUrl === "string" ? imageUrl : null,
        farmDays: {
          create: normalizedDays.map((day) => ({ day })),
        },
      },
      include: {
        farmDays: true,
      },
    });

    return res.status(201).json(character);
  } catch (error) {
    const created = {
      id: `char-${Date.now()}`,
      name,
      title: typeof title === "string" ? title : null,
      element: typeof element === "string" ? element : null,
      rarity: typeof rarity === "number" ? rarity : null,
      weaponType: typeof weaponType === "string" ? weaponType : null,
      imageUrl: typeof imageUrl === "string" ? imageUrl : null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    inMemoryData.characters.unshift(created);
    return res.status(201).json(created);
  }
});

app.get("/weapons", async (req: Request, res: Response) => {
  const search =
    typeof req.query.search === "string" ? req.query.search.trim() : "";
  const type = typeof req.query.type === "string" ? req.query.type : undefined;
  const rarity = req.query.rarity ? Number(req.query.rarity) : undefined;

  try {
    const weapons = await prisma.weapon.findMany({
      where: {
        AND: [
          search
            ? {
                OR: [
                  { name: { contains: search, mode: "insensitive" } },
                  { type: { contains: search, mode: "insensitive" } },
                ],
              }
            : {},
          type ? { type: { equals: type, mode: "insensitive" } } : {},
          rarity ? { rarity } : {},
        ],
      },
      include: {
        farmDays: true,
      },
      orderBy: { name: "asc" },
    });

    return res.json(weapons);
  } catch (error) {
    let filtered = [...inMemoryData.weapons];

    if (search) {
      filtered = filtered.filter(
        (weapon) =>
          weapon.name.toLowerCase().includes(search.toLowerCase()) ||
          (weapon.type ?? "").toLowerCase().includes(search.toLowerCase()),
      );
    }

    if (type) {
      filtered = filtered.filter(
        (weapon) => weapon.type?.toLowerCase() === type.toLowerCase(),
      );
    }

    if (rarity) {
      filtered = filtered.filter((weapon) => weapon.rarity === rarity);
    }

    return res.json(filtered);
  }
});

app.post("/weapons", async (req: Request, res: Response) => {
  const { name, type, rarity, imageUrl, farmDays } = req.body ?? {};

  if (!name || typeof name !== "string") {
    return res.status(400).json({ message: "Nome da arma é obrigatório." });
  }

  const normalizedDays = normalizeDays(farmDays);

  try {
    const weapon = await prisma.weapon.create({
      data: {
        name,
        type: typeof type === "string" ? type : null,
        rarity: typeof rarity === "number" ? rarity : null,
        imageUrl: typeof imageUrl === "string" ? imageUrl : null,
        farmDays: {
          create: normalizedDays.map((day) => ({ day })),
        },
      },
      include: {
        farmDays: true,
      },
    });

    return res.status(201).json(weapon);
  } catch (error) {
    const created = {
      id: `wp-${Date.now()}`,
      name,
      type: typeof type === "string" ? type : null,
      rarity: typeof rarity === "number" ? rarity : null,
      imageUrl: typeof imageUrl === "string" ? imageUrl : null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    inMemoryData.weapons.unshift(created);
    return res.status(201).json(created);
  }
});

app.get("/agenda", async (_req: Request, res: Response) => {
  try {
    const user = await getOrCreateDefaultUser();

    const agenda = await prisma.userFarmAgenda.findMany({
      where: { userId: user.id },
      include: {
        character: true,
        weapon: true,
      },
      orderBy: [{ day: "asc" }, { createdAt: "desc" }],
    });

    return res.json(agenda);
  } catch (error) {
    return res.json(inMemoryData.agenda);
  }
});

app.post("/agenda", async (req: Request, res: Response) => {
  const { characterId, weaponId, day, notes, title, priority } = req.body ?? {};
  const validDay = typeof day === "string" ? day.toUpperCase() : "";

  if (!VALID_DAYS.includes(validDay as WeekDay)) {
    return res.status(400).json({ message: "Dia da semana inválido." });
  }

  if (!characterId && !weaponId) {
    return res
      .status(400)
      .json({ message: "Informe personagem ou arma para a agenda." });
  }

  const normalizedPriority =
    typeof priority === "number" ? priority : Number(priority ?? 1);

  try {
    const user = await getOrCreateDefaultUser();

    const agendaItem = await prisma.userFarmAgenda.create({
      data: {
        userId: user.id,
        characterId: typeof characterId === "string" ? characterId : null,
        weaponId: typeof weaponId === "string" ? weaponId : null,
        title:
          typeof title === "string" && title.trim().length > 0
            ? title.trim()
            : null,
        priority: Number.isFinite(normalizedPriority) ? normalizedPriority : 1,
        day: validDay as WeekDay,
        notes: typeof notes === "string" ? notes : null,
      },
      include: {
        character: true,
        weapon: true,
      },
    });

    return res.status(201).json(agendaItem);
  } catch (error) {
    const character = inMemoryData.characters.find(
      (item) => item.id === characterId,
    );
    const weapon = inMemoryData.weapons.find((item) => item.id === weaponId);
    const agendaItem = {
      id: `agenda-${Date.now()}`,
      userId: DEFAULT_USER_EMAIL,
      characterId: typeof characterId === "string" ? characterId : null,
      weaponId: typeof weaponId === "string" ? weaponId : null,
      title:
        typeof title === "string" && title.trim().length > 0
          ? title.trim()
          : character && weapon
            ? `${character.name} + ${weapon.name}`
            : (character?.name ?? weapon?.name ?? "Build salvo"),
      priority: Number.isFinite(normalizedPriority) ? normalizedPriority : 1,
      day: validDay as WeekDay,
      notes: typeof notes === "string" ? notes : null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      character: character ?? null,
      weapon: weapon ?? null,
    };

    inMemoryData.agenda.unshift(agendaItem);
    return res.status(201).json(agendaItem);
  }
});

app.delete("/agenda/:id", async (req: Request, res: Response) => {
  const id = typeof req.params.id === "string" ? req.params.id : "";

  if (!id) {
    return res.status(400).json({ message: "ID da agenda inválido." });
  }

  try {
    await prisma.userFarmAgenda.delete({
      where: { id },
    });

    return res.status(204).send();
  } catch (error) {
    inMemoryData.agenda = inMemoryData.agenda.filter((item) => item.id !== id);
    return res.status(204).send();
  }
});

app.listen(port, () => {
  console.log(`Servidor iniciado em: http://localhost:${port}`);
});
