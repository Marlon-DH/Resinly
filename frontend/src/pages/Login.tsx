import React, { useState } from "react";
import { Sparkles, ArrowRight, Check, Globe } from "lucide-react";

const MoonLogo = ({ size = 170, isActive = false }) => {
  return (
    <div
      className={`relative flex items-center justify-center transition-transform duration-700 ${
        isActive ? "scale-110" : "scale-100 hover:scale-105"
      }`}
      style={{ width: size, height: size }}
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 200 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="filter drop-shadow-[0_0_25px_rgba(147,197,253,0.6)]"
      >
        <defs>
          <radialGradient id="moonGrad" cx="35%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#f8fafc" />
            <stop offset="40%" stopColor="#e2e8f0" />
            <stop offset="75%" stopColor="#94a3b8" />
            <stop offset="100%" stopColor="#64748b" />
          </radialGradient>

          <radialGradient id="glowGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#60a5fa" stopOpacity="0.8" />
            <stop offset="50%" stopColor="#3b82f6" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#1d4ed8" stopOpacity="0" />
          </radialGradient>

          <filter
            id="craterShadow"
            x="-20%"
            y="-20%"
            width="140%"
            height="140%"
          >
            <feDropShadow
              dx="1"
              dy="2"
              stdDeviation="1"
              floodColor="#334155"
              floodOpacity="0.5"
            />
          </filter>

          <clipPath id="crescentClip">
            <path d="M145 100C145 141.421 111.421 175 70 175C97.614 175 120 141.421 120 100C120 58.579 97.614 25 70 25C111.421 25 145 58.579 145 100Z" />
          </clipPath>
        </defs>

        <circle
          cx="100"
          cy="100"
          r="95"
          fill="url(#glowGrad)"
          className="animate-pulse"
        />

        <path
          d="M145 100C145 141.421 111.421 175 70 175C97.614 175 120 141.421 120 100C120 58.579 97.614 25 70 25C111.421 25 145 58.579 145 100Z"
          fill="url(#moonGrad)"
        />

        <g filter="url(#craterShadow)" clipPath="url(#crescentClip)">
          <circle cx="101" cy="68" r="13" fill="#cbd5e1" opacity="0.65" />
          <circle cx="99" cy="66" r="10" fill="#94a3b8" opacity="0.45" />

          <circle cx="108" cy="105" r="17" fill="#cbd5e1" opacity="0.6" />
          <circle cx="106" cy="103" r="14" fill="#94a3b8" opacity="0.4" />

          <circle cx="96" cy="140" r="12" fill="#cbd5e1" opacity="0.6" />
          <circle cx="94" cy="138" r="9" fill="#94a3b8" opacity="0.4" />

          <circle cx="116" cy="132" r="7" fill="#cbd5e1" opacity="0.5" />
        </g>

        <path
          d="M145 100C145 141.421 111.421 175 70 175C97.614 175 120 141.421 120 100C120 58.579 97.614 25 70 25C111.421 25 145 58.579 145 100Z"
          stroke="#ffffff"
          strokeWidth="1.5"
          strokeOpacity="0.4"
          fill="none"
        />
      </svg>
    </div>
  );
};

const ESTRELAS_CONFIG = [
  {
    id: 1,
    pos: "left-[8%] top-[12%]",
    size: "text-[20px]",
    color: "text-blue-100",
    delay: "0s",
    duration: "2.5s",
  },
  {
    id: 2,
    pos: "right-[10%] top-[15%]",
    size: "text-[26px]",
    color: "text-white",
    delay: "0.7s",
    duration: "3.2s",
  },
  {
    id: 3,
    pos: "left-[12%] top-[65%]",
    size: "text-[16px]",
    color: "text-blue-200",
    delay: "1.2s",
    duration: "2.1s",
  },
  {
    id: 4,
    pos: "right-[8%] top-[70%]",
    size: "text-[22px]",
    color: "text-cyan-100",
    delay: "0.3s",
    duration: "2.8s",
  },
  {
    id: 5,
    pos: "left-[22%] bottom-[12%]",
    size: "text-[15px]",
    color: "text-blue-300",
    delay: "1.8s",
    duration: "3.5s",
  },
  {
    id: 6,
    pos: "right-[20%] bottom-[15%]",
    size: "text-[24px]",
    color: "text-white",
    delay: "0.5s",
    duration: "2.4s",
  },
  {
    id: 7,
    pos: "left-[48%] top-[8%]",
    size: "text-[18px]",
    color: "text-indigo-100",
    delay: "1.5s",
    duration: "3s",
  },
  {
    id: 8,
    pos: "right-[45%] bottom-[10%]",
    size: "text-[16px]",
    color: "text-blue-100",
    delay: "0.9s",
    duration: "2.7s",
  },
];

