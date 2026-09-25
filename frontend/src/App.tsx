  import { useState } from "react";
  import "./App.css";

  type Page = "agenda" | "characters" | "weapons";

  function App() {
    const [page, setPage] = useState<Page>("agenda");

    if (page === "characters") {
      return <Personagens onNavigate={setPage} />;
    }

    if (page === "weapons") {
      return <Armas onNavigate={setPage} />;
    }

    return <Home onNavigate={setPage} />;
  }

  export default App;