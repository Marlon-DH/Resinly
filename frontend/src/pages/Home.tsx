import Logo from "../components/Logo";

type Page = "agenda" | "characters" | "weapons";

export default function Home({
  onNavigate,
}: {
  onNavigate: (p: Page) => void;
}) {
  return (
    <div className="home-page">
      <header className="topbar">
        <div className="brand-wrap">
          <Logo size={64} />
          <h1 className="site-title">Resinly</h1>
        </div>

        <nav className="topbar-nav" aria-label="Navegação principal">
          <button type="button" onClick={() => onNavigate("agenda")}>
            Agenda
          </button>
          <button type="button" onClick={() => onNavigate("characters")}>
            Personagens
          </button>
          <button type="button" onClick={() => onNavigate("weapons")}>
            Armas
          </button>
        </nav>
      </header>

      <main className="home-content">
        <section className="hero-card">
          <span className="hero-badge">Planner de rotina</span>
          <h2>Organize sua jornada sem perder o ritmo.</h2>
          <p>
            Acompanhe sua agenda, metas de personagens e itens essenciais em um
            painel limpo, funcional e visualmente premium.
          </p>

          <div className="hero-actions">
            <button type="button" className="primary-btn">
              Ver agenda
            </button>
            <button type="button" className="secondary-btn">
              Explorar
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}
