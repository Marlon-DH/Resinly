import { useEffect, useState } from "react";
import NavBar from "../components/NavBar";
import { api, type Character, type Weapon } from "../lib/api";
import {
  getCharacterImageUrl,
  getWeaponImageUrl,
} from "../utils/caracterImages";

type Page = "home" | "agenda" | "characters" | "weapons" | "login";

type FeaturedCharacter = {
  id: string | number;
  name: string;
  element: string;
  title: string;
  imageUrl: string;
  weapon_type: string;
  rarity: number;
};

type CharacterData = Character & {
  title?: string | null;
  image_Url?: string | null;
  weapon_type?: string | null;
  weaponType?: string | null;
};

type FeaturedWeapon = {
  id: string | number;
  name: string;
  type: string;
  imageUrl: string;
  rarity: number;
};

type WeaponData = Weapon & {
  image_Url?: string | null;
};

const CORES_ELEMENTOS: Record<
  string,
  { fundo: string; border: string; texto: string }
> = {
  Pyro: {
    fundo: "from-[#3d1a1a] via-[#1a0f0f]",
    border: "hover:border-red-500/40",
    texto: "text-red-400",
  },
  Hydro: {
    fundo: "from-[#1a2e3d] via-[#0f141a]",
    border: "hover:border-blue-500/40",
    texto: "text-blue-400",
  },
  Electro: {
    fundo: "from-[#2d1a3d] via-[#120f1a]",
    border: "hover:border-purple-500/40",
    texto: "text-purple-400",
  },
  Cryo: {
    fundo: "from-[#1a383d] via-[#0f191a]",
    border: "hover:border-cyan-400/40",
    texto: "text-cyan-300",
  },
  Anemo: {
    fundo: "from-[#1a3d2b] via-[#0f1a14]",
    border: "hover:border-teal-400/40",
    texto: "text-teal-400",
  },
  Geo: {
    fundo: "from-[#3d331a] via-[#1a170f]",
    border: "hover:border-amber-500/40",
    texto: "text-amber-400",
  },
  Dendro: {
    fundo: "from-[#1d3d1a] via-[#0f1a0f]",
    border: "hover:border-green-500/40",
    texto: "text-green-400",
  },
  Viajante: {
    fundo: "from-[#2d3238] via-[#10141a]",
    border: "hover:border-slate-400/40",
    texto: "text-slate-300",
  },
};

const CORES_RARIDADE: Record<
  number,
  { fundo: string; border: string; tag: string }
> = {
  5: {
    fundo: "from-[#4a3b1a] via-[#1a160f]",
    border: "hover:border-amber-400/40",
    tag: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  },
  4: {
    fundo: "from-[#2d1a3d] via-[#120f1a]",
    border: "hover:border-purple-400/40",
    tag: "bg-purple-500/10 text-purple-400 border-purple-500/20",
  },
  3: {
    fundo: "from-[#1a2a3d] via-[#0f141a]",
    border: "hover:border-blue-400/40",
    tag: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  },
  1: {
    fundo: "from-[#252a30] via-[#10141a]",
    border: "hover:border-slate-500/40",
    tag: "bg-slate-500/10 text-slate-400 border-slate-500/20",
  },
};

const personagensBD: FeaturedCharacter[] = [
  {
    id: 3,
    name: "Aether",
    element: "Viajante",
    title: "Viajante de outro mundo",
    imageUrl: "https://enka.network/ui/UI_AvatarIcon_PlayerBoy.png",
    weapon_type: "Espada",
    rarity: 5,
  },
  {
    id: 5,
    name: "Albedo",
    element: "Geo",
    title: "Kreideprinz",
    imageUrl:
      "https://upload-os-bbs.mihoyo.com/game_record/genshin/character_icon/UI_AvatarIcon_Albedo.png",
    weapon_type: "Espada",
    rarity: 5,
  },
  {
    id: 11,
    name: "Arlecchino",
    element: "Pyro",
    title: "Dire Balemoon",
    imageUrl:
      "https://upload-os-bbs.mihoyo.com/game_record/genshin/character_icon/UI_AvatarIcon_Arlecchino.png",
    weapon_type: "Lança",
    rarity: 5,
  },
  {
    id: 23,
    name: "Clorinde",
    element: "Electro",
    title: "Candlebearer, Shadowhunter",
    imageUrl:
      "https://upload-os-bbs.mihoyo.com/game_record/genshin/character_icon/UI_AvatarIcon_Clorinde.png",
    weapon_type: "Espada",
    rarity: 5,
  },
  {
    id: 44,
    name: "Hu Tao",
    element: "Pyro",
    title: "Fragrance in Thaw",
    imageUrl:
      "https://upload-os-bbs.mihoyo.com/game_record/genshin/character_icon/UI_AvatarIcon_Hutao.png",
    weapon_type: "Lança",
    rarity: 5,
  },
];

