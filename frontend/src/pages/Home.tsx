import Logo from "../components/Logo";

type Page = "agenda" | "characters" | "weapons";

export default function Home({
  onNavigate,
}: {
  onNavigate: (p: Page) => void;
}) {
  void onNavigate;
  return (
    <div>
      <header className="topbar">
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <Logo size={64} />
          <h1 className="site-title">Resinly</h1>
        </div>
        <nav className="topbar-nav">
          <button onClick={() => onNavigate("weapons")}>Armas</button>
          <button onClick={() => onNavigate("characters")}>Personagens</button>
        </nav>
      </header>
    </div>
  );
}
