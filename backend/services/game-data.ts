import { supabase } from "../lib/supabase";
import type { FarmDay, FarmItem } from "../types/farm";
import type {
  DatabaseCharacter,
  DatabaseMaterial,
  DatabaseWeapon,
} from "../types/game";

type PlanningOptions = {
  characters: DatabaseCharacter[];
  weapons: DatabaseWeapon[];
};

export async function getPlanningOptions(): Promise<PlanningOptions> {
  const [charactersResult, weaponsResult] = await Promise.all([
    supabase
      .from("characters")
      .select("id, name, element, title, weapon_type, image_url, rarity")
      .order("name"),
    supabase
      .from("weapons")
      .select("id, name, type, image_url, rarity")
      .order("name"),
  ]);

  if (charactersResult.error) throw charactersResult.error;
  if (weaponsResult.error) throw weaponsResult.error;

  return {
    characters: charactersResult.data,
    weapons: weaponsResult.data,
  };
}

type MaterialRelation = {
  material: DatabaseMaterial | DatabaseMaterial[] | null;
};

const allDays: FarmDay[] = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"];
const validDays = new Set<FarmDay>(allDays);

function materialToFarmItem(material: DatabaseMaterial): FarmItem {
  const days =
    material.farm_days === "Todos os dias"
      ? allDays
      : material.farm_days
          .split(",")
          .map((day) => day.trim())
          .filter((day): day is FarmDay => validDays.has(day as FarmDay));

  if (material.type.includes("Talento"))
    return { name: material.name, days, kind: "Talento", icon: "📚" };
  if (material.type.includes("Arma"))
    return { name: material.name, days, kind: "Arma", icon: "⚔" };
  if (material.location.toLowerCase().includes("semanal"))
    return { name: material.name, days, kind: "Chefe semanal", icon: "♜" };
  return { name: material.name, days, kind: "Inimigo", icon: "✦" };
}

export async function getPlanningMaterials(
  characterId: number,
  weaponId: number,
): Promise<FarmItem[]> {
  const [characterResult, weaponResult] = await Promise.all([
    supabase
      .from("character_materials")
      .select("material:materials(id, name, type, location, farm_days)")
      .eq("character_id", characterId),
    supabase
      .from("weapon_materials")
      .select("material:materials(id, name, type, location, farm_days)")
      .eq("weapon_id", weaponId),
  ]);

  if (characterResult.error) throw characterResult.error;
  if (weaponResult.error) throw weaponResult.error;

  const materials = [
    ...(characterResult.data as MaterialRelation[]),
    ...(weaponResult.data as MaterialRelation[]),
  ]
    .map((relation) => relation.material)
    .filter((material): material is DatabaseMaterial => material !== null);

  return [
    ...new Map(
      materials.map((material) => [material.id, materialToFarmItem(material)]),
    ).values(),
  ];
}
// ...existing code...

export async function getCharactersWithMaterials() {
  const { data, error } = await supabase
    .from("characters")
    .select(
      `
      id,
      name,
      element,
      title,
      weapon_type,
      image_url,
      character_materials (
        material:materials (
          id,
          name,
          type,
          location,
          farm_days
        )
      )
    `,
    )
    .order("name");

  if (error) throw error;

  return data ?? [];
}

export async function getWeaponsWithMaterials() {
  const { data, error } = await supabase
    .from("weapons")
    .select(
      `
      id,
      name,
      type,
      image_url,
      weapon_materials (
        material:materials (
          id,
          name,
          type,
          location,
          farm_days
        )
      )
    `,
    )
    .order("name");

  if (error) throw error;

  return data ?? [];
}