const armasBD: FeaturedWeapon[] = [
  {
    id: 1,
    name: "Absolvição",
    type: "Espada",
    imageUrl:
      "https://upload-os-bbs.mihoyo.com/game_record/genshin/equip/UI_EquipIcon_Sword_Estoc.png",
    rarity: 5,
  },
  {
    id: 2,
    name: "Akuoumaru",
    type: "Espadão",
    imageUrl:
      "https://upload-os-bbs.mihoyo.com/game_record/genshin/equip/UI_EquipIcon_Claymore_Maria.png",
    rarity: 4,
  },
  {
    id: 5,
    name: "Arco de Amos",
    type: "Arco",
    imageUrl:
      "https://upload-os-bbs.mihoyo.com/game_record/genshin/equip/UI_EquipIcon_Bow_Amos.png",
    rarity: 5,
  },
  {
    id: 43,
    name: "Semblante da Lua Carmesim",
    type: "Lança",
    imageUrl:
      "https://upload-os-bbs.mihoyo.com/game_record/genshin/equip/UI_EquipIcon_Pole_Stardust.png",
    rarity: 5,
  },
];

export default function Home({
  onNavigate,
}: {
  onNavigate: (p: Page) => void;
}) {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [weapons, setWeapons] = useState<Weapon[]>([]);
  const [indexChar, setIndexChar] = useState(0);
  const [indexWeapon, setIndexWeapon] = useState(0);

  useEffect(() => {
    let ativo = true;

    Promise.allSettled([api.getCharacters(), api.getWeapons()])
      .then(([charactersResult, weaponsResult]) => {
        if (!ativo) return;

        if (charactersResult.status === "fulfilled") {
          setCharacters(charactersResult.value);
        }

        if (weaponsResult.status === "fulfilled") {
          setWeapons(weaponsResult.value);
        }
      })
      .catch(() => {
        // fallback silencioso para os dados estáticos abaixo
      });

    return () => {
      ativo = false;
    };
  }, []);

  useEffect(() => {
    const intervaloPersonagens = setInterval(() => {
      setIndexChar(
        (atual) =>
          (atual + 1) % Math.max(personagensBD.length, characters.length || 1),
      );
    }, 3500);

    const intervaloArmas = setInterval(() => {
      setIndexWeapon(
        (atual) => (atual + 1) % Math.max(armasBD.length, weapons.length || 1),
      );
    }, 4000);

    return () => {
      clearInterval(intervaloPersonagens);
      clearInterval(intervaloArmas);
    };
  }, [characters.length, weapons.length]);

  const charSource = (characters[indexChar % Math.max(characters.length, 1)] ??
    personagensBD[indexChar % personagensBD.length]) as CharacterData;
  const weaponSource = (weapons[indexWeapon % Math.max(weapons.length, 1)] ??
    armasBD[indexWeapon % armasBD.length]) as WeaponData;

  const char = {
    ...charSource,
    element: charSource.element ?? "Viajante",
    title: charSource.title ?? "Viajante de outro mundo",
    weapon_type: charSource.weapon_type ?? charSource.weaponType ?? "Espada",
    imageUrl: charSource.imageUrl ?? charSource.image_Url ?? "",
  } as FeaturedCharacter;

  const weaponItem = {
    ...weaponSource,
    type: weaponSource.type ?? "Lança",
    imageUrl: weaponSource.imageUrl ?? weaponSource.image_Url ?? "",
  } as FeaturedWeapon;

  const charImage = getCharacterImageUrl(char.imageUrl || null, char.name);
  const weaponImage = getWeaponImageUrl(
    weaponItem.imageUrl || null,
    weaponItem.name,
  );

  const temaChar = CORES_ELEMENTOS[char.element] || CORES_ELEMENTOS["Viajante"];
  const temaWeapon = CORES_RARIDADE[weaponItem.rarity] || CORES_RARIDADE[5];

  return (
    <div className="min-h-screen bg-[#0b0e13] text-[#edf3ff]">
      <NavBar onNavigate={onNavigate} />

      <main className="flex justify-center px-4 pb-12 pt-[120px] sm:px-6">
        <section className="grid w-full max-w-[1100px] gap-5 lg:grid-cols-[2fr_1fr]">
          <article className="min-h-[380px] lg:min-h-[420px] rounded-[20px] border border-white/10 bg-[#10141a]/80 p-6 flex flex-col justify-between">
            <div>
              <h1 className="text-2xl font-semibold">Bem-vindo ao Resinly</h1>
              <p className="text-sm text-[#b5c2d5] mt-2">
                Seu banco de dados interativo e gerenciador essencial de Genshin
                Impact.
              </p>
            </div>
          </article>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-1">
            <article
              className={`group relative h-[180px] lg:h-[200px] overflow-hidden rounded-[20px] border border-white/10 bg-gradient-to-br ${temaChar.fundo} transition-all duration-500 ${temaChar.border}`}
            >
              <div className="absolute -right-3 -bottom-5 z-0 h-40 w-40 lg:h-44 lg:w-44 rounded-full border border-white/10 bg-[#0f1419]/40 shadow-[0_0_30px_rgba(0,0,0,0.3)]">
                <img
                  src={charImage}
                  alt={char.name}
                  className="h-full w-full rounded-full object-cover object-center"
                  onError={(event) => {
                    event.currentTarget.src = getCharacterImageUrl(
                      null,
                      char.name,
                    );
                  }}
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-[#0b0e13]/90 via-[#10141a]/40 to-transparent z-0" />
              <div className="relative z-10 flex h-full flex-col justify-between p-5">
                <div className="flex items-center gap-2">
                  <span className="rounded-full bg-white/5 px-2.5 py-0.5 text-[0.62rem] font-bold uppercase tracking-[0.14em] border border-white/10 backdrop-blur-sm">
                    Personagens
                  </span>
                  <span
                    className={`text-[0.65rem] font-black uppercase tracking-wider ${temaChar.texto}`}
                  >
                    {char.element}
                  </span>
                </div>
                <div className="max-w-[65%]">
                  <h2 className="text-xl font-bold tracking-wide text-[#edf3ff]">
                    {char.name}
                  </h2>
                  <p className="mt-0.5 text-xs text-[#b5c2d5] line-clamp-1 italic">
                    {char.title}
                  </p>
                  <p className="mt-2 text-[0.68rem] font-medium tracking-wide uppercase text-white/40">
                    Tipo: {char.weapon_type}
                  </p>
                </div>
              </div>
            </article>

            <article
              className={`group relative h-[180px] lg:h-[200px] overflow-hidden rounded-[20px] border border-white/10 bg-gradient-to-br ${temaWeapon.fundo} transition-all duration-500 ${temaWeapon.border}`}
            >
              <div className="absolute -right-2 -bottom-2 z-0 h-36 w-36 lg:h-40 lg:w-40 rounded-full border border-white/10 bg-[#0f1419]/40 shadow-[0_0_25px_rgba(0,0,0,0.25)]">
                <img
                  src={weaponImage}
                  alt={weaponItem.name}
                  className="h-full w-full rounded-full object-cover object-center"
                  onError={(event) => {
                    event.currentTarget.src = getWeaponImageUrl(
                      null,
                      weaponItem.name,
                    );
                  }}
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-[#0b0e13]/90 via-[#10141a]/40 to-transparent z-0" />
              <div className="relative z-10 flex h-full flex-col justify-between p-5">
                <div className="flex items-center gap-2">
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-[0.62rem] font-bold uppercase tracking-[0.14em] border backdrop-blur-sm ${temaWeapon.tag}`}
                  >
                    Armas
                  </span>
                </div>
                <div className="max-w-[65%]">
                  <h2 className="text-xl font-bold tracking-wide text-[#edf3ff]">
                    {weaponItem.name}
                  </h2>
                  <p className="mt-1 text-xs text-[#b5c2d5]">Classe Lendária</p>
                  <p className="mt-2 text-[0.68rem] font-medium tracking-wide uppercase text-white/40">
                    Classe: {weaponItem.type}
                  </p>
                </div>
              </div>
            </article>
          </div>
        </section>
      </main>
    </div>
  );
}
