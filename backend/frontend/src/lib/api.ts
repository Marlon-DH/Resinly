export type Character = {
  id: string;
  name: string;
  element: string | null;
  rarity: number | null;
  imageUrl: string | null;
  userId: string;
  createdAt: string;
  updatedAt: string;
};

export type Weapon = {
  id: string;
  name: string;
  type: string | null;
  rarity: number | null;
  imageUrl: string | null;
  userId: string;
  createdAt: string;
  updatedAt: string;
};

export type Build = {
  id: string;
  title: string;
  notes: string | null;
  priority: number;
  createdAt: string;
  updatedAt: string;
  userId: string;
  characterId: string | null;
  weaponId: string | null;
  character?: Character | null;
  weapon?: Weapon | null;
};

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3000";

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(options?.headers ?? {}),
    },
    ...options,
  });

  if (!response.ok) {
    let message = "Erro ao comunicar com a API.";

    try {
      const data = (await response.json()) as { message?: string };
      if (data?.message) {
        message = data.message;
      }
    } catch {
      // ignora erro de parse
    }

    throw new Error(message);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}

export const api = {
  getCharacters: () => request<Character[]>("/characters"),
  createCharacter: (data: {
    name: string;
    element?: string;
    rarity?: number;
    imageUrl?: string;
  }) =>
    request<Character>("/characters", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  deleteCharacter: (id: string) =>
    request<void>(`/characters/${id}`, { method: "DELETE" }),

  getWeapons: () => request<Weapon[]>("/weapons"),
  createWeapon: (data: {
    name: string;
    type?: string;
    rarity?: number;
    imageUrl?: string;
  }) =>
    request<Weapon>("/weapons", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  deleteWeapon: (id: string) =>
    request<void>(`/weapons/${id}`, { method: "DELETE" }),

  getBuilds: () => request<Build[]>("/builds"),
  createBuild: (data: {
    title: string;
    notes?: string;
    priority?: number;
    characterId?: string | null;
    weaponId?: string | null;
  }) =>
    request<Build>("/builds", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  deleteBuild: (id: string) =>
    request<void>(`/builds/${id}`, { method: "DELETE" }),
};
