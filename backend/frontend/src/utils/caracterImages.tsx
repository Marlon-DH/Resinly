const fallbackImage = (name: string) =>
  `https://placehold.co/240x240/f1edf8/8b8495?text=${encodeURIComponent(name)}`;

function getFileName(imageUrl: string | null): string | null {
  if (!imageUrl) return null;

  const fileName = imageUrl.split("/").pop()?.split("?")[0];
  return fileName || null;
}

export function getCharacterImageUrl(
  imageUrl: string | null,
  name: string,
): string {
  const fileName = getFileName(imageUrl);

  return fileName
    ? `https://enka.network/ui/${fileName}`
    : fallbackImage(name);
}

export function getWeaponImageUrl(
  imageUrl: string | null,
  name: string,
): string {
  const fileName = getFileName(imageUrl);

  return fileName
    ? `https://enka.network/ui/${fileName}`
    : fallbackImage(name);
}

export { fallbackImage };