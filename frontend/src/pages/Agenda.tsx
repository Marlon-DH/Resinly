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
    <div className="min-h-screen bg-[#0b0e13] text-[#edf3ff]">
      <NavBar onNavigate={onNavigate} />

      <main className="flex justify-center px-4 pb-12 pt-[120px] sm:px-6">
        <section className="w-full max-w-[760px] rounded-[20px] border border-white/10 bg-[#10141a]/80 p-6">
          <div className="border-b border-white/10 pb-4">
            <div>
              <p className="text-[0.7rem] uppercase tracking-[0.12em] text-[#b5c2d5]">
                Agenda
              </p>
              <h1 className="mt-2 text-3xl font-semibold">Planejamento</h1>
            </div>
          </div>

          <div className="mt-5 grid gap-3.5">
            {agendaItems.map((item) => (
              <div
                key={item.day}
                className="flex items-center gap-4 rounded-[14px] border border-white/10 bg-white/[0.02] p-3.5 max-[420px]:items-start"
              >
                <span className="min-w-[70px] rounded-[10px] bg-[#a9c4ff]/10 px-2.5 py-2 text-center text-[0.7rem]">
                  {item.day}
                </span>

                <div className="flex flex-col gap-1">
                  <strong>{item.title}</strong>
                  <span className="text-sm text-[#b5c2d5]">{item.time}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
