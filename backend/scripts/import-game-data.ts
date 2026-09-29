import fs from "node:fs";
import path from "node:path";
import { prisma } from "../src/lib/prisma.js";

type CharacterCsvRow = {
  id?: string;
  name: string;
  element?: string;
  title?: string;
  image_url?: string;
  imageUrl?: string;
  weapon_type?: string;
  weaponType?: string;
  rarity?: string;
  farm_days?: string;
  farmDays?: string;
};

type WeaponCsvRow = {
  id?: string;
  name: string;
  type?: string;
  image_url?: string;
  imageUrl?: string;
  rarity?: string;
  weapon_type?: string;
  weaponType?: string;
  farm_days?: string;
  farmDays?: string;
};

function getArgValue(name: string): string | undefined {
  const index = process.argv.indexOf(name);
  if (index === -1) return undefined;
  return process.argv[index + 1];
}

function parseCsvLine(line: string): string[] {
  const result: string[] = [];
  let current = "";
  let insideQuotes = false;

  for (let i = 0; i < line.length; i += 1) {
    const char = line[i];

    if (char === '"') {
      if (insideQuotes && line[i + 1] === '"') {
        current += '"';
        i += 1;
      } else {
        insideQuotes = !insideQuotes;
      }
      continue;
    }

    if (char === "," && !insideQuotes) {
      result.push(current.trim());
      current = "";
      continue;
    }

    current += char;
  }

  result.push(current.trim());
  return result;
}

function parseCsv<T extends Record<string, string>>(filePath: string): T[] {
  const content = fs.readFileSync(filePath, "utf-8");
  const lines = content.split(/\r?\n/).filter(Boolean);

  if (lines.length < 2) {
    return [] as T[];
  }

  const headerLine = lines[0];
  if (!headerLine) {
    return [] as T[];
  }

  const headers = parseCsvLine(headerLine).map((header) => header.trim());

  return lines.slice(1).map((line) => {
    const values = parseCsvLine(line);
    const row: Record<string, string> = {};

    headers.forEach((header, index) => {
      row[header] = values[index] ?? "";
    });

    return row as T;
  });
}

function normalizeDay(value: string): string[] {
  const map: Record<string, string> = {
    seg: "MONDAY",
    mon: "MONDAY",
    segunda: "MONDAY",
    ter: "TUESDAY",
    tue: "TUESDAY",
    terça: "TUESDAY",
    qua: "WEDNESDAY",
    wed: "WEDNESDAY",
    quarta: "WEDNESDAY",
    qui: "THURSDAY",
    thu: "THURSDAY",
    quinta: "THURSDAY",
    sex: "FRIDAY",
    fri: "FRIDAY",
    sexta: "FRIDAY",
    sab: "SATURDAY",
    sat: "SATURDAY",
    sábado: "SATURDAY",
    dom: "SUNDAY",
    sun: "SUNDAY",
    domingo: "SUNDAY",
  };

  return value
    .split(/[;,+/\\|]/)
    .map((item) => item.trim().toLowerCase())
    .filter(Boolean)
    .map((item) => map[item] || item.toUpperCase())
    .filter((item) =>
      [
        "MONDAY",
        "TUESDAY",
        "WEDNESDAY",
        "THURSDAY",
        "FRIDAY",
        "SATURDAY",
        "SUNDAY",
      ].includes(item),
    );
}

function resolveCsvPath(fileName: string): string | null {
  const explicitPath =
    fileName === "characters.csv"
      ? getArgValue("--characters")
      : getArgValue("--weapons");

  if (explicitPath) {
    return path.resolve(process.cwd(), explicitPath);
  }

  const candidates = [
    path.resolve(process.cwd(), "data", fileName),
    path.resolve(process.cwd(), "..", "data", fileName),
    path.resolve(process.cwd(), "..", "frontend", "data", fileName),
    path.resolve(process.cwd(), "..", "..", "frontend", "data", fileName),
    path.resolve(process.cwd(), fileName),
  ];

  return candidates.find((filePath) => fs.existsSync(filePath)) ?? null;
}

async function importCharacters() {
  const filePath = resolveCsvPath("characters.csv");
  if (!filePath) {
    console.log(
      "Arquivo characters.csv não encontrado. Pulando importação de personagens. Use --characters " +
        "<caminho-do-arquivo>.",
    );
    return;
  }

  const rows = parseCsv<CharacterCsvRow>(filePath);

  for (const row of rows) {
    const name = row.name?.trim();
    if (!name) continue;

    const title = row.title || row.element;
    const weaponType = row.weapon_type || row.weaponType;
    const imageUrl = row.image_url || row.imageUrl;

    const character = await prisma.character.upsert({
      where: { name },
      update: {
        ...(title ? { title } : {}),
        ...(row.element ? { element: row.element } : {}),
        ...(row.rarity ? { rarity: Number(row.rarity) } : {}),
        ...(weaponType ? { weaponType } : {}),
        ...(imageUrl ? { imageUrl } : {}),
      },
      create: {
        name,
        title: title || null,
        element: row.element || null,
        rarity: row.rarity ? Number(row.rarity) : null,
        weaponType: weaponType || null,
        imageUrl: imageUrl || null,
      },
    });

    const days = normalizeDay(row.farm_days ?? row.farmDays ?? "");
    if (days.length) {
      await prisma.characterFarmDay.deleteMany({
        where: { characterId: character.id },
      });

      await prisma.characterFarmDay.createMany({
        data: days.map((day) => ({
          characterId: character.id,
          day: day as any,
        })),
      });
    }
  }

  console.log(`Personagens importados: ${rows.length}`);
}

async function importWeapons() {
  const filePath = resolveCsvPath("weapons.csv");
  if (!filePath) {
    console.log(
      "Arquivo weapons.csv não encontrado. Pulando importação de armas.",
    );
    return;
  }

  const rows = parseCsv<WeaponCsvRow>(filePath);

  for (const row of rows) {
    const name = row.name?.trim();
    if (!name) continue;

    const type = row.type || row.weapon_type || row.weaponType;
    const imageUrl = row.image_url || row.imageUrl;

    const weapon = await prisma.weapon.upsert({
      where: { name },
      update: {
        ...(type ? { type } : {}),
        ...(row.rarity ? { rarity: Number(row.rarity) } : {}),
        ...(imageUrl ? { imageUrl } : {}),
      },
      create: {
        name,
        type: type || null,
        rarity: row.rarity ? Number(row.rarity) : null,
        imageUrl: imageUrl || null,
      },
    });

    const days = normalizeDay(row.farm_days ?? row.farmDays ?? "");
    if (days.length) {
      await prisma.weaponFarmDay.deleteMany({
        where: { weaponId: weapon.id },
      });

      await prisma.weaponFarmDay.createMany({
        data: days.map((day) => ({
          weaponId: weapon.id,
          day: day as any,
        })),
      });
    }
  }

  console.log(`Armas importadas: ${rows.length}`);
}

async function main() {
  await importCharacters();
  await importWeapons();
  console.log("Importação concluída.");
}

main()
  .catch((error) => {
    console.error("Erro ao importar dados do jogo:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
