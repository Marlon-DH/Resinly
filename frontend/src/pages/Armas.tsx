import { useEffect, useState } from "react";
import EntityCard from "../components/Card";
import LeftBar from "../components/LeftBar";
import { getWeaponsWithMaterials } from "../services/game-data";
import type { DatabaseMaterial, DatabaseWeapon } from "../types/game";

type ArmasProps = {
  onNavigate: (page: "agenda" | "characters" | "weapons") => void;
};

type WeaponWithMaterials = DatabaseWeapon & {
  weapon_materials?: Array<{
    material: DatabaseMaterial | DatabaseMaterial[] | null;
  }>;
};

function Armas({ onNavigate }: ArmasProps) {
  const [weapons, setWeapons] = useState<WeaponWithMaterials[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getWeaponsWithMaterials()
      .then(setWeapons)
      .finally(() => setLoading(false));
  }, []);

    const [search, setSearch] = useState("");

    const filteredWeapons = weapons.filter((weapon) =>
    `${weapon.name} ${weapon.type}`
        .toLocaleLowerCase()
        .includes(search.toLocaleLowerCase()),
    );

  return (
    <div className="app-shell">
      <LeftBar section="weapons" onSectionChange={onNavigate} />

      <main className="content">
        <header className="topbar">
          <div>
            <p className="eyebrow">BANCO DE DADOS</p>
            <h1>Armas</h1>
          </div>
        </header>

        <input
        className="search-input"
        type="search"
        placeholder="Pesquisar arma..."
        value={search}
        onChange={(event) => setSearch(event.target.value)}
        />

        {loading ? (
          <p className="notice">Carregando armas...</p>
        ) : (
          <section className="entity-grid">
            {filteredWeapons.map((weapon) => {
              const materials =
                weapon.weapon_materials
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
                    entityType="weapon"
                    key={weapon.id}
                    name={weapon.name}
                    imageUrl={weapon.image_url}
                    subtitle={weapon.type}
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

export default Armas;