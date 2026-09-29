import {
  getCharacterImageUrl,
  getWeaponImageUrl,
} from "../utils/caracterImages";

type EntityCardProps = {
  kind: "character" | "weapon";
  name: string;
  title?: string | null;
  imageUrl?: string | null;
  rarity?: number | null;
  element?: string | null;
  type?: string | null;
};

export default function EntityCard({
  kind,
  name,
  title,
  imageUrl,
  rarity,
  element,
  type,
}: EntityCardProps) {
  const resolvedImage =
    kind === "character"
      ? getCharacterImageUrl(imageUrl ?? null, name)
      : getWeaponImageUrl(imageUrl ?? null, name);

  const tags = [element, type].filter((value): value is string =>
    Boolean(value),
  );

  return (
    <article className="overflow-hidden rounded-2xl border border-white/10 bg-[#10141a] shadow-[0_10px_30px_rgba(15,23,42,0.25)] transition duration-200 hover:border-[#a9c4ff]/40 hover:-translate-y-0.5">
      <div className="flex items-center gap-4 p-4">
        <div className="h-20 w-20 shrink-0 overflow-hidden rounded-xl border border-white/10 bg-[#171e29]">
          <img
            src={resolvedImage}
            alt={name}
            loading="lazy"
            className="h-full w-full object-cover"
            onError={(event) => {
              event.currentTarget.src =
                kind === "character"
                  ? getCharacterImageUrl(null, name)
                  : getWeaponImageUrl(null, name);
            }}
          />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h3 className="truncate text-lg font-semibold text-white">
                {name}
              </h3>
              {title && (
                <p className="mt-1 truncate text-sm text-[#b5c2d5]">{title}</p>
              )}
            </div>

            {rarity && rarity > 0 && (
              <span
                className="shrink-0 text-sm text-amber-300"
                aria-label={`${rarity} estrelas`}
                title={`${rarity} estrelas`}
              >
                {"★".repeat(Math.min(rarity, 5))}
              </span>
            )}
          </div>

          {tags.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {tags.map((tag) => (
                <span
                  key={`${name}-${tag}`}
                  className="rounded-md bg-white/5 px-2.5 py-1 text-[11px] font-medium text-[#d5deee]"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </article>
  );
}
