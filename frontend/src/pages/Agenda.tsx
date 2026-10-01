import { useEffect, useMemo, useState, type FormEvent } from "react";
import NavBar from "../components/NavBar";
import { api, type Build, type WeekDay } from "../lib/api";
import {
  getCharacterImageUrl,
  getWeaponImageUrl,
} from "../utils/caracterImages";

type Page = "home" | "agenda" | "characters" | "weapons" | "login";

type AgendaEntry = {
  id: string;
  title: string;
  notes: string;
  priority: number;
  day: WeekDay;
  hour: string;
  characterName?: string;
  weaponName?: string;
  itemName: string;
};

const fallbackCharacters = [
  { id: "aether", name: "Aether" },
  { id: "albedo", name: "Albedo" },
  { id: "amber", name: "Amber" },
  { id: "ayaka", name: "Kamisato Ayaka" },
  { id: "barbara", name: "Barbara" },
  { id: "bennett", name: "Bennett" },
  { id: "diluc", name: "Diluc" },
  { id: "eula", name: "Eula" },
  { id: "ganyu", name: "Ganyu" },
  { id: "hu-tao", name: "Hu Tao" },
  { id: "jean", name: "Jean" },
  { id: "kaeya", name: "Kaeya" },
  { id: "kazuha", name: "Kaedehara Kazuha" },
  { id: "keqing", name: "Keqing" },
  { id: "mona", name: "Mona" },
  { id: "nahida", name: "Nahida" },
  { id: "qiqi", name: "Qiqi" },
  { id: "raiden-shogun", name: "Raiden Shogun" },
  { id: "venti", name: "Venti" },
  { id: "xiangling", name: "Xiangling" },
  { id: "xiao", name: "Xiao" },
  { id: "yae-miko", name: "Yae Miko" },
  { id: "yoimiya", name: "Yoimiya" },
  { id: "zhongli", name: "Zhongli" },
] as const;

