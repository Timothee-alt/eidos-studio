// ============================================================
// EIDOS STUDIO — Données statiques
// Remplacer les placeholders par les vraies données
// ============================================================

/** Signature courte (hero, menu plein écran, OG) */
export const STUDIO_SIGNATURE = "Rendre visible l'essentiel";

/** Accroche sous le bloc titre hero — promesse Eidos (voir / forme) */
export const STUDIO_CLAIM =
  "On voit ce que les autres ne voient pas — nous en faisons une forme claire et durable.";

// ────────────────────────────────────────────────────────────
// TYPES
// ────────────────────────────────────────────────────────────

export type NavLink = {
  label: string;
  href: string;
};

export type Service = {
  id: string;
  slug?: string;
  title: string;
  /** Titre fragmenté ligne 1 (affichage sticky panel) */
  titleLine1?: string;
  /** Titre fragmenté ligne 2, style muted */
  titleLine2?: string;
  description: string;
  tags: string[];
  href?: string;
  /** URL image ou "webgl" pour rendu Three.js */
  image?: string;
};

/** Per-service title reveal personality */
export type TitleRevealConfig = {
  initial: (wordIndex: number) => { transform: string; opacity: string };
  ease: string;
  duration: number[];
  delay: number[];
};

/** Données enrichies pour la section services (layout shell + WebGL) */
export type ServiceSlide = {
  id: string;
  code: string;
  scope: string;
  scopeLabel: string; // "Expérience" + "interactive"
  scopeQualifier: string;
  title: string;
  titleLines: { text: string; muted?: boolean }[];
  lead: string;
  description: string;
  tags: string[];
  primaryTagCount: number; // premiers N tags avec .p
  vbadge?: string; // badge vertical (SVC-01)
  quote: string; // animation char dans le panel
  /** Couleur hex */
  hex: string;
  /** RGB pour CSS rgba */
  rgb: string;
  /** Vec3 pour shader [0-1] */
  color: [number, number, number];
  glowDur: string;
  shaderIntensity: number;
  /** Per-service title reveal animation config */
  titleReveal?: TitleRevealConfig;
};

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

export type Stat = {
  value: string | number;
  label: string;
  suffix?: string;
  /** Périmètre ou méthode — courte phrase sous le libellé */
  context?: string;
};

export type HomeChapter = {
  id: string;
  eyebrow: string;
  title: string;
  summary: string;
};

export type AboutTableRow = {
  label: string;
  value: string;
  isStatus?: boolean;
};

// ────────────────────────────────────────────────────────────
// NAV_LINKS
// ────────────────────────────────────────────────────────────

export const NAV_LINKS: NavLink[] = [
  { label: "Expertises", href: "/#capabilities" },
  { label: "Projets", href: "/#projets" },
  { label: "Studio", href: "/#about" },
  { label: "Contact", href: "/#contact" },
];

export type ServicePage = {
  slug: string;
  title: string;
  metaTitle: string;
  description: string;
  highlights: string[];
  cta: string;
};

export const SERVICE_PAGES: Record<string, ServicePage> = {
  vitrine: {
    slug: "vitrine",
    title: "Sites vitrines premium",
    metaTitle: "Agence web Lannion · Sites vitrines premium · Eidos Studio",
    description:
      "Conception de sites vitrines premium en Next.js pour entreprises et associations ambitieuses. Direction artistique sur mesure, performance élevée et SEO local optimisé pour Lannion, Bretagne et toute la France.",
    highlights: [
      "Design sur mesure, pas de templates",
      "Performance et Core Web Vitals optimisés",
      "SEO intégré (meta, sitemap, structured data)",
      "Maintenance et évolutions incluses",
    ],
    cta: "Demander un devis pour votre site vitrine",
  },
  saas: {
    slug: "saas",
    title: "Applications SaaS",
    metaTitle: "Développement SaaS sur mesure · Next.js · Eidos Studio",
    description:
      "Développement d'applications SaaS sur mesure, du cadrage produit à la mise en production. Architecture scalable, auth, billing, dashboards et observabilité. Stack Next.js · TypeScript · PostgreSQL.",
    highlights: [
      "Architecture scalable dès le départ",
      "Auth, billing, multi-tenant",
      "Dashboard et analytics",
      "Déploiement et CI/CD",
    ],
    cta: "Demander un devis pour votre SaaS",
  },
  ecommerce: {
    slug: "ecommerce",
    title: "Sites e-commerce",
    metaTitle: "Création site e-commerce performant · Bretagne · Eidos Studio",
    description:
      "Création de boutiques e-commerce performantes en Next.js : checkout Stripe, gestion catalogue, SEO e-commerce et optimisation conversion. Basé à Lannion, interventions en Bretagne et partout en France.",
    highlights: [
      "Paiement Stripe intégré",
      "Gestion stock et commandes",
      "SEO e-commerce (fiches produits)",
      "Performance et conversion",
    ],
    cta: "Demander un devis pour votre e-commerce",
  },
};

