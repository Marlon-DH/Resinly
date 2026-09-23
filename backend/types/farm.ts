export type FarmDay = "Seg" | "Ter" | "Qua" | "Qui" | "Sex" | "Sáb" | "Dom";

export type FarmItem = {
  name: string;
  days: FarmDay[];
  kind: "Talento" | "Arma" | "Inimigo" | "Chefe semanal";
  icon: string;
};
