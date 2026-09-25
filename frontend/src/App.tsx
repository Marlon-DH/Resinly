import { useState } from "react";
import Agenda from "./pages/Agenda";
import Home from "./pages/Home";
import Personagens from "./pages/Personagens";
import Armas from "./pages/Armas";

type Page = "home" | "agenda" | "characters" | "weapons";

function App() {
  const [page, setPage] = useState<Page>("home");

  if (page === "agenda") {
    return <Agenda onNavigate={setPage} />;
  }

  if (page === "characters") {
    return <Personagens onNavigate={setPage} />;
  }

  if (page === "weapons") {
    return <Armas onNavigate={setPage} />;
  }

  return <Home onNavigate={setPage} />;
}

export default App;
