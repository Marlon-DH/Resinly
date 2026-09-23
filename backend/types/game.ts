export type DatabaseCharacter = {
  id: number;
  name: string;
  element: string;
  title: string;
  weapon_type: string | null;
  image_url: string | null;
  rarity?: number | string | null;
};

export type DatabaseWeapon = {
  id: number;
  name: string;
  type: string;
  image_url: string | null;
  rarity?: number | string | null;
};

export type DatabaseMaterial = {
  id: number;
  name: string;
  type: string;
  location: string;
  farm_days: string;
};
