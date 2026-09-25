import { useEffect, useState } from "react";
import NavBar from "../components/NavBar";
import { api, type Weapon } from "../lib/api";

type Page = "home" | "agenda" | "characters" | "weapons";

type Arma = Weapon & {
  level?: number | string | null;
  weapon_level?: number | string | null;
  weaponLevel?: number | string | null;
  image_Url?: string | null;
  weapon_type?: string | null;
};

const initialForm = {
  name: "",
  type: "",
  rarity: "5",
  imageUrl: "",
};

export default function Armas({
  onNavigate,
}: {
  onNavigate: (p: Page) => void;
}) {
  const [weapons, setWeapons] = useState<Arma[]>([]);
  const [form, setForm] = useState(initialForm);
  const [busca, setBusca] = useState("");
  const [carregando, setCarregando] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const loadWeapons = async () => {
    try {
      const data = await api.getWeapons();
      setWeapons(data);
      setError("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao carregar armas.");
    } finally {
      setCarregando(false);
    }
  };

  useEffect(() => {
    let ativo = true;

    void api
      .getWeapons()
      .then((data) => {
        if (ativo) {
          setWeapons(data);
          setError("");
        }
      })
      .catch((err: unknown) => {
        if (ativo) {
          setError(
            err instanceof Error ? err.message : "Erro ao carregar armas.",
          );
        }
      })
      .finally(() => {
        if (ativo) {
          setCarregando(false);
        }
      });

    return () => {
      ativo = false;
    };
  }, []);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      await api.createWeapon({
        name: form.name,
        type: form.type || undefined,
        rarity: Number(form.rarity) || undefined,
        imageUrl: form.imageUrl || undefined,
      });

      setForm(initialForm);
      await loadWeapons();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao criar arma.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await api.deleteWeapon(id);
      await loadWeapons();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao excluir arma.");
    }
  };

  const weaponsFiltered = weapons.filter((weapon) => {
    const query = busca.trim().toLocaleLowerCase("pt-BR");
    const tipoArma = weapon.type ?? weapon.weapon_type;
    const informacoes = [weapon.name, tipoArma, weapon.rarity]
      .filter(Boolean)
      .join(" ")
      .toLocaleLowerCase("pt-BR");

    return informacoes.includes(query);
  });

  return (
    <div className="min-h-screen bg-[#0b0e13] text-[#edf3ff]">
      <NavBar onNavigate={onNavigate} />

      <main className="mx-auto w-full max-w-310 px-4 pb-12 pt-30 sm:px-6">
        <header className="mb-7 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mb-2 text-xs font-medium uppercase text-[#a9c4ff]">
              Biblioteca
            </p>
            <h1 className="text-3xl font-semibold">Armas</h1>
          </div>

          <label className="w-full sm:max-w-85">
            <span className="sr-only">Pesquisar armas</span>
            <input
              type="search"
              value={busca}
              onChange={(evento) => setBusca(evento.target.value)}
              placeholder="Buscar armas pelo nome ou tipo..."
              className="w-full rounded-lg border border-white/10 bg-[#10141a] px-4 py-3 text-sm text-[#edf3ff] outline-none placeholder:text-[#8f9bad] focus:border-[#a9c4ff]/60"
            />
          </label>
        </header>

        <section className="grid gap-6 lg:grid-cols-[minmax(260px,0.8fr)_minmax(0,2fr)]">
          <form
            onSubmit={handleSubmit}
            className="h-fit rounded-xl border border-white/10 bg-[#10141a] p-5"
          >
            <h2 className="mb-4 text-lg font-semibold">Adicionar arma</h2>

            <div className="grid gap-4">
              <label className="grid gap-2 text-sm text-[#b5c2d5]">
                Nome
                <input
                  value={form.name}
                  onChange={(evento) =>
                    setForm({ ...form, name: evento.target.value })
                  }
                  className="rounded-lg border border-white/10 bg-[#0b0e13] px-3 py-2 text-white outline-none focus:border-[#a9c4ff]"
                  placeholder="Ex: Staff of Homa"
                  required
                />
              </label>

              <label className="grid gap-2 text-sm text-[#b5c2d5]">
                Tipo
                <input
                  value={form.type}
                  onChange={(evento) =>
                    setForm({ ...form, type: evento.target.value })
                  }
                  className="rounded-lg border border-white/10 bg-[#0b0e13] px-3 py-2 text-white outline-none focus:border-[#a9c4ff]"
                  placeholder="Catalisador"
                />
              </label>

              <label className="grid gap-2 text-sm text-[#b5c2d5]">
                Raridade
                <select
                  value={form.rarity}
                  onChange={(evento) =>
                    setForm({ ...form, rarity: evento.target.value })
                  }
                  className="rounded-lg border border-white/10 bg-[#0b0e13] px-3 py-2 text-white outline-none focus:border-[#a9c4ff]"
                >
                  <option value="5">5 estrelas</option>
                  <option value="4">4 estrelas</option>
                  <option value="3">3 estrelas</option>
                </select>
              </label>

              <label className="grid gap-2 text-sm text-[#b5c2d5]">
                URL da imagem
                <input
                  type="url"
                  value={form.imageUrl}
                  onChange={(evento) =>
                    setForm({ ...form, imageUrl: evento.target.value })
                  }
                  className="rounded-lg border border-white/10 bg-[#0b0e13] px-3 py-2 text-white outline-none focus:border-[#a9c4ff]"
                  placeholder="https://..."
                />
              </label>

              {error && <p className="text-sm text-red-300">{error}</p>}

              <button
                type="submit"
                disabled={loading}
                className="rounded-lg bg-[#a9c4ff] px-4 py-3 font-medium text-[#0b0e13] transition hover:opacity-90 disabled:opacity-60"
              >
                {loading ? "Salvando..." : "Salvar arma"}
              </button>
            </div>
          </form>

          <div>
            {carregando ? (
              <p className="py-16 text-center text-sm text-[#b5c2d5]">
                Carregando armas...
              </p>
            ) : error && weapons.length === 0 ? (
              <div className="rounded-xl border border-white/10 bg-[#10141a] px-6 py-14 text-center">
                <h2 className="text-lg font-medium">
                  A base de armas ainda não está conectada
                </h2>
                <p className="mt-2 text-sm text-[#b5c2d5]">
                  Quando o backend e o banco de dados estiverem disponíveis, as
                  armas aparecerão aqui.
                </p>
              </div>
            ) : weaponsFiltered.length === 0 ? (
              <div className="rounded-xl border border-white/10 bg-[#10141a] px-6 py-14 text-center">
                <h2 className="text-lg font-medium">
                  {busca
                    ? "Nenhuma arma encontrada"
                    : "Nenhuma arma cadastrada"}
                </h2>
                <p className="mt-2 text-sm text-[#b5c2d5]">
                  {busca
                    ? "Tente buscar por outro nome ou tipo de arma."
                    : "Cadastre uma arma para preencher a biblioteca."}
                </p>
              </div>
            ) : (
              <section
                className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3"
                aria-label="Lista de armas"
              >
                {weaponsFiltered.map((weapon) => {
                  const imagem = weapon.imageUrl ?? weapon.image_Url;
                  const nivel =
                    weapon.level ?? weapon.weapon_level ?? weapon.weaponLevel;
                  const tipoArma = weapon.type ?? weapon.weapon_type;

                  return (
                    <article
                      key={weapon.id}
                      className="overflow-hidden rounded-xl border border-white/10 bg-[#10141a] transition hover:border-[#a9c4ff]/40"
                    >
                      <div className="relative aspect-4/3 overflow-hidden bg-[#171e29]">
                        <div className="absolute inset-0 flex items-center justify-center text-5xl font-semibold text-white/10">
                          {weapon.name.charAt(0)}
                        </div>
                        {imagem && (
                          <img
                            src={imagem}
                            alt={weapon.name}
                            loading="lazy"
                            className="relative h-full w-full object-cover"
                            onError={(evento) => {
                              evento.currentTarget.style.display = "none";
                            }}
                          />
                        )}
                      </div>

                      <div className="p-4">
                        <div className="flex items-start justify-between gap-3">
                          <h3 className="min-w-0 truncate text-lg font-semibold">
                            {weapon.name}
                          </h3>
                          {(weapon.rarity === 4 || weapon.rarity === 5) && (
                            <span
                              className="shrink-0 text-sm text-amber-300"
                              aria-label={`${weapon.rarity} estrelas`}
                              title={`${weapon.rarity} estrelas`}
                            >
                              {"★".repeat(weapon.rarity)}
                            </span>
                          )}
                        </div>

                        <div className="mt-4 flex flex-wrap gap-2 text-xs text-[#d5deee]">
                          <span className="rounded-md bg-white/5 px-2.5 py-1">
                            Nível {nivel ?? "não informado"}
                          </span>
                          {tipoArma && (
                            <span className="rounded-md bg-white/5 px-2.5 py-1">
                              {tipoArma}
                            </span>
                          )}
                        </div>

                        <button
                          type="button"
                          onClick={() => void handleDelete(weapon.id)}
                          className="mt-4 rounded-md border border-red-400/40 px-2.5 py-1.5 text-xs text-red-200 transition hover:bg-red-500/10"
                        >
                          Excluir
                        </button>
                      </div>
                    </article>
                  );
                })}
              </section>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
