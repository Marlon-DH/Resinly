import NavBar from "../components/NavBar";

type Page = "home" | "agenda" | "characters" | "weapons";

export default function Armas({
  onNavigate,
}: {
  onNavigate: (p: Page) => void;
}) {
  return (
    <div className="pagina-armas">
      <NavBar onNavigate={onNavigate} />
    </div>
  );
}
