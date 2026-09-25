
import { useEffect, useState } from "react";
import NavBar from "../components/NavBar";

type Page = "home" | "agenda" | "characters" | "weapons";

const personagens = [
  "Personagem 1",
  "Personagem 2",
  "Personagem 3",
  "Personagem 4",
];

const armas = [
  "Arma 1",
  "Arma 2",
  "Arma 3",
  "Arma 4",
];

export default function Home({
  onNavigate,
}: {
  onNavigate: (p: Page) => void;
}) {
  const [personagemAtual, setPersonagemAtual] = useState(0);
  const [armaAtual, setArmaAtual] = useState(0);

  useEffect(() => {
    const intervaloPersonagens = setInterval(() => {
      setPersonagemAtual((atual) => (atual + 1) % personagens.length);
    }, 3000);

    const intervaloArmas = setInterval(() => {
      setArmaAtual((atual) => (atual + 1) % armas.length);
    }, 3000);

    return () => {
      clearInterval(intervaloPersonagens);
      clearInterval(intervaloArmas);
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#0b0e13] text-[#edf3ff]">
      <NavBar onNavigate={onNavigate} />

      <main className="flex justify-center px-4 pb-12 pt-[120px] sm:px-6">
        <section className="grid w-full max-w-[1100px] gap-5 lg:grid-cols-[2fr_1fr]">

          {/* CARD PRINCIPAL */}
          <article className="min-h-[420px] rounded-[20px] border border-white/10 bg-[#10141a]/80 p-6">
            <h1>Bem-vindo ao Resinly</h1>
          </article>

          <div className="grid gap-5">

            {/* LOGIN */}
            <article className="min-h-[400px] rounded-[20px] border border-white/10 bg-[#10141a]/80 p-6">

              <p className="mb-6 text-[0.72rem] uppercase tracking-[0.16em] text-[#b5c2d5]">
                Para poder acessar o Resinly é preciso fazer login com sua conta Hoyo
              </p>

              <div className="min-h-[400px] rounded-[20px] border border-white/10 bg-[#10141a]/80 p-6">
              </div>

              <div className="flex min-h-[300px] items-center justify-center">
                <button
                  className="mt-90 h-12 w-32 rounded-[12px] bg-blue-900 font-semibold transition hover:bg-blue-800"
                >
                  Logar
                </button>
              </div>

            </article>

            {/* PERSONAGENS */}
            <article className="min-h-[400px] rounded-[20px] border border-white/10 bg-[#10141a]/80 p-6">

              <p className="mb-3 text-[0.72rem] uppercase tracking-[0.16em] text-[#b5c2d5]">
                Personagens
              </p>

              <div className="relative flex min-h-[300px] items-center justify-center overflow-hidden">

                <div
                  key={personagemAtual}
                  className="text-center transition-opacity duration-500"
                >
                  <h2 className="text-2xl font-semibold">
                    {personagens[personagemAtual]}
                  </h2>

                  <p className="mt-2 text-sm text-[#b5c2d5]">
                    Ficha em revisão
                  </p>
                </div>

              </div>

            </article>

            {/* ARMAS */}
            <article className="min-h-[400px] rounded-[20px] border border-white/10 bg-[#10141a]/80 p-6">

              <p className="mb-3 text-[0.72rem] uppercase tracking-[0.16em] text-[#b5c2d5]">
                Armas
              </p>

              <div className="relative flex min-h-[300px] items-center justify-center overflow-hidden">

                <div
                  key={armaAtual}
                  className="text-center transition-opacity duration-500"
                >
                  <h2 className="text-2xl font-semibold">
                    {armas[armaAtual]}
                  </h2>

                  <p className="mt-2 text-sm text-[#b5c2d5]">
                    Ficha em revisão
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

