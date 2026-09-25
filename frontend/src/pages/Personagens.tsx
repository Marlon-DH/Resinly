import { useEffect, useState } from "react";
import NavBar from "../components/NavBar";
import { api, type Character } from "../lib/api";

type Page = "home" | "agenda" | "characters" | "weapons";

const initialForm = {
  name: "",
  element: "",
  rarity: "5",
  imageUrl: "",
};

export default function Personagens({
  onNavigate,
}: {
  onNavigate: (p: Page) => void;
}) {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const loadCharacters = async () => {
    try {
      const data = await api.getCharacters();
      setCharacters(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Erro ao carregar personagens.",
      );
    }
  };

  useEffect(() => {
    void loadCharacters();
  }, []);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      await api.createCharacter({
        name: form.name,
        element: form.element || undefined,
        rarity: Number(form.rarity) || undefined,
        imageUrl: form.imageUrl || undefined,
      });

      setForm(initialForm);
      await loadCharacters();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Erro ao criar personagem.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await api.deleteCharacter(id);
      await loadCharacters();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Erro ao excluir personagem.",
      );
    }
  };

  return (
    <div className="min-h-screen bg-[#0b0e13] text-[#edf3ff]">
      <NavBar onNavigate={onNavigate} />

      <main className="mx-auto flex w-full max-w-[1200px] flex-col gap-6 px-4 pb-12 pt-[120px] sm:px-6">
        <section className="rounded-[20px] border border-white/10 bg-[#10141a]/80 p-6">
          <h1 className="text-3xl font-semibold">Personagens</h1>
          <p className="mt-2 text-[#b5c2d5]">
            Cadastre os personagens que você quer farmar.
          </p>
        </section>

        <section className="grid gap-6 lg:grid-cols-[1.1fr_2fr]">
          <form
            onSubmit={handleSubmit}
            className="rounded-[20px] border border-white/10 bg-[#10141a]/80 p-6"
          >
            <h2 className="mb-4 text-xl font-semibold">Adicionar personagem</h2>

            <div className="grid gap-4">
              <label className="grid gap-2 text-sm text-[#b5c2d5]">
                Nome
                <input
                  value={form.name}
                  onChange={(event) =>
                    setForm({ ...form, name: event.target.value })
                  }
                  className="rounded-xl border border-white/10 bg-[#0b0e13] px-3 py-2 text-white outline-none focus:border-[#a9c4ff]"
                  placeholder="Ex: Hu Tao"
                  required
                />
              </label>

              <div className="grid gap-4 sm:grid-cols-2">
                <label className="grid gap-2 text-sm text-[#b5c2d5]">
                  Elemento
                  <input
                    value={form.element}
                    onChange={(event) =>
                      setForm({ ...form, element: event.target.value })
                    }
                    className="rounded-xl border border-white/10 bg-[#0b0e13] px-3 py-2 text-white outline-none focus:border-[#a9c4ff]"
                    placeholder="Pyro"
                  />
                </label>

                <label className="grid gap-2 text-sm text-[#b5c2d5]">
                  Rareza
                  <select
                    value={form.rarity}
                    onChange={(event) =>
                      setForm({ ...form, rarity: event.target.value })
                    }
                    className="rounded-xl border border-white/10 bg-[#0b0e13] px-3 py-2 text-white outline-none focus:border-[#a9c4ff]"
                  >
                    <option value="5">5⭐</option>
                    <option value="4">4⭐</option>
                    <option value="3">3⭐</option>
                  </select>
                </label>
              </div>

              <label className="grid gap-2 text-sm text-[#b5c2d5]">
                URL da imagem
                <input
                  value={form.imageUrl}
                  onChange={(event) =>
                    setForm({ ...form, imageUrl: event.target.value })
                  }
                  className="rounded-xl border border-white/10 bg-[#0b0e13] px-3 py-2 text-white outline-none focus:border-[#a9c4ff]"
                  placeholder="https://..."
                />
              </label>

              {error ? <p className="text-sm text-red-300">{error}</p> : null}

              <button
                type="submit"
                disabled={loading}
                className="rounded-xl bg-[#a9c4ff] px-4 py-3 font-medium text-[#0b0e13] transition hover:opacity-90 disabled:opacity-60"
              >
                {loading ? "Salvando..." : "Salvar personagem"}
              </button>
            </div>
          </form>

          <div className="rounded-[20px] border border-white/10 bg-[#10141a]/80 p-6">
            <h2 className="mb-4 text-xl font-semibold">Lista de personagens</h2>

            <div className="grid gap-3">
              {characters.length === 0 ? (
                <p className="text-[#b5c2d5]">
                  Nenhum personagem cadastrado ainda.
                </p>
              ) : (
                characters.map((character) => (
                  <div
                    key={character.id}
                    className="flex items-center justify-between gap-3 rounded-[14px] border border-white/10 bg-white/[0.02] p-3"
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-11 w-11 overflow-hidden rounded-full bg-white/5">
                        {character.imageUrl ? (
                          <img
                            src={character.imageUrl}
                            alt={character.name}
                            className="h-full w-full object-cover"
                          />
                        ) : null}
                      </div>
                      <div>
                        <p className="font-medium">{character.name}</p>
                        <p className="text-sm text-[#b5c2d5]">
                          {character.element ?? "Elemento não informado"} ·{" "}
                          {character.rarity ?? 0}⭐
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleDelete(character.id)}
                      className="rounded-lg border border-red-400/40 px-2 py-1 text-sm text-red-200 hover:bg-red-500/10"
                    >
                      Excluir
                    </button>
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
