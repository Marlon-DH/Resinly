// Serviço de dados (stubs) usado pelos componentes — não altera layout

const sampleMaterials = [
  { id: 1, name: "Material A", farm_days: "Seg, Qua" },
  { id: 2, name: "Material B", farm_days: "Ter" },
];

const sampleWeapons = [
  {
    id: 1,
    name: "Lâmina Exemplar",
    image_url: null,
    type: "Espada",
    rarity: 4,
    weapon_materials: [
      { material: sampleMaterials[0] },
      { material: [sampleMaterials[1]] },
    ],
  },
];

const sampleCharacters = [
  {
    id: 1,
    name: "Viajante",
    image_url: null,
    element: "Anemo",
    weapon_type: "Espada",
    rarity: 5,
    character_materials: [{ material: sampleMaterials[0] }],
  },
];

export async function getWeaponsWithMaterials(): Promise<any[]> {
  return Promise.resolve(sampleWeapons);
}

export async function getCharactersWithMaterials(): Promise<any[]> {
  return Promise.resolve(sampleCharacters);
}

export async function getPlanningOptions(): Promise<{
  characters: any[];
  weapons: any[];
}> {
  return Promise.resolve({
    characters: sampleCharacters,
    weapons: sampleWeapons,
  });
}

export async function getPlanningMaterials(
  _characterId: number,
  _weaponId: number,
): Promise<any[]> {
  const items = [
    { name: "Material A", kind: "Talento", icon: "★", days: ["Seg", "Qua"] },
    { name: "Material B", kind: "Arma", icon: "✦", days: ["Ter"] },
  ];

  return Promise.resolve(items);
}
