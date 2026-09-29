import { useState } from "react";
import Agenda from "./pages/Agenda";
import Home from "./pages/Home";
import Personagens from "./pages/Personagens";
import Armas from "./pages/Armas";
import Login from "./pages/Login";

type Page = "home" | "agenda" | "characters" | "weapons" | "login";

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

  if (page === "login") {
    return <Login />;
  }

  return <Home onNavigate={setPage} />;
}

export default App;
