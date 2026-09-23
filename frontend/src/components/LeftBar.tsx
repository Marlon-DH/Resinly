type Page = "agenda" | "characters" | "weapons";

type LeftBarProps = {
  section: Page;
  onSectionChange: (page: Page) => void;
};

function LeftBar({ section, onSectionChange }: LeftBarProps) {
  return (
    <aside className="sidebar">
      <div className="brand">
        <span className="brand-mark">✦</span>
        <span>
          Resin<span>ly</span>
        </span>
      </div>

      <nav>
        <button
          className={`nav-link ${section === "agenda" ? "active" : ""}`}
          onClick={() => onSectionChange("agenda")}
        >
          <span>▦</span> Minha agenda
        </button>

        <button
          className={`nav-link ${section === "characters" ? "active" : ""}`}
          onClick={() => onSectionChange("characters")}
        >
          <span>◈</span> Personagens
        </button>

        <button
          className={`nav-link ${section === "weapons" ? "active" : ""}`}
          onClick={() => onSectionChange("weapons")}
        >
          <span>⚔</span> Armas
        </button>
      </nav>

      <div className="sidebar-footer">
        <div className="mini-avatar">D</div>
        <div>
          <b>Viajante</b>
          <small>AR 58</small>
        </div>
      </div>
    </aside>
  );
}

export default LeftBar;