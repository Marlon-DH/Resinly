import Logo from "./Logo";

type Page = "home" | "agenda" | "characters" | "weapons";

export default function NavBar({
  onNavigate,
}: {
  onNavigate: (p: Page) => void;
}) {
  return (
    <header className="topbar">
      <div className="brand-wrap">
        <Logo size={46} />
        <span className="brand-name">Resinly</span>
      </div>

      <nav className="topbar-nav" aria-label="Navegação principal">
        <button type="button" onClick={() => onNavigate("home")}>
          Principal
        </button>
        <button type="button" onClick={() => onNavigate("agenda")}>
          Agenda
        </button>
        <button type="button" onClick={() => onNavigate("characters")}>
          Personagens
        </button>
        <button type="button" onClick={() => onNavigate("weapons")}>
          Armas
        </button>
      </nav>
    </header>
  );
}