// ────────────────────────────────────────────────────────────
// SERVICES (4 items)
// ────────────────────────────────────────────────────────────

export const SERVICES: Service[] = [
  {
    id: "SVC-01",
    title: "Expériences WebGL & 3D",
    titleLine1: "Expériences",
    titleLine2: "WebGL & 3D",
    description:
      "Révéler ce qu'une marque peut montrer au-delà du plat : Three.js, shaders, scènes 3D interactives et optimisées.",
    tags: ["Three.js", "WebGL", "GLSL"],
    image: "webgl",
  },
  {
    id: "SVC-02",
    slug: "vitrine",
    title: "Sites vitrines premium",
    titleLine1: "Sites vitrines",
    titleLine2: "premium.",
    description:
      "Clarifier votre message, puis le habiller sans template : design haut de gamme, perfs fortes, SEO intégré.",
    tags: ["Next.js", "React", "TypeScript"],
    href: "/services/vitrine",
    image: "",
  },
  {
    id: "SVC-03",
    slug: "saas",
    title: "Applications SaaS",
    titleLine1: "Applications",
    titleLine2: "SaaS.",
    description:
      "Donner une forme stable au produit : du MVP à la prod, auth, billing, dashboards, API — architecture scalable.",
    tags: ["SaaS", "Node.js", "PostgreSQL"],
    href: "/services/saas",
    image: "",
  },
  {
    id: "SVC-04",
    slug: "ecommerce",
    title: "E-commerce",
    titleLine1: "E-commerce.",
    titleLine2: "Convertissant.",
    description:
      "Rendre évident le chemin d’achat : boutique performante, Stripe, stock, conversion — sans commission sur vos ventes.",
    tags: ["Stripe", "Next.js", "Commerce"],
    href: "/services/ecommerce",
    image: "",
  },
];

// ────────────────────────────────────────────────────────────
// SERVICES_SLIDES (données enrichies pour layout shell + WebGL)
// ────────────────────────────────────────────────────────────

export const SERVICES_SLIDES: ServiceSlide[] = [
  {
    id: "SVC-01",
    code: "SVC-01",
    scope: "WebGL",
    scopeLabel: "Expérience",
    scopeQualifier: "interactive",
    title: "Expériences WebGL & 3D",
    titleLines: [
      { text: "Expériences" },
      { text: "WebGL" },
      { text: "& 3D.", muted: true },
    ],
    lead: "Ce que le marché ne voit pas encore de vous — nous le rendons tangible à l’écran.",
    description:
      "Three.js, shaders GLSL, scènes 3D interactives et optimisées pour la production. Chaque détail sert la perception.",
    tags: ["Three.js", "WebGL", "GLSL", "Shaders", "R3F"],
    primaryTagCount: 2,
    quote: "Three.js · WebGL · 3D",
    hex: "#3b7bff",
    rgb: "59,123,255",
    color: [0.231, 0.482, 1.0],
    glowDur: "3.2s",
    shaderIntensity: 1.0,
    titleReveal: {
      initial: (i) =>
        i === 0
          ? { transform: "translateX(-40px) skewX(-4deg)", opacity: "0" }
          : { transform: "translateX(-28px)", opacity: "0" },
      ease: "cubic-bezier(0.12,0.8,0.32,1)",
      duration: [0.65, 0.65, 0.65],
      delay: [0, 0.06, 0.11],
    },
  },
  {
    id: "SVC-02",
    code: "SVC-02",
    scope: "Design",
    scopeLabel: "Design",
    scopeQualifier: "premium",
    title: "Sites vitrines premium",
    titleLines: [
      { text: "Sites vitrines" },
      { text: "sur mesure.", muted: true },
    ],
    lead: "Sortir du flou des offres identiques : une forme web qui dit clairement qui vous êtes.",
    description:
      "Design haut de gamme, performances maximales, SEO intégré. Rien n’est dupliqué — tout est pensé pour être lu et retenu.",
    tags: ["Next.js", "React", "TypeScript", "Motion"],
    primaryTagCount: 2,
    quote: "Design · performance · durabilité",
    hex: "#a78bfa",
    rgb: "167,139,250",
    color: [0.655, 0.545, 0.98],
    glowDur: "5s",
    shaderIntensity: 0.5,
    titleReveal: {
      initial: () => ({ transform: "translateY(106%)", opacity: "1" }),
      ease: "cubic-bezier(0.22,1,0.36,1)",
      duration: [0.85, 0.85, 0.85],
      delay: [0, 0.07, 0.13],
    },
  },
  {
    id: "SVC-03",
    code: "SVC-03",
    scope: "SaaS",
    scopeLabel: "Produit",
    scopeQualifier: "scalable",
    title: "Applications SaaS",
    titleLines: [
      { text: "Applications" },
      { text: "SaaS.", muted: true },
    ],
    lead: "Structurer le produit avant qu’il ne devienne ingérable.",
    description:
      "Auth, billing, dashboards, API. Nous rendons visibles les bons arbitrages techniques pour scaler sans dette cachée.",
    tags: ["Node.js", "PostgreSQL", "Auth", "Billing", "CI/CD"],
    primaryTagCount: 2,
    quote: "Scalable · auth · billing",
    hex: "#34d399",
    rgb: "52,211,153",
    color: [0.204, 0.831, 0.6],
    glowDur: "6.5s",
    shaderIntensity: 0.62,
    titleReveal: {
      initial: () => ({ transform: "translateY(100%)", opacity: "1" }),
      ease: "cubic-bezier(0.4,0,0.2,1)",
      duration: [0.6, 0.55, 0.5],
      delay: [0, 0.1, 0.18],
    },
  },
  {
    id: "SVC-04",
    code: "SVC-04",
    scope: "Commerce",
    scopeLabel: "Commerce",
    scopeQualifier: "performant",
    title: "E-commerce",
    titleLines: [
      { text: "E-commerce." },
      { text: "Convertissant.", muted: true },
    ],
    lead: "Voir où les visiteurs abandonnent — puis supprimer la friction.",
    description:
      "Boutiques performantes, Stripe natif, stock clair. Parcours lisibles, zéro commission plateforme, conversion au centre.",
    tags: ["Stripe", "Next.js", "Commerce"],
    primaryTagCount: 2,
    quote: "Stripe · stock · conversion",
    hex: "#f59e0b",
    rgb: "245,158,11",
    color: [0.961, 0.62, 0.043],
    glowDur: "5.8s",
    shaderIntensity: 0.52,
    titleReveal: {
      initial: () => ({
        transform: "translateY(80%) scaleY(0.92)",
        opacity: "1",
      }),
      ease: "cubic-bezier(0.16,1,0.3,1)",
      duration: [0.5, 0.5, 0.5],
      delay: [0, 0.05, 0.09],
    },
  },
];