const fallbackWeapons = [
  { id: "1", name: "Absolvição" },
  { id: "2", name: "Akuoumaru" },
  { id: "3", name: "Caçador do Beco" },
  { id: "4", name: "Lâmina Amenoma Kageuta" },
  { id: "5", name: "Arco de Amos" },
  { id: "6", name: "Os Sete Éditos da Poeira e Luz" },
  { id: "7", name: "Anotações do Aprendiz" },
  { id: "8", name: "Aqua Simulacra" },
  { id: "9", name: "Falcão" },
  { id: "10", name: "Cálice de Chifre Cinza Escarlate" },
  { id: "11", name: "Plumagem Escarlate do Abutre Astral" },
  { id: "12", name: "Chave da Transcendência" },
  { id: "13", name: "Corrupção Sombria" },
  { id: "14", name: "Mil Sóis Ardentes" },
  { id: "15", name: "Sonhos Flutuantes das Mil Noites" },
  { id: "16", name: "Azul Brilhante" },
  { id: "17", name: "Canção do Vasto Azul" },
  { id: "18", name: "Canção do Fiorde" },
  { id: "19", name: "Sinal dos Mares" },
  { id: "20", name: "Protetor de Iniciante" },
  { id: "21", name: "Ágata do Penhasco Obscuro" },
  { id: "22", name: "Espada do Penhasco Obscuro" },
  { id: "23", name: "Lança do Penhasco Obscuro" },
  { id: "24", name: "Foice do Penhasco Obscuro" },
  { id: "25", name: "Arco do Penhasco Obscuro" },
  { id: "26", name: "Lanterna do Tutano Preto" },
  { id: "27", name: "Borla Preta" },
  { id: "28", name: "Lâmina da Redenção" },
  { id: "29", name: "Ruínas Ensanguentadas" },
  { id: "30", name: "Espadão Sangrento" },
  { id: "31", name: "Calamidade de Eshu" },
  { id: "32", name: "Subjugadora de Calamidades" },
  { id: "33", name: "Supervisão de Caixa" },
  { id: "34", name: "Quebrador de Correntes" },
  { id: "35", name: "Haste de Cinábrio" },
  { id: "36", name: "Duelo de Reis" },
  { id: "37", name: "Tocador de Nuvens" },
  { id: "38", name: "Arco Composto" },
  { id: "39", name: "Lâmina Fria" },
  { id: "40", name: "Pacto do Gelo e Neve" },
  { id: "41", name: "Chamado Ecoante da Garça" },
  { id: "42", name: "Pique Crescente" },
  { id: "43", name: "Semblante da Lua Carmesim" },
  { id: "44", name: "Espada de Ferro Negro" },
  { id: "45", name: "Estrela Gelada" },
  { id: "46", name: "Lança do Duelo" },
  { id: "47", name: "Pacifista" },
  { id: "48", name: "Conversas dos Sábios do Deserto" },
  { id: "49", name: "Desastre e Remorso" },
  { id: "50", name: "Contos de Dodoco" },
  { id: "51", name: "Perdição do Dragão" },
  { id: "52", name: "Lança da Espinha do Dragão" },
  { id: "53", name: "Lâmina Sem Fio" },
  { id: "54", name: "Estremecedor da Terra" },
  { id: "55", name: "Ecos do Coração" },
  { id: "56", name: "Elegia do Suspiro Final" },
  { id: "57", name: "Fonte da Ignição" },
  { id: "58", name: "Orbe de Esmeralda" },
  { id: "59", name: "Águas Secas" },
  { id: "60", name: "Luz do Cortador de Grama" },
  { id: "61", name: "Lira do Tecedor da Luz" },
  { id: "62", name: "Fumetsu Gekka" },
  { id: "63", name: "Sabre da Ponta Estelar" },
  { id: "64", name: "Olho da Percepção" },
  { id: "65", name: "Crepúsculo Desvanecido" },
  { id: "66", name: "Presa do Rei da Montanha" },
  { id: "67", name: "Codex de Favonius" },
  { id: "68", name: "Grande Espada de Favonius" },
  { id: "69", name: "Lança de Favonius" },
  { id: "70", name: "Espada de Favonius" },
  { id: "71", name: "Arco de Favonius" },
  { id: "72", name: "Sombra de Ferro" },
  { id: "73", name: "Espada Pútrida" },
  { id: "74", name: "Lâmina de Filés" },
  { id: "75", name: "Epílogo das Profundezas" },
  { id: "76", name: "Forja da Sabedoria" },
  { id: "77", name: "Cruzamento de Fleuve Cendre" },
  { id: "78", name: "Penas Cercadas de Flores" },
  { id: "79", name: "Fluxo da Pureza" },
] as const;

const weekdayOrder: WeekDay[] = [
  "MONDAY",
  "TUESDAY",
  "WEDNESDAY",
  "THURSDAY",
  "FRIDAY",
  "SATURDAY",
  "SUNDAY",
];

const weekdayLabels: Record<WeekDay, string> = {
  MONDAY: "Segunda-feira",
  TUESDAY: "Terça-feira",
  WEDNESDAY: "Quarta-feira",
  THURSDAY: "Quinta-feira",
  FRIDAY: "Sexta-feira",
  SATURDAY: "Sábado",
  SUNDAY: "Domingo",
};

const timeSlots = ["08:00", "12:00", "15:00", "18:00", "21:00"];

const itemOptions = ["Cristais", "Relíquias", "Materiais para os personagens"];

const toAgendaEntry = (build: Build, index: number): AgendaEntry => ({
  id: build.id,
  title:
    build.title?.trim() ||
    (build.character && build.weapon
      ? `${build.character.name} + ${build.weapon.name}`
      : build.character?.name || build.weapon?.name || "Build salvo"),
  notes: build.notes ?? "",
  priority: build.priority ?? 1,
  day: build.day ?? "MONDAY",
  hour: timeSlots[index % timeSlots.length],
  characterName: build.character?.name ?? undefined,
  weaponName: build.weapon?.name ?? undefined,
  itemName: "Material do dia",
});

