import type { FarmDay, FarmItem } from "../types/farm";

type AgendaProps = {
  items: FarmItem[];
};

type DayColumn = {
  day: FarmDay;
  date: string;
};

const week: DayColumn[] = [
  { day: "Seg", date: "8" },
  { day: "Ter", date: "9" },
  { day: "Qua", date: "10" },
  { day: "Qui", date: "11" },
  { day: "Sex", date: "12" },
  { day: "Sáb", date: "13" },
  { day: "Dom", date: "14" },
];

const taskColors: Record<FarmItem["kind"], string> = {
  Talento: "border-violet-400 bg-violet-50",
  Arma: "border-amber-400 bg-amber-50",
  Inimigo: "border-emerald-400 bg-emerald-50",
  "Chefe semanal": "border-rose-400 bg-rose-50",
};

function Agenda({ items }: AgendaProps) {
  const allDays: FarmDay[] = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"];
  const everyDayItems = items.filter(
    (item) => item.days.length === allDays.length,
  );
  const scheduledItems = items.filter(
    (item) => item.days.length < allDays.length && item.days.length > 0,
  );

  return (
    <section className="agenda-section mt-11">
      <div className="section-title mb-4">
        <div>
          <p className="eyebrow">SUA SEMANA</p>
          <h2>Agenda de farm</h2>
        </div>
        <button className="week-button">
          ‹ &nbsp; 8–14 de setembro &nbsp; ›
        </button>
      </div>

      <div className="agenda-layout">
        <div className="overflow-x-auto pb-3">
          <div className="calendar-grid">
            {week.map(({ day, date }, index) => {
              const tasks = scheduledItems.filter((item) =>
                item.days.includes(day),
              );

              return (
                <div
                  className={`day-column ${index === 0 ? "today" : ""}`}
                  key={day}
                >
                  <div className="day-header">
                    <small>{day}</small>
                    <b>{date}</b>
                  </div>

                  <div className="tasks">
                    {tasks.length ? (
                      tasks.map((item) => (
                        <article
                          className={`task ${item.kind.toLowerCase().replace(/\s+/g, "-")}`}
                          key={`${item.name}-${day}`}
                        >
                          <span className="task-icon">{item.icon}</span>
                          <div>
                            <b>{item.name}</b>
                            <small>{item.kind}</small>
                          </div>
                        </article>
                      ))
                    ) : (
                      <div className="rest">
                        Dia livre
                        <br />
                        <span>sem domínio</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <aside className="everyday-panel">
          <div className="everyday-header">
            <p className="eyebrow">TODO DIA</p>
            <h3>Farm contínuo</h3>
          </div>

          {everyDayItems.length ? (
            <div className="everyday-list">
              {everyDayItems.map((item) => (
                <article
                  className={`task ${item.kind.toLowerCase().replace(/\s+/g, "-")}`}
                  key={`${item.name}-daily`}
                >
                  <span className="task-icon">{item.icon}</span>
                  <div>
                    <b>{item.name}</b>
                    <small>{item.kind}</small>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <p className="empty-state">
              Nenhum item para farmar todos os dias.
            </p>
          )}
        </aside>
      </div>
    </section>
  );
}

export default Agenda;
