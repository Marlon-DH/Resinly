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
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <Logo size={40} />
          <h1>Resinly</h1>
        </div>
      </header>
    </div>
  );
}
