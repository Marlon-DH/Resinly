import Logo from "./Logo";

type Page = "home" | "agenda" | "characters" | "weapons";

export default function NavBar({
  onNavigate,
}: {
  onNavigate: (p: Page) => void;
}) {
  return (
    <header className="barra-principal">
      <div className="marca-wrap">
        <Logo size={46} />
        <span className="nome-marca">Resinly</span>
      </div>

      <div className="barra-pesquisa-wrap">
        <input
          type="text"
          className="barra-pesquisa"
          placeholder="Buscar..."
          aria-label="Buscar"
        />
      </div>

      <nav className="menu-navegacao" aria-label="Navegação principal">
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
