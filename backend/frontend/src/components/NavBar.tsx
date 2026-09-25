import Logo from "./Logo";

type Page = "home" | "agenda" | "characters" | "weapons" | "login";

export default function NavBar({
  onNavigate,
}: {
  onNavigate: (p: Page) => void;
}) {
  return (
    <header className="fixed inset-x-0 top-0 z-10 flex min-h-[84px] flex-wrap items-center justify-between gap-x-3 border-b border-white/10 bg-[#10141a]/95 px-4 py-3 backdrop-blur-sm sm:px-7">
      <div className="flex shrink-0 items-center gap-2 sm:gap-3">
        <Logo size={46} />

        <span className="text-lg font-bold tracking-[0.08em] text-[#edf3ff] [font-family:'Cinzel_Decorative',serif]">
          Resinly
        </span>
      </div>

      <div className="hidden flex-1 justify-center px-5 md:flex">
        <input
          type="text"
          className="w-full max-w-[360px] rounded-full border border-white/10 bg-transparent px-4 py-2.5 text-sm text-[#edf3ff] outline-none placeholder:text-[#b5c2d5] transition focus:border-[#a9c4ff]/60"
          placeholder="Buscar..."
          aria-label="Buscar"
        />
      </div>

      <nav
        className="flex min-w-0 gap-0.5 sm:gap-2"
        aria-label="Navegação principal"
      >
        <button
          type="button"
          className="rounded-full px-1.5 py-2 text-[11px] text-[#b5c2d5] transition hover:bg-white/5 hover:text-[#edf3ff] sm:px-3 sm:text-sm"
          onClick={() => onNavigate("home")}
        >
          Principal
        </button>

        <button
          type="button"
          className="rounded-full px-1.5 py-2 text-[11px] text-[#b5c2d5] transition hover:bg-white/5 hover:text-[#edf3ff] sm:px-3 sm:text-sm"
          onClick={() => onNavigate("agenda")}
        >
          Agenda
        </button>

        <button
          type="button"
          className="rounded-full px-1.5 py-2 text-[11px] text-[#b5c2d5] transition hover:bg-white/5 hover:text-[#edf3ff] sm:px-3 sm:text-sm"
          onClick={() => onNavigate("characters")}
        >
          Personagens
        </button>

        <button
          type="button"
          className="rounded-full px-1.5 py-2 text-[11px] text-[#b5c2d5] transition hover:bg-white/5 hover:text-[#edf3ff] sm:px-3 sm:text-sm"
          onClick={() => onNavigate("weapons")}
        >
          Armas
        </button>
      </nav>

      <button
        type="button"
        onClick={() => onNavigate("login")}
        className="flex shrink-0 items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2 text-sm text-[#edf3ff] transition hover:border-[#a9c4ff]/40 hover:bg-white/10"
      >
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#a9c4ff]/15 text-[#a9c4ff]">
          👤
        </span>

        <span className="hidden sm:inline">
          Entrar
        </span>
      </button>
    </header>
  );
}