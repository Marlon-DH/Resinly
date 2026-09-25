import Logo from "../components/Logo";

type Page = "agenda" | "characters" | "weapons";

export default function Armas({
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
          <div>
            <h1 className="site-title">Resinly</h1>
            <p className="eyebrow">Armas</p>
          </div>
        </div>
      </header>
    </div>
  );
}
