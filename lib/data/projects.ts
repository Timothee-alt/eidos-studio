export type Project = {
  id: string;
  slug?: string;
  title: string;
  client?: string;
  description: string;
  tags: string[];
  href: string;
  image?: string;
};

export type ProjectSlide = Project & {
  /** Titre avec saut de ligne (ex: ["Lannion", "Twirling Club"]) */
  titleLines?: [string, string];
  /** Couleur hex pour accent (--pc) */
  hex: string;
  /** Ken Burns: transform initial */
  kbFrom: string;
  /** Ken Burns: transform final */
  kbTo: string;
  /** Ken Burns: durée en secondes */
  kbDur: number;
  /** Gradient overlay CSS */
  grad: string;
  /** Countup: valeur numérique */
  resRaw: number;
  /** Countup: préfixe (ex: "~", "+") */
  resPrefix: string;
  /** Countup: suffixe (ex: "h", "%", "+") */
  resSuffix: string;
  /** Countup: label */
  resLabel: string;
  /** Countup: step pour animation */
  resStep: number;
  /** CSS gradient fallback when no image */
  gradientBg?: string;
};

export const PROJECT_SLIDES: ProjectSlide[] = [
  {
    id: "PRJ-01",
    slug: "eidos-ia",
    title: "Eidos IA",
    client: "Automatisation métier · IA appliquée",
    description:
      "Cartographie des tâches hors outils, base de connaissances centralisée, automatisation des flux répétitifs, tableaux de bord temps réel.",
    tags: ["Next.js", "IA", "Automatisation"],
    href: "/projets/eidos-ia",
    image: "",
    hex: "#3b7bff",
    kbFrom: "scale(1.10) translate(0px,0px)",
    kbTo: "scale(1.01) translate(-8px,-4px)",
    kbDur: 16,
    grad: "linear-gradient(to top, rgba(5,5,7,0.94) 0%, rgba(5,5,7,0.5) 40%, rgba(5,5,7,0.08) 70%, transparent 100%)",
    resRaw: 12,
    resPrefix: "~",
    resSuffix: "h",
    resLabel: "gagnées / semaine",
    resStep: 0.5,
    gradientBg: "radial-gradient(ellipse at 30% 40%, rgba(59,123,255,0.18) 0%, transparent 60%), radial-gradient(ellipse at 70% 80%, rgba(59,123,255,0.10) 0%, transparent 50%), linear-gradient(160deg, #0a0a12 0%, #050507 100%)",
  },
  {
    id: "PRJ-02",
    slug: "lannion-twirling-club",
    title: "Club Sportif · Lannion",
    titleLines: ["Club Sportif", "Lannion"],
    client: "Association sportive · Lannion",
    description:
      "Nous avons clarifié ce que les familles cherchent en premier : inscriptions simples, actus lisibles et visibilité locale sur Google — le tout en mobile fluide.",
    tags: ["Site vitrine", "SEO local", "Performance"],
    href: "/projets/lannion-twirling-club",
    image: "",
    hex: "#a78bfa",
    kbFrom: "scale(1.08) translate(6px,0px)",
    kbTo: "scale(1.01) translate(-4px,-6px)",
    kbDur: 20,
    grad: "linear-gradient(160deg, rgba(5,5,7,0.88) 0%, rgba(5,5,7,0.45) 45%, rgba(5,5,7,0.08) 75%, transparent 100%)",
    resRaw: 95,
    resPrefix: "",
    resSuffix: "+",
    resLabel: "Performance mobile",
    resStep: 2,
    gradientBg: "radial-gradient(ellipse at 60% 30%, rgba(167,139,250,0.15) 0%, transparent 55%), radial-gradient(ellipse at 20% 70%, rgba(167,139,250,0.08) 0%, transparent 50%), linear-gradient(200deg, #0c0a14 0%, #050507 100%)",
  },
  {
    id: "PRJ-03",
    slug: "les-sens-de-lharmonie",
    title: "Les Sens de l'Harmonie",
    titleLines: ["Les Sens", "de l'Harmonie"],
    client: "Bien-être · Accompagnement",
    description:
      "Offre haut de gamme peu lisible : refonte pour clarifier la proposition, raccourcir le parcours et aligner UI, motion et contenus.",
    tags: ["Branding digital", "Conversion", "Motion"],
    href: "/projets/les-sens-de-lharmonie",
    image: "",
    hex: "#34d399",
    kbFrom: "scale(1.12) translate(-6px,4px)",
    kbTo: "scale(1.02) translate(4px,-4px)",
    kbDur: 18,
    grad: "linear-gradient(to top, rgba(5,5,7,0.96) 0%, rgba(5,5,7,0.6) 30%, rgba(5,5,7,0.15) 60%, rgba(5,5,7,0.05) 100%)",
    resRaw: 60,
    resPrefix: "+",
    resSuffix: "%",
    resLabel: "Demandes de contact",
    resStep: 3,
    gradientBg: "radial-gradient(ellipse at 40% 60%, rgba(52,211,153,0.14) 0%, transparent 55%), radial-gradient(ellipse at 80% 20%, rgba(52,211,153,0.07) 0%, transparent 50%), linear-gradient(170deg, #060b0a 0%, #050507 100%)",
  },
];

