import { useEffect, useState } from "react";
import EntityCard from "../components/EntityCard";
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

export default function Armas({
  onNavigate,
}: {
  onNavigate: (p: Page) => void;
}) {
  const [weapons, setWeapons] = useState<Arma[]>([]);
  const [busca, setBusca] = useState("");
  const [carregando, setCarregando] = useState(true);
  const [error, setError] = useState("");

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

        <section className="grid gap-6">
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
                {weaponsFiltered.map((weapon) => (
                  <EntityCard
                    key={weapon.id}
                    kind="weapon"
                    name={weapon.name}
                    imageUrl={weapon.imageUrl ?? weapon.image_Url ?? null}
                    rarity={weapon.rarity}
                    type={weapon.type ?? weapon.weapon_type ?? null}
                  />
                ))}
              </section>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
