export type HomeChapter = {
  id: string;
  eyebrow: string;
  title: string;
  summary: string;
};

export const TICKER_TAGS = [
  "WebGL",
  "React",
  "Three.js",
  "Motion",
  "Next.js",
  "TypeScript",
  "GLSL",
  "GSAP",
  "Clarté",
  "Structure",
  "Vision produit",
  "Performance",
];

export const HOME_CHAPTERS: HomeChapter[] = [
  {
    id: "CH-01",
    eyebrow: "Position",
    title: "Percevoir, structurer, faire durer",
    summary:
      "Cadrage du message, design système et code Next.js — pour un site clair et tenable dans le temps.",
  },
  {
    id: "CH-02",
    eyebrow: "Mouvement",
    title: "Révéler plutôt qu’encombrer",
    summary:
      "Animations et transitions guident le regard vers l’info utile, pas vers l’effet gratuit.",
  },
  {
    id: "CH-03",
    eyebrow: "Performance",
    title: "Un rendu premium qui reste rapide",
    summary:
      "DA ambitieuse avec budgets WebGL maîtrisés, CWV suivis et livrables mesurables.",
  },
];

/** URL du showreel (Vimeo, YouTube, ou fichier vidéo). Vide = bouton scroll vers contact */
export const REEL_VIDEO_URL = "";