// ────────────────────────────────────────────────────────────
// PROJECT_SLIDES (données enrichies pour section projets horizontal scroll)
// ────────────────────────────────────────────────────────────

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

// ────────────────────────────────────────────────────────────
// PROJECTS (3 items)
// ────────────────────────────────────────────────────────────

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

// ────────────────────────────────────────────────────────────
// PROJECT CASE PAGES (/projets/[slug])
// ────────────────────────────────────────────────────────────

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

// ────────────────────────────────────────────────────────────
// STATS (3 stats)
// ────────────────────────────────────────────────────────────

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

// ── TICKER TAGS (hero — bandeau infini stack & positionnement) ─────────────
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

// ────────────────────────────────────────────────────────────
// REEL (showreel video)
// ────────────────────────────────────────────────────────────

/** URL du showreel (Vimeo, YouTube, ou fichier vidéo). Vide = bouton scroll vers contact */
export const REEL_VIDEO_URL = "";

// ────────────────────────────────────────────────────────────
// CONTACT
// ────────────────────────────────────────────────────────────

export const CONTACT_EMAIL = "contact@eidos.studio";

export type SocialLink = {
  label: string;
  href: string;
  ariaLabel?: string;
};

export const SOCIAL_LINKS: SocialLink[] = [
  {
    label: "GitHub",
    href: "https://github.com/eidos-studio",
    ariaLabel: "Eidos Studio sur GitHub (ouvre un nouvel onglet)",
  },
  {
    label: "LinkedIn",
    href: "https://linkedin.com/company/eidos-studio",
    ariaLabel: "Eidos Studio sur LinkedIn (ouvre un nouvel onglet)",
  },
];

// ────────────────────────────────────────────────────────────
// ABOUT_TABLE (5 rows: Fondée / Localisation / Équipe / Stack / Statut)
// ────────────────────────────────────────────────────────────

export const ABOUT_TABLE: AboutTableRow[] = [
  { label: "Fondée", value: "2024" },
  { label: "Localisation", value: "Lannion · Bretagne, France" },
  { label: "Équipe", value: "Studio indépendant" },
  { label: "Stack", value: "Next.js · Three.js · TypeScript" },
  { label: "Statut", value: "Ouvert aux devis", isStatus: true },
];

// ────────────────────────────────────────────────────────────
// ABOUT_DNA_TABLE (tableau brutaliste manifeste)
// ────────────────────────────────────────────────────────────

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

// ────────────────────────────────────────────────────────────
// ABOUT_GRID_CELLS (grille 2x2 des vérités)
// ────────────────────────────────────────────────────────────

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