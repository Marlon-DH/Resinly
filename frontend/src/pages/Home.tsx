import { useEffect, useState } from "react";
import NavBar from "../components/NavBar";
import Logo from "../components/Logo";

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
  const [loginAtivo, setLoginAtivo] = useState(false);

  useEffect(() => {
    const intervaloPersonagens = setInterval(() => {
      setPersonagemAtual(
        (atual) => (atual + 1) % personagens.length,
      );
    }, 3000);

    const intervaloArmas = setInterval(() => {
      setArmaAtual(
        (atual) => (atual + 1) % armas.length,
      );
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
            <h1 className="text-2xl font-semibold">
              Bem-vindo ao Resinly
            </h1>
          </article>

          <div className="grid gap-5">

            {/* LOGIN */}
            <article className="min-h-[400px] rounded-[20px] border border-white/10 bg-[#10141a]/80 p-6">

              <p className="mb-6 text-[0.72rem] uppercase tracking-[0.16em] text-[#e5ff00]">
                Para poder acessar o Resinly é preciso fazer login com sua conta Hoyo
              </p>

              {/* CAIXA PRETA */}
              <div className="relative flex min-h-[400px] items-center justify-center overflow-hidden rounded-[20px] border border-white/10 bg-black">

                <div className="relative flex flex-col items-center">

                  {/* ÁREA DA LUA */}
                  <div className="relative h-[240px] w-[280px]">

                    {/* BRILHO ATRÁS DA LUA */}
                    <div
                      className={`
                        absolute
                        left-1/2
                        top-1/2
                        h-[210px]
                        w-[210px]
                        -translate-x-1/2
                        -translate-y-1/2
                        rounded-full
                        bg-blue-400/30
                        blur-3xl
                        transition-all
                        duration-700
                        ${
                          loginAtivo
                            ? "scale-125 opacity-100"
                            : "scale-75 opacity-0"
                        }
                      `}
                    />

                    {/* NUVEM 1 */}
                    <div
                      className="
                        absolute
                        left-[5px]
                        top-[75px]
                        h-[45px]
                        w-[100px]
                        rounded-full
                        bg-blue-500/30
                        blur-md
                      "
                    />

                    {/* NUVEM 2 */}
                    <div
                      className="
                        absolute
                        right-[5px]
                        top-[65px]
                        h-[55px]
                        w-[110px]
                        rounded-full
                        bg-blue-600/30
                        blur-md
                      "
                    />

                    {/* NUVEM 3 */}
                    <div
                      className="
                        absolute
                        left-[35px]
                        top-[25px]
                        h-[35px]
                        w-[80px]
                        rounded-full
                        bg-blue-400/25
                        blur-lg
                      "
                    />

                    {/* NUVEM 4 */}
                    <div
                      className="
                        absolute
                        right-[30px]
                        top-[35px]
                        h-[40px]
                        w-[85px]
                        rounded-full
                        bg-blue-500/25
                        blur-lg
                      "
                    />

                    {/* NUVEM 5 */}
                    <div
                      className="
                        absolute
                        bottom-[25px]
                        left-1/2
                        h-[40px]
                        w-[130px]
                        -translate-x-1/2
                        rounded-full
                        bg-blue-600/20
                        blur-lg
                      "
                    />

                    {/* ESTRELA 1 */}
                    <div
                      className={`
                        absolute
                        left-[25px]
                        top-[20px]
                        text-[22px]
                        leading-none
                        text-white
                        transition-all
                        duration-700
                        ${
                          loginAtivo
                            ? "scale-100 rotate-0 opacity-100"
                            : "scale-0 rotate-90 opacity-0"
                        }
                      `}
                    >
                      ✦
                    </div>

                    {/* ESTRELA 2 */}
                    <div
                      className={`
                        absolute
                        right-[20px]
                        top-[25px]
                        text-[28px]
                        leading-none
                        text-blue-100
                        transition-all
                        delay-100
                        duration-700
                        ${
                          loginAtivo
                            ? "scale-100 rotate-0 opacity-100"
                            : "scale-0 rotate-90 opacity-0"
                        }
                      `}
                    >
                      ✦
                    </div>

                    {/* ESTRELA 3 */}
                    <div
                      className={`
                        absolute
                        left-[15px]
                        top-[135px]
                        text-[18px]
                        leading-none
                        text-blue-200
                        transition-all
                        delay-150
                        duration-700
                        ${
                          loginAtivo
                            ? "scale-100 rotate-0 opacity-100"
                            : "scale-0 rotate-90 opacity-0"
                        }
                      `}
                    >
                      ✦
                    </div>

                    {/* ESTRELA 4 */}
                    <div
                      className={`
                        absolute
                        right-[10px]
                        top-[145px]
                        text-[24px]
                        leading-none
                        text-white
                        transition-all
                        delay-200
                        duration-700
                        ${
                          loginAtivo
                            ? "scale-100 rotate-0 opacity-100"
                            : "scale-0 rotate-90 opacity-0"
                        }
                      `}
                    >
                      ✦
                    </div>

                    {/* ESTRELA 5 */}
                    <div
                      className={`
                        absolute
                        bottom-[20px]
                        left-[40px]
                        text-[17px]
                        leading-none
                        text-blue-200
                        transition-all
                        delay-300
                        duration-700
                        ${
                          loginAtivo
                            ? "scale-100 rotate-0 opacity-100"
                            : "scale-0 rotate-90 opacity-0"
                        }
                      `}
                    >
                      ✦
                    </div>

                    {/* ESTRELA 6 */}
                    <div
                      className={`
                        absolute
                        bottom-[25px]
                        right-[45px]
                        text-[27px]
                        leading-none
                        text-white
                        transition-all
                        delay-200
                        duration-700
                        ${
                          loginAtivo
                            ? "scale-100 rotate-0 opacity-100"
                            : "scale-0 rotate-90 opacity-0"
                        }
                      `}
                    >
                      ✦
                    </div>

                    {/* LUA / LOGO */}
                    <div
                      className={`
                        absolute
                        left-1/2
                        top-1/2
                        z-10
                        -translate-x-1/2
                        -translate-y-1/2
                        transition-all
                        duration-700
                        ${
                          loginAtivo
                            ? "scale-110 drop-shadow-[0_0_30px_rgba(180,220,255,0.9)]"
                            : "scale-100"
                        }
                      `}
                    >
                      <Logo size={170} />
                    </div>

                  </div>

                  {/* BOTÃO DE LOGIN */}
                  <button
                    type="button"
                    onClick={() => setLoginAtivo((ativo) => !ativo)}
                    className="
                      relative
                      z-20
                      mt-2
                      h-12
                      w-32
                      rounded-[12px]
                      bg-blue-900
                      font-semibold
                      text-white
                      shadow-lg
                      transition-all
                      duration-300
                      hover:scale-105
                      hover:bg-blue-800
                      active:scale-95
                    "
                  >
                    Logar
                  </button>

                </div>
              </div>
            </article>

            {/* PERSONAGENS */}
            <article className="min-h-[400px] rounded-[20px] border border-white/10 bg-[#10141a]/80 p-6">

              <p className="mb-3 text-[0.72rem] uppercase tracking-[0.16em] text-[#e5ff00]">
                Personagens
              </p>

              <div className="relative flex min-h-[300px] items-center justify-center overflow-hidden">

                <div
                  key={personagemAtual}
                  className="text-center transition-opacity duration-500"
                >
                  <h2 className="text-2xl font-semibold text-[#e5ff00]">
                    {personagens[personagemAtual]}
                  </h2>

                  <p className="mt-2 text-sm text-[#e5ff00]">
                    Ficha em revisão
                  </p>
                </div>

              </div>
            </article>

            {/* ARMAS */}
            <article className="min-h-[400px] rounded-[20px] border border-white/10 bg-[#10141a]/80 p-6">

              <p className="mb-3 text-[0.72rem] uppercase tracking-[0.16em] text-[#e5ff00]">
                Armas
              </p>

              <div className="relative flex min-h-[300px] items-center justify-center overflow-hidden">

                <div
                  key={armaAtual}
                  className="text-center transition-opacity duration-500"
                >
                  <h2 className="text-2xl font-semibold text-[#e5ff00]">
                    {armas[armaAtual]}
                  </h2>

                  <p className="mt-2 text-sm text-[#e5ff00]">
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