
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
    <div className="agenda-page">
      <NavBar onNavigate={onNavigate} />

      <main className="agenda-main">
        <section className="agenda-card">
          <div className="agenda-header">
            <div>
              <p className="agenda-kicker">Agenda</p>
              <h1>Planejamento</h1>
            </div>
          </div>

          <div className="agenda-list">
            {agendaItems.map((item) => (
              <div key={item.day} className="agenda-item">
                <span className="agenda-day">{item.day}</span>

                <div className="agenda-copy">
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

