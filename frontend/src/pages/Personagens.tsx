import NavBar from "../components/NavBar";

type Page = "home" | "agenda" | "characters" | "weapons";

export default function Personagens({
  onNavigate,
}: {
  onNavigate: (p: Page) => void;
}) {
  return (
    <div className="personagens-page">
      <NavBar onNavigate={onNavigate} />
    </div>
  );
}
