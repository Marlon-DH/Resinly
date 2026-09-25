import NavBar from "../components/NavBar";

type Page = "home" | "agenda" | "characters" | "weapons";

export default function Personagens({
  onNavigate,
}: {
  onNavigate: (p: Page) => void;
}) {
  return (
    <div className="pagina-personagens">
      <NavBar onNavigate={onNavigate} />
    </div>
  );
}
