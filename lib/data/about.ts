export type Stat = {
  value: string | number;
  label: string;
  suffix?: string;
  /** Périmètre ou méthode — courte phrase sous le libellé */
  context?: string;
};

export const STATS: Stat[] = [
  {
    value: 15,
    suffix: "+",
    label: "projets livrés",
    context: "Depuis 2024 — clients et chantiers internes du studio.",
  },
  {
    value: 97,
    suffix: "+",
    label: "score Lighthouse (mobile)",
    context: "Médiane sur nos 3 études de cas publiées — mesure locale PSI.",
  },
  {
    value: 3,
    label: "études de cas",
    context: "Récits projet détaillés sur ce site.",
  },
];

export type AboutTableRow = {
  label: string;
  value: string;
  isStatus?: boolean;
};

export const ABOUT_TABLE: AboutTableRow[] = [
  { label: "Fondée", value: "2024" },
  { label: "Localisation", value: "Lannion · Bretagne, France" },
  { label: "Équipe", value: "Studio indépendant" },
  { label: "Stack", value: "Next.js · Three.js · TypeScript" },
  { label: "Statut", value: "Ouvert aux devis", isStatus: true },
];

export type AboutDnaRow = {
  index: string;
  key: string;
  value: string;
  isLive?: boolean;
};

export const ABOUT_DNA_TABLE: AboutDnaRow[] = [
  { index: "00", key: "Fondée", value: "2024" },
  { index: "01", key: "Localisation", value: "Lannion · Bretagne, France" },
  { index: "02", key: "Format", value: "Studio indépendant" },
  { index: "03", key: "Stack", value: "Next.js · Three.js · TypeScript" },
  { index: "04", key: "Spécialité", value: "Web · UI/UX · WebGL" },
  { index: "05", key: "Statut", value: "Ouvert aux devis", isLive: true },
];

export type AboutGridCell = {
  id: string;
  title: string;
  body: string;
};

export const ABOUT_GRID_CELLS: AboutGridCell[] = [
  {
    id: "03.1",
    title: "Design\nd'auteur",
    body: "Aucun template. Chaque projet est conçu de zéro, pour vous, pour toujours.",
  },
  {
    id: "03.2",
    title: "Code de\nproduction",
    body: "Next.js · TypeScript · architecture scalable dès le départ. Pas de dette technique.",
  },
  {
    id: "03.3",
    title: "WebGL\n& 3D",
    body: "Three.js, shaders GLSL. Quand le projet justifie l'immersion, on crée l'immersion.",
  },
  {
    id: "03.4",
    title: "Obsession\ndu détail",
    body: "Les micro-interactions, les transitions, les 8px qui font la différence entre bon et exceptionnel.",
  },
];
