import NavBar from "../components/NavBar";

type Page = "home" | "agenda" | "characters" | "weapons";

export default function Home({
  onNavigate,
}: {
  onNavigate: (p: Page) => void;
}) {
  return (
    <div className="pagina-principal">
      <NavBar onNavigate={onNavigate} />

      <main className="conteudo-principal">
        <section className="layout-principal">
          <article className="cartao cartao-grande">
            <p className="rotulo">Resumo</p>
            <h1>Bem-vindo ao Resinly</h1>
            <p>
              Controle sua rotina, personagens e objetivos em um único painel
              limpo e funcional.
            </p>
          </article>

          <div className="pilha-lateral">
            <article className="cartao cartao-pequeno">
              <p className="rotulo">Agenda</p>
              <h2>Próximos passos</h2>
            </article>

            <article className="cartao cartao-pequeno">
              <p className="rotulo">Personagens</p>
              <h2>Fichas em revisão</h2>
            </article>
          </div>
        </section>
      </main>
    </div>
  );
}
