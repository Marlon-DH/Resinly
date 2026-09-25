import NavBar from "../components/NavBar";

type Page = "home" | "agenda" | "characters" | "weapons";

export default function Personagens({
  onNavigate,
}: {
  onNavigate: (p: Page) => void;
}) {
  return (
    <div className="min-h-screen bg-[#0b0e13] text-[#edf3ff]">
      <NavBar onNavigate={onNavigate} />
    </div>
  );
}
