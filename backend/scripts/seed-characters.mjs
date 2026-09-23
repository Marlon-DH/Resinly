import { mkdir, readFile, writeFile } from "node:fs/promises";
import { createClient } from "@supabase/supabase-js";

const sourceUrl =
  "https://genshin-db-api.vercel.app/api/v5/characters?query=names&matchCategories=true&verboseCategories=true";

function getEnvironmentValue(file, name) {
  const match = file.match(new RegExp(`^${name}=(.*)$`, "m"));
  return match?.[1]?.trim();
}

const environment = await readFile(".env.local", "utf8");
const supabaseUrl = getEnvironmentValue(environment, "VITE_SUPABASE_URL");
const publishableKey = getEnvironmentValue(
  environment,
  "VITE_SUPABASE_PUBLISHABLE_KEY",
);

if (!supabaseUrl || !publishableKey) {
  throw new Error(
    "VITE_SUPABASE_URL e VITE_SUPABASE_PUBLISHABLE_KEY são obrigatórios em .env.local.",
  );
}

const response = await fetch(sourceUrl);
if (!response.ok)
  throw new Error(
    `A fonte de personagens respondeu com erro ${response.status}.`,
  );

const sourceCharacters = await response.json();
const characters = sourceCharacters.map((character) => ({
  name: character.name,
  element:
    character.elementText === "None" ? "Viajante" : character.elementText,
  title: character.title || "Viajante de outro mundo",
  image_url:
    character.images?.image ??
    character.images?.mihoyo_icon ??
    character.images?.hoyowiki_icon ??
    null,
}));

const csvHeader = "name,element,title,image_url";
const escapeCsv = (value) => `"${String(value ?? "").replaceAll('"', '""')}"`;
const csvRows = characters.map((character) =>
  Object.values(character).map(escapeCsv).join(","),
);
await mkdir("data", { recursive: true });
await writeFile(
  "data/characters.csv",
  `${csvHeader}\n${csvRows.join("\n")}\n`,
  "utf8",
);

const supabase = createClient(supabaseUrl, publishableKey);
const { data: existingRows, error: readError } = await supabase
  .from("characters")
  .select("name");
if (readError) throw readError;

const existingNames = new Set(existingRows.map((character) => character.name));
const missingCharacters = characters.filter(
  (character) => !existingNames.has(character.name),
);

if (missingCharacters.length === 0) {
  console.log(
    `Nenhum personagem novo: ${characters.length} registros da fonte já existem no banco.`,
  );
  process.exit(0);
}

const { error: insertError } = await supabase
  .from("characters")
  .insert(missingCharacters);
if (insertError) throw insertError;

console.log(
  `${missingCharacters.length} personagens inseridos. Total pesquisado: ${characters.length}.`,
);
