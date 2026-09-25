import Logo from "../components/Logo";

type Page = "agenda" | "characters" | "weapons";

export default function Home({
  onNavigate,
}: {
  onNavigate: (p: Page) => void;
}) {
  void onNavigate;
  return (
    <div className="home-page">
      <header className="topbar">
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <Logo size={64} />
          <h1 className="site-title">Resinly</h1>
        </div>
      </header>
    </div>
  );
}
