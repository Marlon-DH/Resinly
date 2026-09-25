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
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <Logo size={36} />
          <div>
            <h1>Resinly</h1>
            <p className="eyebrow">Armas</p>
          </div>
        </div>
      </header>
    </div>
  );
}
