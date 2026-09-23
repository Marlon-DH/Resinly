import { useEffect, useState } from "react";
import EntityCard from "../components/Card";
import LeftBar from "../components/LeftBar";
import { getCharactersWithMaterials } from "../services/game-data";
import type { DatabaseCharacter, DatabaseMaterial } from "../types/game";

type PersonagensProps = {
  onNavigate: (page: "agenda" | "characters" | "weapons") => void;
};

type CharacterWithMaterials = DatabaseCharacter & {
  character_materials?: Array<{
    material: DatabaseMaterial | DatabaseMaterial[] | null;
  }>;
};

function Personagens({ onNavigate }: PersonagensProps) {
  const [characters, setCharacters] = useState<CharacterWithMaterials[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCharactersWithMaterials()
      .then(setCharacters)
      .finally(() => setLoading(false));
  }, []);

  const [search, setSearch] = useState("");

    const filteredCharacters = characters.filter((character) =>
    `${character.name} ${character.element} ${character.weapon_type ?? ""}`
        .toLocaleLowerCase()
        .includes(search.toLocaleLowerCase()),
    );

  return (
    <div className="app-shell">
      <LeftBar section="characters" onSectionChange={onNavigate} />

      <main className="content">
        <header className="topbar">
          <div>
            <p className="eyebrow">BANCO DE DADOS</p>
            <h1>Personagens</h1>
          </div>
        </header>

        <input
        className="search-input"
        type="search"
        placeholder="Pesquisar personagem..."
        value={search}
        onChange={(event) => setSearch(event.target.value)}
        />

        {loading ? (
          <p className="notice">Carregando personagens...</p>
        ) : (
          <section className="entity-grid">
            {filteredCharacters.map((character) => {
              const materials =
                character.character_materials
                  ?.map((relation) =>
                    Array.isArray(relation.material)
                      ? relation.material
                      : relation.material
                        ? [relation.material]
                        : [],
                  )
                  .flat() ?? [];

              return (
                <EntityCard
                entityType="character"
                key={character.id}
                name={character.name}
                imageUrl={character.image_url}
                subtitle={`${character.element} · ${character.weapon_type ?? "Arma não informada"}`}
                materials={materials}
                />
              );
            })}
          </section>
        )}
      </main>
    </div>
  );
}

export default Personagens;