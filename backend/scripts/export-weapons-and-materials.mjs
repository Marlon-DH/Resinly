import { mkdir, writeFile } from "node:fs/promises";

const apiBase = "https://genshin-db-api.vercel.app/api/v5";
const listOptions =
  "query=names&matchCategories=true&verboseCategories=true&queryLanguages=English&resultLanguage=Portuguese";

async function getData(folder) {
  const response = await fetch(`${apiBase}/${folder}?${listOptions}`);
  if (!response.ok)
    throw new Error(`Não foi possível buscar ${folder}: ${response.status}`);
  return response.json();
}

function escapeCsv(value) {
  return `"${String(value ?? "").replaceAll('"', '""')}"`;
}

async function writeCsv(path, columns, rows) {
  await mkdir("data", { recursive: true });
  const contents = [
    columns.join(","),
    ...rows.map((row) =>
      columns.map((column) => escapeCsv(row[column])).join(","),
    ),
  ].join("\n");
  await writeFile(path, `${contents}\n`, "utf8");
}

const dayLabels = {
  "Segunda-feira": "Seg",
  "Terça-feira": "Ter",
  "Quarta-feira": "Qua",
  "Quinta-feira": "Qui",
  "Sexta-feira": "Sex",
  Sábado: "Sáb",
  Domingo: "Dom",
};

const [weaponsSource, materialsSource] = await Promise.all([
  getData("weapons"),
  getData("materials"),
]);

const weapons = weaponsSource.map((weapon) => ({
  name: weapon.name,
  type: weapon.weaponText,
  image_url:
    weapon.images?.image ??
    weapon.images?.mihoyo_icon ??
    weapon.images?.hoyowiki_icon ??
    null,
}));

const upgradeMaterialTypes = [
  "Material de Talento do Personagem",
  "Material de Fortalecimento de Arma e Personagem",
  "Material de Fortalecimento de Arma",
  "Material de Ascensão de Armas",
  "Material de Ascensão de Personagem",
  "Material de Elevação de Personagem",
  "Material de Elevação de Arma e Personagem",
  "Material de EXP de Personagem",
];

const materials = materialsSource
  .filter(
    (material) =>
      upgradeMaterialTypes.some((type) => material.typeText?.includes(type)) ||
      material.typeText?.startsWith("Especialidade de"),
  )
  .map((material) => ({
    name: material.name,
    type: material.typeText,
    location: material.dropDomainName ?? material.sources?.[0] ?? "Teyvat",
    farm_days:
      material.daysOfWeek?.map((day) => dayLabels[day] ?? day).join(", ") ??
      "Todos os dias",
  }));

await writeCsv("data/weapons.csv", ["name", "type", "image_url"], weapons);
await writeCsv(
  "data/materials.csv",
  ["name", "type", "location", "farm_days"],
  materials,
);

const typeSummary = Object.entries(
  Object.groupBy(
    materialsSource,
    (material) => material.typeText ?? "Sem tipo",
  ),
)
  .map(([type, rows]) => `${type}: ${rows.length}`)
  .join("\n");

console.log(
  `${weapons.length} armas e ${materials.length} materiais de evolução exportados.\n\nTipos encontrados:\n${typeSummary}`,
);
