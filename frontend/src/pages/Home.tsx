import NavBar from "../components/NavBar";

type Page = "home" | "agenda" | "characters" | "weapons";

export default function Home({
  onNavigate,
}: {
  onNavigate: (p: Page) => void;
}) {
  return (
    <div className="min-h-screen bg-[#0b0e13] text-[#edf3ff]">
      <NavBar onNavigate={onNavigate} />

      <main className="flex justify-center px-4 pb-12 pt-[120px] sm:px-6">
        <section className="grid w-full max-w-[1100px] gap-5 lg:grid-cols-[2fr_1fr]">
          <article className="min-h-[420px] rounded-[20px] border border-white/10 bg-[#10141a]/80 p-6">
            <h1>Bem-vindo ao Resinly</h1>
          </article>

          <div className="grid gap-5">
            <article className="min-h-[200px] rounded-[20px] border border-white/10 bg-[#10141a]/80 p-6">
              <p className="mb-3 text-[0.72rem] uppercase tracking-[0.16em] text-[#b5c2d5]">
                Agenda
              </p>
              <h2 className="text-2xl font-semibold">Próximos passos</h2>
            </article>

            <article className="min-h-[200px] rounded-[20px] border border-white/10 bg-[#10141a]/80 p-6">
              <p className="mb-3 text-[0.72rem] uppercase tracking-[0.16em] text-[#b5c2d5]">
                Personagens
              </p>
              <h2 className="text-2xl font-semibold">Fichas em revisão</h2>
            </article>
          </div>
        </section>
      </main>
    </div>
  );
}
