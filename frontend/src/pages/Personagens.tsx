import { useEffect, useState } from "react";
import NavBar from "../components/NavBar";

type Page = "home" | "agenda" | "characters" | "weapons";

type Personagem = {
  id: string;
  name: string;
  title?: string | null;
  element?: string | null;
  rarity?: number | null;
  image_Url?: string | null;
  imageUrl?: string | null;
  weapon_type?: string | null;
  weaponType?: string | null;
};

const enderecoApi = import.meta.env.VITE_API_URL ?? "http://localhost:3000";

export default function Personagens({
  onNavigate,
}: {
  onNavigate: (p: Page) => void;
}) {
  const [personagens, setPersonagens] = useState<Personagem[]>([]);
  const [busca, setBusca] = useState("");
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(false);

  useEffect(() => {
    const controlador = new AbortController();

    async function carregarPersonagens() {
      try {
        const resposta = await fetch(`${enderecoApi}/characters`, {
          signal: controlador.signal,
        });

        if (!resposta.ok) {
          throw new Error("Falha ao carregar personagens");
        }

        const dados: unknown = await resposta.json();

        if (!Array.isArray(dados)) {
          throw new Error("Formato de personagens inválido");
        }

        setPersonagens(dados as Personagem[]);
      } catch (erroCarregamento) {
        if (
          erroCarregamento instanceof DOMException &&
          erroCarregamento.name === "AbortError"
        ) {
          return;
        }

        setErro(true);
      } finally {
        if (!controlador.signal.aborted) {
          setCarregando(false);
        }
      }
    }

    void carregarPersonagens();
    return () => controlador.abort();
  }, []);

  const personagensFiltrados = personagens.filter((personagem) => {
    const consulta = busca.trim().toLocaleLowerCase("pt-BR");
    const informacoes = [
      personagem.name,
      personagem.title,
      personagem.element,
      personagem.weapon_type,
      personagem.weaponType,
    ]
      .filter(Boolean)
      .join(" ")
      .toLocaleLowerCase("pt-BR");

    return informacoes.includes(consulta);
  });

  return (
    <div className="min-h-screen bg-[#0b0e13] text-[#edf3ff]">
      <NavBar onNavigate={onNavigate} />
      <main className="mx-auto w-full max-w-[1240px] px-4 pb-12 pt-[120px] sm:px-6">
        <header className="mb-7 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mb-2 text-xs font-medium uppercase text-[#a9c4ff]">
              Biblioteca
            </p>
            <h1 className="text-3xl font-semibold">Personagens</h1>
          </div>

          <label className="w-full sm:max-w-[340px]">
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

        {carregando ? (
          <p className="py-16 text-center text-sm text-[#b5c2d5]">
            Carregando personagens...
          </p>
        ) : erro ? (
          <div className="rounded-xl border border-white/10 bg-[#10141a] px-6 py-14 text-center">
            <h2 className="text-lg font-medium">
              A base de personagens ainda não está conectada
            </h2>
            <p className="mt-2 text-sm text-[#b5c2d5]">
              Quando o backend e o banco de dados estiverem disponíveis, os
              personagens aparecerão aqui.
            </p>
          </div>
        ) : personagensFiltrados.length === 0 ? (
          <div className="rounded-xl border border-white/10 bg-[#10141a] px-6 py-14 text-center">
            <h2 className="text-lg font-medium">
              {busca
                ? "Nenhum personagem encontrado"
                : "Nenhum personagem cadastrado"}
            </h2>
            <p className="mt-2 text-sm text-[#b5c2d5]">
              {busca
                ? "Tente outro nome, elemento ou tipo de arma."
                : "A lista será preenchida quando os dados forem conectados."}
            </p>
          </div>
        ) : (
          <section
            className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
            aria-label="Lista de personagens"
          >
            {personagensFiltrados.map((personagem) => {
              const imagem = personagem.image_Url ?? personagem.imageUrl;
              const tipoArma = personagem.weapon_type ?? personagem.weaponType;

              return (
                <article
                  key={personagem.id}
                  className="overflow-hidden rounded-xl border border-white/10 bg-[#10141a] transition hover:border-[#a9c4ff]/40"
                >
                  <div className="relative aspect-[4/3] overflow-hidden bg-[#171e29]">
                    <div className="absolute inset-0 flex items-center justify-center text-5xl font-semibold text-white/10">
                      {personagem.name.charAt(0)}
                    </div>
                    {imagem && (
                      <img
                        src={imagem}
                        alt={personagem.name}
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
                      <div className="min-w-0">
                        <h2 className="truncate text-lg font-semibold">
                          {personagem.name}
                        </h2>
                        {personagem.title && (
                          <p className="mt-1 truncate text-sm text-[#b5c2d5]">
                            {personagem.title}
                          </p>
                        )}
                      </div>
                      {personagem.rarity && (
                        <span className="shrink-0 text-sm text-amber-300">
                          {"★".repeat(Math.min(personagem.rarity, 5))}
                        </span>
                      )}
                    </div>

                    {(personagem.element || tipoArma) && (
                      <div className="mt-4 flex flex-wrap gap-2">
                        {personagem.element && (
                          <span className="rounded-md bg-white/5 px-2.5 py-1 text-xs text-[#d5deee]">
                            {personagem.element}
                          </span>
                        )}
                        {tipoArma && (
                          <span className="rounded-md bg-white/5 px-2.5 py-1 text-xs text-[#d5deee]">
                            {tipoArma}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </article>
              );
            })}
          </section>
        )}
      </main>
    </div>
  );
}
