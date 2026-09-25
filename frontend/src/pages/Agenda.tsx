import NavBar from "../components/NavBar";

type Page = "home" | "agenda" | "characters" | "weapons";

const agendaItems = [
  { day: "SEG", title: "Planejamento semanal", time: "00:00 - 23:00" },
  { day: "TER", title: "Planejamento semanal", time: "00:00 - 23:00" },
  { day: "QUA", title: "Planejamento semanal", time: "00:00 - 23:00" },
  { day: "QUI", title: "Planejamento semanal", time: "00:00 - 23:00" },
  { day: "SEX", title: "Planejamento semanal", time: "00:00 - 23:00" },
  { day: "SÁB", title: "Planejamento semanal", time: "00:00 - 23:00" },
  { day: "DOM", title: "Planejamento semanal", time: "00:00 - 23:00" },
];

export default function Agenda({
  onNavigate,
}: {
  onNavigate: (p: Page) => void;
}) {
  return (
    <div className="pagina-agenda">
      <NavBar onNavigate={onNavigate} />

      <main className="conteudo-agenda">
        <section className="cartao-agenda">
          <div className="cabecalho-agenda">
            <div>
              <p className="rotulo-agenda">Agenda</p>
              <h1>Planejamento</h1>
            </div>
          </div>

          <div className="lista-agenda">
            {agendaItems.map((item) => (
              <div key={item.day} className="item-agenda">
                <span className="dia-agenda">{item.day}</span>

                <div className="texto-agenda">
                  <strong>{item.title}</strong>
                  <span>{item.time}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