export default function App() {
  const [loginAtivo, setLoginAtivo] = useState(false);
  const [carregando, setCarregando] = useState(false);
  const [mensagemSucesso, setMensagemSucesso] = useState(false);

  const handleGoogleLogin = () => {
    setCarregando(true);

    setTimeout(() => {
      setCarregando(false);
      setMensagemSucesso(true);

      setTimeout(() => {
        setMensagemSucesso(false);
      }, 4000);
    }, 1500);
  };

  return (
    <div className="relative min-h-screen w-full bg-[#07090e] text-[#edf3ff] font-sans antialiased overflow-x-hidden selection:bg-blue-500 selection:text-white">
      <style>{`
        @keyframes twinkle {
          0%, 100% {
            opacity: 0.2;
            transform: scale(0.8) rotate(0deg);
          }

          50% {
            opacity: 1;
            transform: scale(1.2) rotate(15deg);
            filter: drop-shadow(0 0 6px rgba(255,255,255,0.9));
          }
        }

        @keyframes floatSlow {
          0%, 100% {
            transform: translateY(0px) translateX(0px);
          }

          50% {
            transform: translateY(-8px) translateX(5px);
          }
        }

        @keyframes floatReverse {
          0%, 100% {
            transform: translateY(0px) translateX(0px);
          }

          50% {
            transform: translateY(8px) translateX(-6px);
          }
        }

        .animate-twinkle {
          animation: twinkle var(--duration, 3s) infinite ease-in-out var(--delay, 0s);
        }

        .animate-float-slow {
          animation: floatSlow 7s infinite ease-in-out;
        }

        .animate-float-reverse {
          animation: floatReverse 9s infinite ease-in-out;
        }
      `}</style>

      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#0f172a] via-[#07090e] to-[#020408] pointer-events-none" />

      <div className="fixed inset-0 bg-[linear-gradient(to_right,#1e293b15_1px,transparent_1px),linear-gradient(to_bottom,#1e293b15_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none" />

      <div className="relative flex min-h-screen items-center justify-center p-4 md:p-6">
        <div className="relative w-full max-w-[950px] overflow-hidden rounded-[28px] border border-white/10 bg-black/40 backdrop-blur-2xl shadow-[0_0_50px_rgba(0,0,0,0.8),0_0_20px_rgba(59,130,246,0.15)] transition-all duration-700">
          <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-blue-500/40 to-transparent" />

          <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[580px]">
            <div
              className={`relative flex flex-col items-center justify-center p-8 transition-all duration-700 lg:col-span-6 ${
                loginAtivo
                  ? "bg-gradient-to-b from-blue-950/20 to-transparent"
                  : "lg:col-span-12 py-12"
              }`}
            >
              <div className="relative flex flex-col items-center justify-center w-full max-w-[340px]">
                <div className="relative h-[260px] w-[300px] flex items-center justify-center">
                  <div
                    className={`
                      absolute left-1/2 top-1/2 h-[240px] w-[240px] -translate-x-1/2 -translate-y-1/2
                      rounded-full bg-gradient-to-tr from-blue-600/30 via-sky-400/20 to-indigo-500/30 blur-3xl
                      transition-all duration-1000
                      ${
                        loginAtivo
                          ? "scale-125 opacity-100"
                          : "scale-90 opacity-40 hover:opacity-70"
                      }
                    `}
                  />

                  <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute left-[0px] top-[80px] h-[50px] w-[110px] rounded-full bg-blue-500/20 blur-md animate-float-slow" />
                    <div className="absolute left-[10px] top-[85px] h-[40px] w-[90px] rounded-full bg-sky-400/20 blur-sm animate-float-slow" />

                    <div className="absolute right-[0px] top-[60px] h-[60px] w-[120px] rounded-full bg-indigo-600/25 blur-md animate-float-reverse" />

                    <div className="absolute left-[40px] top-[20px] h-[35px] w-[90px] rounded-full bg-blue-400/20 blur-lg animate-float-slow" />

                    <div className="absolute bottom-[20px] left-1/2 h-[45px] w-[150px] -translate-x-1/2 rounded-full bg-blue-600/20 blur-lg animate-float-reverse" />
                  </div>

                  {ESTRELAS_CONFIG.map((estrela) => (
                    <div
                      key={estrela.id}
                      style={
                        {
                          "--delay": estrela.delay,
                          "--duration": estrela.duration,
                        } as React.CSSProperties
                      }
                      className={`
                        absolute leading-none pointer-events-none select-none animate-twinkle
                        ${estrela.pos} ${estrela.size} ${estrela.color}
                        transition-all duration-700
                      `}
                    >
                      ✦
                    </div>
                  ))}

                  <div
                    className="relative z-10 cursor-pointer"
                    onClick={() => setLoginAtivo(!loginAtivo)}
                  >
                    <MoonLogo size={170} isActive={loginAtivo} />
                  </div>
                </div>

                <div className="text-center mt-2 z-10">
                  <h3 className="text-xl font-bold tracking-wide text-white drop-shadow-md">
                    Moonlight Portal
                  </h3>

                  <p className="text-xs text-blue-200/60 mt-1 max-w-[240px]">
                    {loginAtivo
                      ? "Acesse sua conta com o Google para continuar a jornada nas estrelas."
                      : "Clique na lua ou no botão abaixo para expandir o acesso."}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setLoginAtivo((ativo) => !ativo)}
                  className={`
                    group relative z-20 mt-6 flex items-center justify-center gap-2
                    h-12 px-8 rounded-xl font-medium text-sm text-white
                    bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700
                    hover:from-blue-500 hover:via-indigo-500 hover:to-blue-600
                    shadow-[0_0_20px_rgba(37,99,235,0.4)] hover:shadow-[0_0_30px_rgba(59,130,246,0.6)]
                    transition-all duration-300 hover:scale-[1.03] active:scale-[0.97]
                    border border-blue-400/30
                  `}
                >
                  <span>{loginAtivo ? "Ocultar Login" : "Iniciar Acesso"}</span>

                  <ArrowRight
                    className={`w-4 h-4 transition-transform duration-300 ${
                      loginAtivo ? "rotate-180" : "group-hover:translate-x-1"
                    }`}
                  />
                </button>
              </div>
            </div>

            <div
              className={`
                transition-all duration-700 ease-in-out lg:col-span-6 flex flex-col justify-center p-6 sm:p-10
                ${
                  loginAtivo
                    ? "opacity-100 translate-y-0 max-h-[800px] visible"
                    : "opacity-0 translate-y-8 max-h-0 lg:max-h-none hidden lg:hidden"
                }
              `}
            >
              <div className="w-full max-w-sm mx-auto">
                <div className="mb-6">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-300 text-xs font-medium mb-3">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Acesso Seguro</span>
                  </div>

                  <h2 className="text-2xl font-bold tracking-tight text-white">
                    Bem-vindo de volta
                  </h2>

                  <p className="text-xs text-slate-400 mt-1">
                    Entre com sua conta Google para acessar o painel.
                  </p>
                </div>

                {mensagemSucesso && (
                  <div className="mb-5 p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2.5">
                    <div className="p-1 rounded-full bg-emerald-500/20 text-emerald-400">
                      <Check className="w-4 h-4" />
                    </div>

                    <span>Login realizado com sucesso! Redirecionando...</span>
                  </div>
                )}

                <button
                  type="button"
                  onClick={handleGoogleLogin}
                  disabled={carregando}
                  className="
                    w-full h-12 rounded-xl
                    bg-white text-slate-900
                    hover:bg-slate-100
                    active:scale-[0.98]
                    transition-all duration-200
                    shadow-[0_0_20px_rgba(255,255,255,0.08)]
                    disabled:opacity-60 disabled:cursor-not-allowed
                    flex items-center justify-center gap-3
                    font-semibold text-sm
                  "
                >
                  {carregando ? (
                    <div className="w-5 h-5 border-2 border-slate-400/40 border-t-slate-800 rounded-full animate-spin" />
                  ) : (
                    <>
                      <Globe className="w-5 h-5" />
                      <span>Continuar com Google</span>
                    </>
                  )}
                </button>

                <p className="text-center text-xs text-slate-500 mt-6">
                  Ao continuar, você será direcionado para a autenticação segura
                  do Google.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