export const PROJECTS: Project[] = [
  {
    id: "PRJ-01",
    slug: "eidos-ia",
    title: "Eidos IA",
    client: "Automatisation métier · IA appliquée",
    description:
      "Cartographie du temps perdu hors outils, centralisation des savoirs, automatisation des tâches répétitives, pilotage en temps réel.",
    tags: ["Next.js", "IA", "Automatisation", "Dashboard"],
    href: "/projets/eidos-ia",
    image: "",
  },
  {
    id: "PRJ-02",
    slug: "lannion-twirling-club",
    title: "Lannion Twirling Club",
    client: "Association sportive · Lannion",
    description:
      "Parcours parents clarifiés : inscriptions, infos club, actus — SEO local et expérience mobile fluide.",
    tags: ["Site vitrine", "SEO local", "UI/UX", "Performance"],
    href: "/projets/lannion-twirling-club",
    image: "",
  },
  {
    id: "PRJ-03",
    slug: "les-sens-de-lharmonie",
    title: "Les Sens de l'Harmonie",
    client: "Bien-être · Accompagnement",
    description:
      "Positionnement premium explicite : offre clarifiée, parcours raccourci, contenus et UI alignés.",
    tags: ["Branding digital", "Conversion", "Next.js", "Motion"],
    href: "/projets/les-sens-de-lharmonie",
    image: "",
  },
];

export type ProjectCaseSection = {
  id: string;
  eyebrow: string;
  headline: string;
  body: string;
  /** calm = respiration, lecture ; punch = contraste fort */
  pacing: "calm" | "punch";
};

export type ProjectGalleryFrame = {
  id: string;
  ratio: "21/9" | "3/4" | "1/1";
  title: string;
  detail: string;
};

export type ProjectCaseMeta = {
  year: string;
  tagline: string;
  /** Mots du hero cinématique (un mot par ligne visuelle) */
  heroWords: string[];
  leadIn: string;
  sections: ProjectCaseSection[];
  frames: ProjectGalleryFrame[];
  deliverables: string;
};

export type ProjectCaseStudy = ProjectSlide & ProjectCaseMeta;

