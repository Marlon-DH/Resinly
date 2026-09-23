import { useEffect, useMemo, useState } from "react";
import type { User } from "@supabase/supabase-js";
import Agenda from "../components/Agenda";
import LeftBar from "../components/LeftBar";
import { supabase } from "../lib/supabase";
import {
  getPlanningMaterials,
  getPlanningOptions,
} from "../services/game-data";
import type { FarmItem } from "../types/farm";
import type { DatabaseCharacter, DatabaseWeapon } from "../types/game";
import { getCharacterImageUrl } from "../utils/caracterImages";

type HomeProps = {
  onNavigate: (page: "agenda" | "characters" | "weapons") => void;
};

type SavedPlan = {
  id: string;
  characterId: number;
  weaponId: number;
  character: string;
  weapon: string;
};

const getStarValue = (value: number | string | null | undefined): number => {
  if (typeof value === "number") return value;
  if (typeof value === "string") {
    const normalized = value.replace(/[^\d]/g, "");
    return normalized ? Number(normalized) : 0;
  }
  return 0;
};

function Home({ onNavigate }: HomeProps) {
  const [characters, setCharacters] = useState<DatabaseCharacter[]>([]);
  const [weapons, setWeapons] = useState<DatabaseWeapon[]>([]);
  const [selectedCharacterId, setSelectedCharacterId] = useState("");
  const [selectedWeaponId, setSelectedWeaponId] = useState("");
  const [savedPlans, setSavedPlans] = useState<SavedPlan[]>([]);
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [characterSearch, setCharacterSearch] = useState("");
  const [characterStarFilter, setCharacterStarFilter] = useState<
    "all" | "4" | "5"
  >("all");
  const [weaponSearch, setWeaponSearch] = useState("");
  const [weaponStarFilter, setWeaponStarFilter] = useState<
    "all" | "1" | "2" | "3" | "4" | "5"
  >("all");
  const [agendaItems, setAgendaItems] = useState<FarmItem[]>([]);

  useEffect(() => {
    async function loadPlanningOptions() {
      try {
        const options = await getPlanningOptions();
        setCharacters(options.characters);
        setWeapons(options.weapons);
        setSelectedCharacterId(String(options.characters[0]?.id ?? ""));
        const firstWeapon = options.weapons[0];
        setSelectedWeaponId(String(firstWeapon?.id ?? ""));
      } catch {
        setError(
          "Não foi possível carregar personagens e armas do banco de dados.",
        );
      } finally {
        setIsLoading(false);
      }
    }

    void loadPlanningOptions();
  }, []);

  useEffect(() => {
    async function hydrateSession() {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setUser(session?.user ?? null);

      if (session?.user) {
        const { data } = await supabase
          .from("user_plans")
          .select("id, user_id, character_id, weapon_id, created_at")
          .eq("user_id", session.user.id)
          .order("created_at", { ascending: false });

        const mappedPlans = (data ?? []).map((plan) => {
          const character = characters.find(
            (personagem) => personagem.id === plan.character_id,
          );
          const weapon = weapons.find((item) => item.id === plan.weapon_id);

          return {
            id: String(plan.id),
            characterId: plan.character_id,
            weaponId: plan.weapon_id,
            character: character?.name ?? "Personagem",
            weapon: weapon?.name ?? "Arma",
          } satisfies SavedPlan;
        });

        setSavedPlans(mappedPlans);
      }
    }

    void hydrateSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setUser(session?.user ?? null);

      if (!session?.user) {
        setSavedPlans([]);
        return;
      }

      const { data } = await supabase
        .from("user_plans")
        .select("id, user_id, character_id, weapon_id, created_at")
        .eq("user_id", session.user.id)
        .order("created_at", { ascending: false });

      const mappedPlans = (data ?? []).map((plan) => {
        const character = characters.find(
          (personagem) => personagem.id === plan.character_id,
        );
        const weapon = weapons.find((item) => item.id === plan.weapon_id);

        return {
          id: String(plan.id),
          characterId: plan.character_id,
          weaponId: plan.weapon_id,
          character: character?.name ?? "Personagem",
          weapon: weapon?.name ?? "Arma",
        } satisfies SavedPlan;
      });

      setSavedPlans(mappedPlans);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [characters, weapons]);

  const activeCharacter = characters.find(
    (character) => character.id === Number(selectedCharacterId),
  );
  const activeWeapon = weapons.find(
    (weapon) => weapon.id === Number(selectedWeaponId),
  );

  useEffect(() => {
    if (!selectedCharacterId || !selectedWeaponId) {
      setAgendaItems([]);
      return;
    }

    let isCancelled = false;

    async function loadAgendaMaterials() {
      try {
        const items = await getPlanningMaterials(
          Number(selectedCharacterId),
          Number(selectedWeaponId),
        );

        if (!isCancelled) {
          setAgendaItems(items);
        }
      } catch {
        if (!isCancelled) {
          setAgendaItems([]);
          setError(
            "Não foi possível carregar os materiais do farm selecionado.",
          );
        }
      }
    }

    void loadAgendaMaterials();

    return () => {
      isCancelled = true;
    };
  }, [selectedCharacterId, selectedWeaponId]);

  useEffect(() => {
    if (!activeCharacter) {
      setSelectedWeaponId("");
      return;
    }

    const compatibleWeapons = weapons.filter(
      (weapon) => weapon.type === activeCharacter.weapon_type,
    );

    if (!compatibleWeapons.length) {
      setSelectedWeaponId("");
      return;
    }

    const currentSelectionIsCompatible = compatibleWeapons.some(
      (weapon) => String(weapon.id) === selectedWeaponId,
    );

    if (!currentSelectionIsCompatible) {
      setSelectedWeaponId(String(compatibleWeapons[0].id));
    }
  }, [activeCharacter, weapons, selectedWeaponId]);

  const filteredCharacters = useMemo(() => {
    return characters.filter((character) => {
      const matchesSearch =
        `${character.name} ${character.element} ${character.weapon_type ?? ""}`
          .toLowerCase()
          .includes(characterSearch.toLowerCase());
      const rarity = getStarValue(character.rarity);
      const matchesRarity =
        characterStarFilter === "all" || String(rarity) === characterStarFilter;

      return matchesSearch && matchesRarity;
    });
  }, [characterSearch, characterStarFilter, characters]);

  const compatibleWeapons = useMemo(() => {
    const baseWeapons = activeCharacter
      ? weapons.filter((weapon) => weapon.type === activeCharacter.weapon_type)
      : weapons;

    return baseWeapons.filter((weapon) => {
      const matchesSearch = `${weapon.name} ${weapon.type}`
        .toLowerCase()
        .includes(weaponSearch.toLowerCase());
      const rarity = getStarValue(weapon.rarity);
      const matchesRarity =
        weaponStarFilter === "all" || String(rarity) === weaponStarFilter;

      return matchesSearch && matchesRarity;
    });
  }, [activeCharacter, weaponSearch, weaponStarFilter, weapons]);

  async function addToAgenda() {
    if (!activeCharacter || !activeWeapon) return;

    const planKey = `${activeCharacter.id}-${activeWeapon.id}`;
    const exists = savedPlans.some((plan) => plan.id === planKey);

    if (user) {
      const { error: insertError } = await supabase.from("user_plans").insert({
        user_id: user.id,
        character_id: activeCharacter.id,
        weapon_id: activeWeapon.id,
      });

      if (insertError) {
        setError("Não foi possível salvar este planejamento no banco.");
        return;
      }
    }

    if (!exists) {
      const nextPlan: SavedPlan = {
        id: planKey,
        characterId: activeCharacter.id,
        weaponId: activeWeapon.id,
        character: activeCharacter.name,
        weapon: activeWeapon.name,
      };

      setSavedPlans((plans) => [nextPlan, ...plans]);
      setSelectedPlanId(planKey);
    } else {
      setSelectedPlanId(planKey);
    }

    setNotice(
      exists
        ? "Este planejamento já está salvo e foi ativado na agenda."
        : user
          ? "Planejamento salvo na sua conta."
          : "Planejamento salvo e ativado na agenda.",
    );
    window.setTimeout(() => setNotice(""), 3200);
  }

  async function handleGoogleLogin() {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: window.location.origin,
      },
    });

    if (error) {
      setError("Não foi possível entrar com o Google.");
    }
  }

  async function handleLogout() {
    const { error } = await supabase.auth.signOut();

    if (error) {
      setError("Não foi possível sair da conta.");
      return;
    }

    setUser(null);
    setSavedPlans([]);
    setSelectedPlanId(null);
  }

  function selectSavedPlan(plan: SavedPlan) {
    setSelectedPlanId(plan.id);
    setSelectedCharacterId(String(plan.characterId));
    setSelectedWeaponId(String(plan.weaponId));
  }

  return (
    <div className="app-shell">
      <LeftBar
        section="agenda"
        onSectionChange={onNavigate}
        userName={user?.email?.split("@")[0] ?? undefined}
        onGoogleLogin={handleGoogleLogin}
        onLogout={handleLogout}
      />
      <main className="content">
        <header className="topbar">
          <div>
            <p className="eyebrow">PLANEJAMENTO DE FARM</p>
            <h1>Minha agenda</h1>
          </div>
          <button className="profile">D</button>
        </header>

        <section className="intro">
          <div>
            <h2>
              Bom dia, Viajante! <span>✦</span>
            </h2>
            <p>Organize sua resina e não perca mais nenhum dia de domínio.</p>
          </div>

          <div className="resin">
            <span className="resin-orb">◉</span>
            <div>
              <small>RESINA ORIGINAL</small>
              <b>
                200 <em>/ 200</em>
              </b>
            </div>
            <button>+</button>
          </div>
        </section>

        {!user && (
          <section className="auth-card">
            <div>
              <p className="eyebrow">CONTA</p>
              <h2>Entre para salvar sua agenda</h2>
            </div>
            <button
              type="button"
              className="google-login"
              onClick={handleGoogleLogin}
            >
              Entrar com Google
            </button>
            <p className="auth-note">
              O login com Hoyoverse exige uma integração custom via OAuth/oidc
              no Supabase, fora do provedor padrão do Google. Para começar, o
              Google é o caminho mais simples e seguro.
            </p>
          </section>
        )}

        <section className="planner-card">
          <div className="planner-head">
            <div>
              <p className="eyebrow">NOVO PLANEJAMENTO</p>
              <h2>O que você quer farmar?</h2>
            </div>
            <span className="step">1 de 2</span>
          </div>

          {error && <p className="notice">{error}</p>}

          <div className="filter-grid">
            <div className="selector-group">
              <label htmlFor="character-search">PERSONAGEM</label>
              <input
                id="character-search"
                className="planner-input"
                value={characterSearch}
                onChange={(event) => setCharacterSearch(event.target.value)}
                placeholder="Buscar personagem"
              />
            </div>

            <div className="selector-group">
              <label htmlFor="character-stars">RARIDADE</label>
              <select
                id="character-stars"
                className="planner-select"
                value={characterStarFilter}
                onChange={(event) =>
                  setCharacterStarFilter(
                    event.target.value as "all" | "4" | "5",
                  )
                }
              >
                <option value="all">Todos</option>
                <option value="4">4 estrelas</option>
                <option value="5">5 estrelas</option>
              </select>
            </div>

            <div className="selector-group">
              <label htmlFor="weapon-search">ARMA</label>
              <input
                id="weapon-search"
                className="planner-input"
                value={weaponSearch}
                onChange={(event) => setWeaponSearch(event.target.value)}
                placeholder="Buscar arma"
              />
            </div>

            <div className="selector-group">
              <label htmlFor="weapon-stars">ESTRELAS</label>
              <select
                id="weapon-stars"
                className="planner-select"
                value={weaponStarFilter}
                onChange={(event) =>
                  setWeaponStarFilter(
                    event.target.value as "all" | "1" | "2" | "3" | "4" | "5",
                  )
                }
              >
                <option value="all">Todas</option>
                <option value="1">1 estrela</option>
                <option value="2">2 estrelas</option>
                <option value="3">3 estrelas</option>
                <option value="4">4 estrelas</option>
                <option value="5">5 estrelas</option>
              </select>
            </div>
          </div>

          <div className="selectors">
            <label>
              PERSONAGEM
              <select
                value={selectedCharacterId}
                disabled={isLoading}
                onChange={(event) => setSelectedCharacterId(event.target.value)}
              >
                <option value="">
                  {isLoading
                    ? "Carregando personagens..."
                    : "Selecione um personagem"}
                </option>
                {filteredCharacters.map((character) => (
                  <option key={character.id} value={character.id}>
                    {character.name}
                  </option>
                ))}
              </select>
            </label>

            <label>
              ARMA
              <select
                value={selectedWeaponId}
                disabled={isLoading || !activeCharacter}
                onChange={(event) => setSelectedWeaponId(event.target.value)}
              >
                <option value="">
                  {activeCharacter
                    ? "Selecione uma arma"
                    : "Escolha primeiro um personagem"}
                </option>
                {compatibleWeapons.map((weapon) => (
                  <option key={weapon.id} value={weapon.id}>
                    {weapon.name}
                  </option>
                ))}
              </select>
            </label>

            <button
              className="add-button"
              disabled={!activeCharacter || !activeWeapon}
              onClick={addToAgenda}
            >
              <span>+</span> Adicionar à agenda
            </button>
          </div>

          {notice && <p className="notice">✓ {notice}</p>}

          <div className="selection-preview">
            <div className="char-card">
              <div className="portrait pyro">
                {activeCharacter?.image_url ? (
                  <img
                    src={getCharacterImageUrl(
                      activeCharacter.image_url,
                      activeCharacter.name,
                    )}
                    alt={activeCharacter.name}
                    onError={(event) => {
                      event.currentTarget.src =
                        "https://placehold.co/160x160/f1edf8/8b8495?text=Sem+imagem";
                    }}
                  />
                ) : (
                  "♟"
                )}
              </div>
              <div>
                <b>{activeCharacter?.name ?? "Nenhum personagem"}</b>
                <small>
                  {activeCharacter
                    ? `${activeCharacter.element} · ${activeCharacter.title}`
                    : "Selecione um personagem"}
                </small>
              </div>
            </div>

            <span className="plus">+</span>

            <div className="char-card">
              <div className="portrait gold">
                {activeWeapon?.image_url ? (
                  <img
                    src={getCharacterImageUrl(
                      activeWeapon.image_url,
                      activeWeapon.name,
                    )}
                    alt={activeWeapon.name}
                    onError={(event) => {
                      event.currentTarget.src =
                        "https://placehold.co/160x160/f1edf8/8b8495?text=Sem+imagem";
                    }}
                  />
                ) : (
                  "⚔"
                )}
              </div>
              <div>
                <b>{activeWeapon?.name ?? "Nenhuma arma"}</b>
                <small>
                  {activeWeapon?.type ?? "Selecione uma arma compatível"}
                </small>
              </div>
            </div>

            <div className="auto-tag">✦ Dados carregados do Supabase</div>
          </div>
        </section>

        <Agenda items={agendaItems} />

        <section className="saved-section">
          <div>
            <p className="eyebrow">EM ANDAMENTO</p>
            <h2>Seus planejamentos</h2>
          </div>

          <div className="saved-list">
            {savedPlans.length ? (
              savedPlans.map((plan) => (
                <button
                  type="button"
                  className={`saved-item ${selectedPlanId === plan.id ? "selected" : ""}`}
                  key={plan.id}
                  onClick={() => selectSavedPlan(plan)}
                >
                  <span className="saved-spark">✦</span>
                  <div>
                    <b>{plan.character}</b>
                    <small>com {plan.weapon}</small>
                  </div>
                  <span className="status">
                    {selectedPlanId === plan.id ? "ATIVO" : "SELECIONAR"}
                  </span>
                </button>
              ))
            ) : (
              <p className="empty-plan-text">
                Escolha um personagem e uma arma para começar.
              </p>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}

export default Home;