export default function Agenda({
  onNavigate,
}: {
  onNavigate: (p: Page) => void;
}) {
  const [agendaEntries, setAgendaEntries] = useState<AgendaEntry[]>([]);
  const [characters, setCharacters] = useState<{ id: string; name: string }[]>(
    [],
  );
  const [weapons, setWeapons] = useState<{ id: string; name: string }[]>([]);
  const [selectedCharacterId, setSelectedCharacterId] = useState("");
  const [selectedWeaponId, setSelectedWeaponId] = useState("");
  const [selectedItem, setSelectedItem] = useState(itemOptions[0]);
  const [selectedDay, setSelectedDay] = useState<WeekDay>("MONDAY");
  const [selectedHour, setSelectedHour] = useState(timeSlots[3]);
  const [title, setTitle] = useState("");
  const [notes, setNotes] = useState("");
  const [priority, setPriority] = useState("1");
  const [saveError, setSaveError] = useState("");

  const characterOptions =
    characters.length > 0 ? characters : fallbackCharacters;
  const weaponOptions = weapons.length > 0 ? weapons : fallbackWeapons;

  useEffect(() => {
    if (!selectedCharacterId && characterOptions.length > 0) {
      setSelectedCharacterId(characterOptions[0].id);
    }

    if (!selectedWeaponId && weaponOptions.length > 0) {
      setSelectedWeaponId(weaponOptions[0].id);
    }
  }, [characterOptions, selectedCharacterId, selectedWeaponId, weaponOptions]);

  const loadData = async () => {
    try {
      const [buildsData, charactersData, weaponsData] = await Promise.all([
        api.getBuilds(),
        api.getCharacters(),
        api.getWeapons(),
      ]);

      setCharacters(charactersData);
      setWeapons(weaponsData);
      setAgendaEntries(buildsData.map(toAgendaEntry));
    } catch (error) {
      console.error(error);
      setAgendaEntries([]);
    }
  };

  useEffect(() => {
    void loadData();
  }, []);

  const selectedCharacter =
    characterOptions.find(
      (character) => character.id === selectedCharacterId,
    ) ?? characterOptions[0];
  const selectedWeapon =
    weaponOptions.find((weapon) => weapon.id === selectedWeaponId) ??
    weaponOptions[0];

  const summaryTitle = useMemo(() => {
    if (title.trim()) {
      return title.trim();
    }

    if (selectedCharacter && selectedWeapon) {
      return `${selectedCharacter.name} + ${selectedWeapon.name}`;
    }

    if (selectedCharacter) {
      return selectedCharacter.name;
    }

    return "Novo registro";
  }, [selectedCharacter, selectedWeapon, title]);

  const calendarByDay = useMemo(
    () =>
      weekdayOrder.map((day) => ({
        day,
        entries: agendaEntries
          .filter((entry) => entry.day === day)
          .sort(
            (a, b) => timeSlots.indexOf(a.hour) - timeSlots.indexOf(b.hour),
          ),
      })),
    [agendaEntries],
  );

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!title.trim()) {
      setSaveError("Dê um nome ao build antes de registrar.");
      return;
    }

    if (!selectedCharacter || !selectedWeapon) {
      setSaveError("Selecione um personagem e uma arma válidos.");
      return;
    }

    setSaveError("");

    try {
      const createdBuild = await api.createBuild({
        title: title.trim(),
        notes: notes.trim() || undefined,
        priority: Number(priority) || 1,
        characterId: selectedCharacter.id,
        weaponId: selectedWeapon.id,
        day: selectedDay,
      });

      const createdEntry: AgendaEntry = {
        id: createdBuild.id,
        title: title.trim(),
        notes: notes.trim(),
        priority: Number(priority) || 1,
        day: selectedDay,
        hour: selectedHour,
        characterName: selectedCharacter.name,
        weaponName: selectedWeapon.name,
        itemName: selectedItem,
      };

      setAgendaEntries((current) => [createdEntry, ...current]);
      setTitle("");
      setNotes("");
      setPriority("1");
      setSelectedDay("MONDAY");
      setSelectedHour(timeSlots[3]);
      setSelectedItem(itemOptions[0]);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Não foi possível salvar.";
      setSaveError(message);
    }
  };

  const handleDelete = async (id: string) => {
    await api.deleteBuild(id);
    setAgendaEntries((current) => current.filter((entry) => entry.id !== id));
  };

  return (
    <div className="min-h-screen bg-[#0b0e13] text-[#edf3ff]">
      <NavBar onNavigate={onNavigate} />

      <main className="mx-auto flex w-full max-w-[1400px] flex-col gap-6 px-4 pb-12 pt-[120px] sm:px-6">
        <section className="rounded-[22px] border border-white/10 bg-[#10141a]/80 p-6 shadow-[0_24px_60px_rgba(0,0,0,0.3)]">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#a9c4ff]">
            Agenda de farm
          </p>
          <h1 className="mt-2 text-3xl font-semibold text-white">
            Registro de builds
          </h1>
        </section>

        <div className="grid gap-6 xl:grid-cols-[320px_minmax(0,1fr)_320px]">
          <aside className="rounded-[22px] border border-white/10 bg-[#10141a]/80 p-5">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-white">Seleção</h2>
              <span className="rounded-full border border-[#a9c4ff]/30 bg-[#a9c4ff]/10 px-2 py-1 text-[10px] uppercase tracking-[0.15em] text-[#dfe8ff]">
                Build
              </span>
            </div>

            <div className="mt-5 space-y-5">
              <label className="grid gap-2 text-sm text-[#b5c2d5]">
                Personagem
                <select
                  value={selectedCharacterId}
                  onChange={(event) =>
                    setSelectedCharacterId(event.target.value)
                  }
                  className="rounded-xl border border-white/10 bg-[#0b0e13] px-3 py-2.5 text-white outline-none focus:border-[#a9c4ff]"
                >
                  {characterOptions.map((character) => (
                    <option key={character.id} value={character.id}>
                      {character.name}
                    </option>
                  ))}
                </select>
              </label>

              <label className="grid gap-2 text-sm text-[#b5c2d5]">
                Arma
                <select
                  value={selectedWeaponId}
                  onChange={(event) => setSelectedWeaponId(event.target.value)}
                  className="rounded-xl border border-white/10 bg-[#0b0e13] px-3 py-2.5 text-white outline-none focus:border-[#a9c4ff]"
                >
                  {weaponOptions.map((weapon) => (
                    <option key={weapon.id} value={weapon.id}>
                      {weapon.name}
                    </option>
                  ))}
                </select>
              </label>

              <div className="rounded-2xl border border-white/10 bg-[#0b0e13]/70 p-3">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-white">
                    Seleção atual
                  </p>
                  <span className="text-xs text-[#a9c4ff]">{selectedItem}</span>
                </div>

                <div className="mt-3 flex items-center gap-3">
                  {selectedCharacter ? (
                    <img
                      src={getCharacterImageUrl(null, selectedCharacter.name)}
                      alt={selectedCharacter.name}
                      className="h-12 w-12 rounded-lg border border-white/10 object-cover"
                      onError={(event) => {
                        event.currentTarget.src = getCharacterImageUrl(
                          null,
                          selectedCharacter.name,
                        );
                      }}
                    />
                  ) : null}

                  {selectedWeapon ? (
                    <img
                      src={getWeaponImageUrl(null, selectedWeapon.name)}
                      alt={selectedWeapon.name}
                      className="h-12 w-12 rounded-lg border border-white/10 object-cover"
                      onError={(event) => {
                        event.currentTarget.src = getWeaponImageUrl(
                          null,
                          selectedWeapon.name,
                        );
                      }}
                    />
                  ) : null}
                </div>

                <p className="mt-3 text-sm text-[#dfe8ff]">
                  {selectedCharacter?.name ?? "Personagem"} ·{" "}
                  {selectedWeapon?.name ?? "Arma"}
                </p>
              </div>

              <div>
                <p className="mb-2 text-sm font-medium text-white">Itens</p>
                <div className="grid grid-cols-2 gap-2">
                  {itemOptions.map((item) => (
                    <button
                      key={item}
                      type="button"
                      onClick={() => setSelectedItem(item)}
                      className={[
                        "rounded-xl border px-2 py-2 text-left text-xs transition",
                        item === selectedItem
                          ? "border-[#a9c4ff]/60 bg-[#a9c4ff]/10 text-[#edf3ff]"
                          : "border-white/10 bg-[#0b0e13] text-[#b5c2d5] hover:border-white/20",
                      ].join(" ")}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          <section className="rounded-[22px] border border-white/10 bg-[#10141a]/80 p-5">
            <div className="flex flex-col gap-4 border-b border-white/10 pb-4 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-[#a9c4ff]">
                  Registro atual
                </p>
                <h2 className="mt-1 text-2xl font-semibold text-white">
                  {summaryTitle}
                </h2>
              </div>

              <div className="rounded-full border border-[#a9c4ff]/30 bg-[#a9c4ff]/10 px-3 py-1.5 text-sm text-[#dfe8ff]">
                {weekdayLabels[selectedDay]} · {selectedHour}
              </div>
            </div>

            <form onSubmit={handleSubmit} className="mt-5 space-y-4">
              {saveError ? (
                <p className="rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-200">
                  {saveError}
                </p>
              ) : null}

              <div className="grid gap-4 md:grid-cols-2">
                <label className="grid gap-2 text-sm text-[#b5c2d5]">
                  Nome do build
                  <input
                    value={title}
                    onChange={(event) => setTitle(event.target.value)}
                    className="rounded-xl border border-white/10 bg-[#0b0e13] px-3 py-2.5 text-white outline-none focus:border-[#a9c4ff]"
                    placeholder="Ex.: Farm de Hu Tao"
                  />
                </label>

                <label className="grid gap-2 text-sm text-[#b5c2d5]">
                  Prioridade
                  <select
                    value={priority}
                    onChange={(event) => setPriority(event.target.value)}
                    className="rounded-xl border border-white/10 bg-[#0b0e13] px-3 py-2.5 text-white outline-none focus:border-[#a9c4ff]"
                  >
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                  </select>
                </label>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <label className="grid gap-2 text-sm text-[#b5c2d5]">
                  Dia
                  <select
                    value={selectedDay}
                    onChange={(event) =>
                      setSelectedDay(event.target.value as WeekDay)
                    }
                    className="rounded-xl border border-white/10 bg-[#0b0e13] px-3 py-2.5 text-white outline-none focus:border-[#a9c4ff]"
                  >
                    {weekdayOrder.map((day) => (
                      <option key={day} value={day}>
                        {weekdayLabels[day]}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="grid gap-2 text-sm text-[#b5c2d5]">
                  Hora
                  <select
                    value={selectedHour}
                    onChange={(event) => setSelectedHour(event.target.value)}
                    className="rounded-xl border border-white/10 bg-[#0b0e13] px-3 py-2.5 text-white outline-none focus:border-[#a9c4ff]"
                  >
                    {timeSlots.map((hour) => (
                      <option key={hour} value={hour}>
                        {hour}
                      </option>
                    ))}
                  </select>
                </label>

                <div className="rounded-2xl border border-white/10 bg-[#0b0e13]/65 p-3 text-sm text-[#dfe8ff]">
                  <p className="text-[#b5c2d5]">Item</p>
                  <p className="mt-2 font-medium text-white">{selectedItem}</p>
                </div>
              </div>

              <label className="grid gap-2 text-sm text-[#b5c2d5]">
                Observações
                <textarea
                  value={notes}
                  onChange={(event) => setNotes(event.target.value)}
                  className="min-h-[120px] rounded-xl border border-white/10 bg-[#0b0e13] px-3 py-2.5 text-white outline-none focus:border-[#a9c4ff]"
                  placeholder="Detalhes do farm, materiais ou meta de prioridade."
                />
              </label>

              <div className="flex justify-end">
                <button
                  type="submit"
                  className="rounded-xl bg-[#a9c4ff] px-5 py-2.5 font-medium text-[#0b0e13] transition hover:opacity-90"
                >
                  Registrar no calendário
                </button>
              </div>
            </form>

            <div className="mt-6 border-t border-white/10 pt-5">
              <div className="mb-3 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-white">
                  Builds registrados
                </h3>
                <span className="text-sm text-[#b5c2d5]">
                  {agendaEntries.length} itens
                </span>
              </div>

              <div className="space-y-3">
                {agendaEntries.length === 0 ? (
                  <p className="rounded-xl border border-dashed border-white/10 p-4 text-sm text-[#b5c2d5]">
                    Nenhum build registrado ainda.
                  </p>
                ) : (
                  agendaEntries.map((entry) => (
                    <article
                      key={entry.id}
                      className="rounded-2xl border border-white/10 bg-[#0b0e13]/70 p-4"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-base font-semibold text-white">
                            {entry.title}
                          </p>
                          <p className="mt-1 text-xs uppercase tracking-[0.15em] text-[#a9c4ff]">
                            {weekdayLabels[entry.day]} · {entry.hour} ·
                            prioridade {entry.priority}
                          </p>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleDelete(entry.id)}
                          className="rounded-lg border border-red-400/30 px-2 py-1 text-xs text-red-200 hover:bg-red-500/10"
                        >
                          Excluir
                        </button>
                      </div>

                      <div className="mt-3 flex flex-wrap gap-2 text-xs text-[#dfe8ff]">
                        {entry.characterName ? (
                          <span className="rounded-full border border-white/10 bg-white/5 px-2 py-1">
                            {entry.characterName}
                          </span>
                        ) : null}
                        {entry.weaponName ? (
                          <span className="rounded-full border border-white/10 bg-white/5 px-2 py-1">
                            {entry.weaponName}
                          </span>
                        ) : null}
                        <span className="rounded-full border border-white/10 bg-white/5 px-2 py-1">
                          {entry.itemName}
                        </span>
                      </div>

                      {entry.notes ? (
                        <p className="mt-3 text-sm text-[#b5c2d5]">
                          {entry.notes}
                        </p>
                      ) : null}
                    </article>
                  ))
                )}
              </div>
            </div>
          </section>

          <aside className="rounded-[22px] border border-white/10 bg-[#10141a]/80 p-5">
            <h2 className="text-lg font-semibold text-white">Calendário</h2>

            <div className="mt-4 space-y-3">
              {calendarByDay.map(({ day, entries }) => (
                <div
                  key={day}
                  className="rounded-2xl border border-white/10 bg-[#0b0e13]/70 p-3"
                >
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold text-white">
                      {weekdayLabels[day]}
                    </p>
                    <span className="text-[10px] uppercase tracking-[0.18em] text-[#b5c2d5]">
                      {entries.length} item(s)
                    </span>
                  </div>

                  <div className="mt-3 space-y-2">
                    {entries.length === 0 ? (
                      <p className="text-xs text-[#6c7d99]">Sem registros</p>
                    ) : (
                      entries.map((entry) => (
                        <div
                          key={`${day}-${entry.id}-${entry.hour}`}
                          className="rounded-xl border border-[#a9c4ff]/20 bg-[#a9c4ff]/5 p-2"
                        >
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-[11px] font-semibold text-[#dfe8ff]">
                              {entry.hour}
                            </span>
                            <span className="text-[10px] uppercase tracking-[0.12em] text-[#a9c4ff]">
                              P{entry.priority}
                            </span>
                          </div>
                          <p className="mt-1 text-sm font-medium text-white">
                            {entry.title}
                          </p>
                          <p className="text-[11px] text-[#b5c2d5]">
                            {entry.characterName ?? "Personagem"} ·{" "}
                            {entry.itemName}
                          </p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              ))}
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}