export const PROJECT_CASE_META: Record<string, ProjectCaseMeta> = {
  "eidos-ia": {
    year: "2024",
    tagline: "Informel cartographié, pilotage mesurable",
    heroWords: ["Tâches", "tracées", "pilotées"],
    leadIn:
      "Produit web : tâches et savoirs hors outils formalisés, flux mesurables, décisions appuyées sur des indicateurs temps réel.",
    sections: [
      {
        id: "e1",
        eyebrow: "01 — Terrain",
        headline: "Recenser l’activité hors systèmes d’information",
        body: "Ateliers et observation : où part le temps, quelles décisions passent hors ticketing, quels contenus restent dans la messagerie. On documente avant d’industrialiser.",
        pacing: "calm",
      },
      {
        id: "e2",
        eyebrow: "02 — Structure",
        headline: "Un socle unique, des règles claires",
        body: "Base de connaissances versionnée, droits, historique, traçabilité. Chaque règle d’automatisation est nommée et auditable : pas de scoring opaque côté métier.",
        pacing: "punch",
      },
      {
        id: "e3",
        eyebrow: "03 — Mouvement",
        headline: "Automatiser l’itération ; escalader les exceptions",
        body: "Les flux répétitifs tournent en tâche de fond. Les cas limites remontent avec contexte. Les vues temps réel servent à arbitrer, pas à remplacer la lecture métier.",
        pacing: "calm",
      },
      {
        id: "e4",
        eyebrow: "04 — Forme",
        headline: "Interface calme, densité maîtrisée",
        body: "Dashboards structurés, hiérarchie visuelle forte, micro-interactions qui guident. Priorité : charge cognitive maîtrisée en utilisation intensive.",
        pacing: "punch",
      },
    ],
    frames: [
      { id: "ef1", ratio: "21/9", title: "Cartographie", detail: "Flux & friction points" },
      { id: "ef2", ratio: "3/4", title: "Knowledge", detail: "Sources & versionnement" },
      { id: "ef3", ratio: "1/1", title: "Automations", detail: "Déclencheurs & garde-fous" },
      { id: "ef4", ratio: "21/9", title: "Live ops", detail: "Pilotage & alertes" },
      { id: "ef5", ratio: "3/4", title: "Mobile", detail: "Décision en déplacement" },
    ],
    deliverables: "Produit web · Design system · Dashboards · Intégrations · Documentation vivante",
  },
  "lannion-twirling-club": {
    year: "2024",
    tagline: "Parents rassurés, club visible",
    heroWords: ["Portes", "ouvertes", "numériques"],
    leadIn:
      "Priorité absolue : l'inscription et l'information accessibles en deux gestes — le reste du site s'organise autour de ce chemin.",
    sections: [
      {
        id: "l1",
        eyebrow: "01 — Besoin",
        headline: "Familles pressées, message dispersé",
        body: "Calendrier, tarifs, actualités : tout était vrai, mais éclaté. On a isolé les trois questions récurrentes — « comment s'inscrire », « combien », « quoi de neuf » — et bâti l'architecture autour.",
        pacing: "calm",
      },
      {
        id: "l2",
        eyebrow: "02 — Parcours",
        headline: "Un fil conducteur mobile-first",
        body: "Hiérarchie typographique marquée, CTA persistants discrets, sections courtes. Sur mobile, le club se lit comme une app : direct, sans zoom mental.",
        pacing: "punch",
      },
      {
        id: "l3",
        eyebrow: "03 — Visibilité",
        headline: "SEO local qui sert le territoire",
        body: "Titres, données structurées, pages stables et rapides. L'objectif : être trouvé quand on cherche une activité à Lannion — sans artifice, avec du contenu utile.",
        pacing: "calm",
      },
      {
        id: "l4",
        eyebrow: "04 — Performance",
        headline: "Vitesse = confiance pour les parents",
        body: "Assets optimisés, rendu Next.js, scores élevés sur mobile. Un site lent paraît négligé ; un site vif paraît sérieux — surtout pour une association.",
        pacing: "punch",
      },
    ],
    frames: [
      { id: "lf1", ratio: "21/9", title: "Accueil", detail: "Message club, entrée claire" },
      { id: "lf2", ratio: "3/4", title: "Inscriptions", detail: "Étapes & documents" },
      { id: "lf3", ratio: "1/1", title: "Actus", detail: "Lecture rapide" },
      { id: "lf4", ratio: "21/9", title: "Agenda", detail: "Dates & lieux" },
      { id: "lf5", ratio: "3/4", title: "Contact", detail: "Accès direct encadrants" },
    ],
    deliverables: "Site vitrine · UI/UX · SEO local · Performance · Mise en ligne",
  },
  "les-sens-de-lharmonie": {
    year: "2024",
    tagline: "Positionnement premium, parcours explicite",
    heroWords: ["Offre", "structurée", "ciblée"],
    leadIn:
      "Refonte vitrine : promesse lisible, charte graphique homogène, parcours vers le contact réduit au nécessaire.",
    sections: [
      {
        id: "h1",
        eyebrow: "01 — Image",
        headline: "Offre forte, message dispersé",
        body: "Cible, promesse, preuves : ordre fixé avant maquettes. Le positionnement haut de gamme exige des formulations nettes, pas seulement un rendu soigné.",
        pacing: "calm",
      },
      {
        id: "h2",
        eyebrow: "02 — Direction",
        headline: "DA : palette, typo, blancs",
        body: "Palette restreinte, hiérarchie typographique marquée, marges généreuses. Objectif : lisibilité et repères visuels stables, pas saturation d’écran.",
        pacing: "punch",
      },
      {
        id: "h3",
        eyebrow: "03 — Conversion",
        headline: "Contact : formulaire court, preuves à proximité",
        body: "Champs limités, témoignages ou faits à portée du CTA, rappel des bénéfices au moment de l’envoi. Pas de dark patterns.",
        pacing: "calm",
      },
      {
        id: "h4",
        eyebrow: "04 — Motion",
        headline: "Motion : hiérarchie, pas décor",
        body: "Révélations progressives, transitions courtes. Le mouvement soutient la lecture ; le fond reste porté par le texte et la structure.",
        pacing: "punch",
      },
    ],
    frames: [
      { id: "hf1", ratio: "21/9", title: "Accroche", detail: "Promesse & atmosphère" },
      { id: "hf2", ratio: "3/4", title: "Offres", detail: "Lecture par paliers" },
      { id: "hf3", ratio: "1/1", title: "Parcours", detail: "Étapes ressenties" },
      { id: "hf4", ratio: "21/9", title: "Témoignages", detail: "Voix humaines" },
      { id: "hf5", ratio: "3/4", title: "Contact", detail: "Invitation finale" },
    ],
    deliverables: "Refonte · DA digitale · UI/UX · Motion léger · Next.js",
  },
};

export function getProjectCaseStudy(slug: string): ProjectCaseStudy | null {
  const slide = PROJECT_SLIDES.find((p) => p.slug === slug);
  const meta = PROJECT_CASE_META[slug];
  if (!slide || !meta) return null;
  return { ...slide, ...meta };
}

export function getProjectCaseSlugs(): string[] {
  return PROJECT_SLIDES.map((p) => p.slug).filter(Boolean) as string[];
}

export function getNextProjectSlug(currentSlug: string): string | null {
  const slugs = getProjectCaseSlugs();
  const i = slugs.indexOf(currentSlug);
  if (i < 0) return null;
  return slugs[(i + 1) % slugs.length];
}

export function getPrevProjectSlug(currentSlug: string): string | null {
  const slugs = getProjectCaseSlugs();
  const i = slugs.indexOf(currentSlug);
  if (i < 0) return null;
  return slugs[(i - 1 + slugs.length) % slugs.length];
}
