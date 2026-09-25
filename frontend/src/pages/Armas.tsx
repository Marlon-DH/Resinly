import { useEffect, useState } from "react";
import NavBar from "../components/NavBar";

type Page = "home" | "agenda" | "characters" | "weapons";

type Arma = {
  id: string;
  name: string;
  type?: string | null;
  weapon_type?: string | null;
  rarity?: number | null;
  level?: number | string | null;
  weapon_level?: number | string | null;
  weaponLevel?: number | string | null;
  image_Url?: string | null;
  imageUrl?: string | null;
};

const enderecoApi = import.meta.env.VITE_API_URL ?? "http://localhost:3000";

export default function Armas({
  onNavigate,
}: {
  onNavigate: (p: Page) => void;
}) {
  const [armas, setArmas] = useState<Arma[]>([]);
  const [busca, setBusca] = useState("");
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(false);

  useEffect(() => {
    const controlador = new AbortController();

    async function carregarArmas() {
      try {
        const resposta = await fetch(`${enderecoApi}/weapons`, {
          signal: controlador.signal,
        });

        if (!resposta.ok) {
          throw new Error("Falha ao carregar armas");
        }

        const dados: unknown = await resposta.json();

        if (!Array.isArray(dados)) {
          throw new Error("Formato de armas inválido");
        }

        setArmas(dados as Arma[]);
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

    void carregarArmas();
    return () => controlador.abort();
  }, []);

  const armasFiltradas = armas.filter((arma) => {
    const consulta = busca.trim().toLocaleLowerCase("pt-BR");
    const tipoArma = arma.type ?? arma.weapon_type;
    const informacoes = [arma.name, tipoArma, arma.rarity]
      .filter(Boolean)
      .join(" ");

    return informacoes.toLocaleLowerCase("pt-BR").includes(consulta);
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
            <h1 className="text-3xl font-semibold">Armas</h1>
          </div>

          <label className="w-full sm:max-w-[340px]">
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

        {carregando ? (
          <p className="py-16 text-center text-sm text-[#b5c2d5]">
            Carregando armas...
          </p>
        ) : erro ? (
          <div className="rounded-xl border border-white/10 bg-[#10141a] px-6 py-14 text-center">
            <h2 className="text-lg font-medium">
              A base de armas ainda não está conectada
            </h2>
            <p className="mt-2 text-sm text-[#b5c2d5]">
              Quando o backend e o banco de dados estiverem disponíveis, as
              armas aparecerão aqui.
            </p>
          </div>
        ) : armasFiltradas.length === 0 ? (
          <div className="rounded-xl border border-white/10 bg-[#10141a] px-6 py-14 text-center">
            <h2 className="text-lg font-medium">
              {busca ? "Nenhuma arma encontrada" : "Nenhuma arma cadastrada"}
            </h2>
            <p className="mt-2 text-sm text-[#b5c2d5]">
              {busca
                ? "Tente buscar por outro nome ou tipo de arma."
                : "A lista será preenchida quando os dados forem conectados."}
            </p>
          </div>
        ) : (
          <section
            className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
            aria-label="Lista de armas"
          >
            {armasFiltradas.map((arma) => {
              const imagem = arma.image_Url ?? arma.imageUrl;
              const nivel = arma.level ?? arma.weapon_level ?? arma.weaponLevel;
              const tipoArma = arma.type ?? arma.weapon_type;
              const raridade = arma.rarity;

              return (
                <article
                  key={arma.id}
                  className="overflow-hidden rounded-xl border border-white/10 bg-[#10141a] transition hover:border-[#a9c4ff]/40"
                >
                  <div className="relative aspect-[4/3] overflow-hidden bg-[#171e29]">
                    <div className="absolute inset-0 flex items-center justify-center text-5xl font-semibold text-white/10">
                      {arma.name.charAt(0)}
                    </div>
                    {imagem && (
                      <img
                        src={imagem}
                        alt={arma.name}
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
                      <h2 className="min-w-0 truncate text-lg font-semibold">
                        {arma.name}
                      </h2>
                      {(raridade === 4 || raridade === 5) && (
                        <span
                          className="shrink-0 text-sm text-amber-300"
                          aria-label={`${raridade} estrelas`}
                          title={`${raridade} estrelas`}
                        >
                          {"★".repeat(raridade)}
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
