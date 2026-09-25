import { useEffect, useState } from "react";
import NavBar from "../components/NavBar";
import { api, type Build } from "../lib/api";

type Page = "home" | "agenda" | "characters" | "weapons";

export default function Agenda({
  onNavigate,
}: {
  onNavigate: (p: Page) => void;
}) {
  const [builds, setBuilds] = useState<Build[]>([]);
  const [form, setForm] = useState({
    title: "",
    notes: "",
    priority: "1",
    characterId: "",
    weaponId: "",
  });
  const [characters, setCharacters] = useState<{ id: string; name: string }[]>(
    [],
  );
  const [weapons, setWeapons] = useState<{ id: string; name: string }[]>([]);

  const loadData = async () => {
    try {
      const [buildsData, charactersData, weaponsData] = await Promise.all([
        api.getBuilds(),
        api.getCharacters(),
        api.getWeapons(),
      ]);

      setBuilds(buildsData);
      setCharacters(charactersData);
      setWeapons(weaponsData);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    void loadData();
  }, []);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    await api.createBuild({
      title: form.title,
      notes: form.notes || undefined,
      priority: Number(form.priority) || 1,
      characterId: form.characterId || null,
      weaponId: form.weaponId || null,
    });

    setForm({
      title: "",
      notes: "",
      priority: "1",
      characterId: "",
      weaponId: "",
    });

    await loadData();
  };

  const handleDelete = async (id: string) => {
    await api.deleteBuild(id);
    await loadData();
  };

  return (
    <div className="min-h-screen bg-[#0b0e13] text-[#edf3ff]">
      <NavBar onNavigate={onNavigate} />

      <main className="mx-auto flex w-full max-w-[1200px] flex-col gap-6 px-4 pb-12 pt-[120px] sm:px-6">
        <section className="rounded-[20px] border border-white/10 bg-[#10141a]/80 p-6">
          <h1 className="text-3xl font-semibold">Agenda de farm</h1>
          <p className="mt-2 text-[#b5c2d5]">
            Crie builds para personagens e armas que precisam de atenção.
          </p>
        </section>

        <section className="grid gap-6 lg:grid-cols-[1.1fr_2fr]">
          <form
            onSubmit={handleSubmit}
            className="rounded-[20px] border border-white/10 bg-[#10141a]/80 p-6"
          >
            <h2 className="mb-4 text-xl font-semibold">Novo build</h2>

            <div className="grid gap-4">
              <label className="grid gap-2 text-sm text-[#b5c2d5]">
                Título
                <input
                  value={form.title}
                  onChange={(event) =>
                    setForm({ ...form, title: event.target.value })
                  }
                  className="rounded-xl border border-white/10 bg-[#0b0e13] px-3 py-2 text-white outline-none focus:border-[#a9c4ff]"
                  placeholder="Ex: Hu Tao — farm de armas"
                  required
                />
              </label>

              <label className="grid gap-2 text-sm text-[#b5c2d5]">
                Observações
                <textarea
                  value={form.notes}
                  onChange={(event) =>
                    setForm({ ...form, notes: event.target.value })
                  }
                  className="min-h-[90px] rounded-xl border border-white/10 bg-[#0b0e13] px-3 py-2 text-white outline-none focus:border-[#a9c4ff]"
                  placeholder="Anotações do build"
                />
              </label>

              <div className="grid gap-4 sm:grid-cols-2">
                <label className="grid gap-2 text-sm text-[#b5c2d5]">
                  Prioridade
                  <select
                    value={form.priority}
                    onChange={(event) =>
                      setForm({ ...form, priority: event.target.value })
                    }
                    className="rounded-xl border border-white/10 bg-[#0b0e13] px-3 py-2 text-white outline-none focus:border-[#a9c4ff]"
                  >
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                  </select>
                </label>

                <label className="grid gap-2 text-sm text-[#b5c2d5]">
                  Personagem
                  <select
                    value={form.characterId}
                    onChange={(event) =>
                      setForm({ ...form, characterId: event.target.value })
                    }
                    className="rounded-xl border border-white/10 bg-[#0b0e13] px-3 py-2 text-white outline-none focus:border-[#a9c4ff]"
                  >
                    <option value="">Selecione</option>
                    {characters.map((character) => (
                      <option key={character.id} value={character.id}>
                        {character.name}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              <label className="grid gap-2 text-sm text-[#b5c2d5]">
                Arma
                <select
                  value={form.weaponId}
                  onChange={(event) =>
                    setForm({ ...form, weaponId: event.target.value })
                  }
                  className="rounded-xl border border-white/10 bg-[#0b0e13] px-3 py-2 text-white outline-none focus:border-[#a9c4ff]"
                >
                  <option value="">Selecione</option>
                  {weapons.map((weapon) => (
                    <option key={weapon.id} value={weapon.id}>
                      {weapon.name}
                    </option>
                  ))}
                </select>
              </label>

              <button
                type="submit"
                className="rounded-xl bg-[#a9c4ff] px-4 py-3 font-medium text-[#0b0e13] transition hover:opacity-90"
              >
                Salvar build
              </button>
            </div>
          </form>

          <div className="rounded-[20px] border border-white/10 bg-[#10141a]/80 p-6">
            <h2 className="mb-4 text-xl font-semibold">Builds cadastrados</h2>

            <div className="grid gap-3">
              {builds.length === 0 ? (
                <p className="text-[#b5c2d5]">Nenhum build cadastrado ainda.</p>
              ) : (
                builds.map((build) => (
                  <div
                    key={build.id}
                    className="rounded-[14px] border border-white/10 bg-white/[0.02] p-3"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="font-medium">{build.title}</p>
                        <p className="text-sm text-[#b5c2d5]">
                          Prioridade: {build.priority} · Personagem:{" "}
                          {build.character?.name ?? "—"} · Arma:{" "}
                          {build.weapon?.name ?? "—"}
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleDelete(build.id)}
                        className="rounded-lg border border-red-400/40 px-2 py-1 text-sm text-red-200 hover:bg-red-500/10"
                      >
                        Excluir
                      </button>
                    </div>

                    {build.notes ? (
                      <p className="mt-3 text-sm text-[#dfe8ff]">
                        {build.notes}
                      </p>
                    ) : null}
                  </div>
                ))
              )}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
