import { mkdir, readFile, writeFile } from "node:fs/promises";
import { createClient } from "@supabase/supabase-js";

const apiBase = "https://genshin-db-api.vercel.app/api/v5";
const options =
  "query=names&matchCategories=true&verboseCategories=true&queryLanguages=English";

function environmentValue(environment, name) {
  return environment.match(new RegExp(`^${name}=(.*)$`, "m"))?.[1]?.trim();
}

async function sourceData(folder, resultLanguage) {
  const response = await fetch(
    `${apiBase}/${folder}?${options}&resultLanguage=${resultLanguage}`,
  );
  if (!response.ok)
    throw new Error(`Não foi possível buscar ${folder}: ${response.status}`);
  return response.json();
}

function materialSourceIdsFromCosts(costs) {
  return Object.values(costs ?? {})
    .flat()
    .map((cost) => cost.id)
    .filter((id) => id !== 202);
}

function uniquePairs(pairs) {
  return [
    ...new Map(pairs.map((pair) => [`${pair[0]}-${pair[1]}`, pair])).values(),
  ];
}

async function writeCsv(path, columns, rows) {
  await mkdir("data", { recursive: true });
  const content = [
    columns.join(","),
    ...rows.map((row) => columns.map((column) => row[column]).join(",")),
  ].join("\n");
  await writeFile(path, `${content}\n`, "utf8");
}

const environment = await readFile(".env.local", "utf8");
const supabase = createClient(
  environmentValue(environment, "VITE_SUPABASE_URL"),
  environmentValue(environment, "VITE_SUPABASE_PUBLISHABLE_KEY"),
);
const [
  charactersResult,
  weaponsResult,
  materialsResult,
  charactersSource,
  talentsSource,
  weaponsSource,
  materialsSource,
] = await Promise.all([
  supabase.from("characters").select("id, name"),
  supabase.from("weapons").select("id, name"),
  supabase.from("materials").select("id, name"),
  sourceData("characters", "English"),
  sourceData("talents", "English"),
  sourceData("weapons", "Portuguese"),
  sourceData("materials", "Portuguese"),
]);

for (const result of [charactersResult, weaponsResult, materialsResult]) {
  if (result.error) throw result.error;
}

const characterIds = new Map(
  charactersResult.data.map((character) => [character.name, character.id]),
);
const weaponIds = new Map(
  weaponsResult.data.map((weapon) => [weapon.name, weapon.id]),
);
const materialIds = new Map(
  materialsResult.data.map((material) => [material.name, material.id]),
);
const materialNames = new Map(
  materialsSource.map((material) => [material.id, material.name]),
);
const talentCosts = new Map(
  talentsSource.map((talent) => [
    talent.name,
    materialSourceIdsFromCosts(talent.costs),
  ]),
);

const characterPairs = uniquePairs(
  charactersSource.flatMap((character) => {
    const characterId = characterIds.get(character.name);
    const sourceMaterialIds = [
      ...materialSourceIdsFromCosts(character.costs),
      ...(talentCosts.get(character.name) ?? []),
    ];
    return characterId
      ? sourceMaterialIds
          .map((sourceId) => [
            characterId,
            materialIds.get(materialNames.get(sourceId)),
          ])
          .filter(([, materialId]) => materialId)
      : [];
  }),
);

const weaponPairs = uniquePairs(
  weaponsSource.flatMap((weapon) => {
    const weaponId = weaponIds.get(weapon.name);
    return weaponId
      ? materialSourceIdsFromCosts(weapon.costs)
          .map((sourceId) => [
            weaponId,
            materialIds.get(materialNames.get(sourceId)),
          ])
          .filter(([, materialId]) => materialId)
      : [];
  }),
);

await writeCsv(
  "data/character_materials.csv",
  ["character_id", "material_id"],
  characterPairs.map(([character_id, material_id]) => ({
    character_id,
    material_id,
  })),
);
await writeCsv(
  "data/weapon_materials.csv",
  ["weapon_id", "material_id"],
  weaponPairs.map(([weapon_id, material_id]) => ({ weapon_id, material_id })),
);

console.log(
  `${characterPairs.length} relações de personagens e ${weaponPairs.length} relações de armas exportadas. Base disponível: ${charactersResult.data.length} personagens, ${weaponsResult.data.length} armas e ${materialsResult.data.length} materiais.`,
);
