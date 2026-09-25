
import NavBar from "../components/NavBar";

type Page = "home" | "agenda" | "characters" | "weapons";

export default function Home({
  onNavigate,
}: {
  onNavigate: (p: Page) => void;
}) {
  return (
    <div className="home-page">
      <NavBar onNavigate={onNavigate} />

      <main className="home-main">
        <section className="home-layout">
          <article className="home-card home-card-large">
            <p className="home-kicker">Resumo</p>
            <h1>Bem-vindo ao Resinly</h1>
            <p>
              Controle sua rotina, personagens e objetivos em um único painel
              limpo e funcional.
            </p>
          </article>

          <div className="home-side-stack">
            <article className="home-card home-card-small">
              <p className="home-kicker">Agenda</p>
              <h2>Próximos passos</h2>
            </article>

            <article className="home-card home-card-small">
              <p className="home-kicker">Personagens</p>
              <h2>Fichas em revisão</h2>
            </article>
          </div>
        </section>
      </main>
    </div>
  );
}

