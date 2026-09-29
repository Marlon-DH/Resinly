import { useEffect, useState } from "react";
import EntityCard from "../components/EntityCard";
import NavBar from "../components/NavBar";
import { api, type Character } from "../lib/api";

type Page = "home" | "agenda" | "characters" | "weapons";

type Personagem = Character & {
  title?: string | null;
  image_Url?: string | null;
  weapon_type?: string | null;
  weaponType?: string | null;
};

export default function Personagens({
  onNavigate,
}: {
  onNavigate: (p: Page) => void;
}) {
  const [characters, setCharacters] = useState<Personagem[]>([]);
  const [busca, setBusca] = useState("");
  const [carregando, setCarregando] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let ativo = true;

    void api
      .getCharacters()
      .then((data) => {
        if (ativo) {
          setCharacters(data);
          setError("");
        }
      })
      .catch((err: unknown) => {
        if (ativo) {
          setError(
            err instanceof Error
              ? err.message
              : "Erro ao carregar personagens.",
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

  const charactersFiltered = characters.filter((character) => {
    const query = busca.trim().toLocaleLowerCase("pt-BR");
    const informacoes = [
      character.name,
      character.title,
      character.element,
      character.weapon_type,
      character.weaponType,
    ]
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
            <h1 className="text-3xl font-semibold">Personagens</h1>
          </div>

          <label className="w-full sm:max-w-85">
            <span className="sr-only">Pesquisar personagens</span>
            <input
              type="search"
              value={busca}
              onChange={(evento) => setBusca(evento.target.value)}
              placeholder="Buscar por nome, elemento ou arma..."
              className="w-full rounded-lg border border-white/10 bg-[#10141a] px-4 py-3 text-sm text-[#edf3ff] outline-none placeholder:text-[#8f9bad] focus:border-[#a9c4ff]/60"
            />
          </label>
        </header>

        <section className="grid gap-6">
          <div>
            {carregando ? (
              <p className="py-16 text-center text-sm text-[#b5c2d5]">
                Carregando personagens...
              </p>
            ) : error && characters.length === 0 ? (
              <div className="rounded-xl border border-white/10 bg-[#10141a] px-6 py-14 text-center">
                <h2 className="text-lg font-medium">
                  A base de personagens ainda não está conectada
                </h2>
                <p className="mt-2 text-sm text-[#b5c2d5]">
                  Quando o backend e o banco de dados estiverem disponíveis, os
                  personagens aparecerão aqui.
                </p>
              </div>
            ) : charactersFiltered.length === 0 ? (
              <div className="rounded-xl border border-white/10 bg-[#10141a] px-6 py-14 text-center">
                <h2 className="text-lg font-medium">
                  {busca
                    ? "Nenhum personagem encontrado"
                    : "Nenhum personagem cadastrado"}
                </h2>
                <p className="mt-2 text-sm text-[#b5c2d5]">
                  {busca
                    ? "Tente outro nome, elemento ou tipo de arma."
                    : "Cadastre um personagem para preencher a biblioteca."}
                </p>
              </div>
            ) : (
              <section
                className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3"
                aria-label="Lista de personagens"
              >
                {charactersFiltered.map((character) => (
                  <EntityCard
                    key={character.id}
                    kind="character"
                    name={character.name}
                    title={character.title}
                    imageUrl={character.imageUrl ?? character.image_Url ?? null}
                    rarity={character.rarity}
                    element={character.element}
                    type={character.weapon_type ?? character.weaponType}
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
