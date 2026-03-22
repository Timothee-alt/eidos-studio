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
