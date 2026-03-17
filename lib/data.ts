// ============================================================
// EIDOS STUDIO — Données statiques
// Remplacer les placeholders par les vraies données
// ============================================================

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
  description: string;
  tags: string[];
  href?: string;
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

export type CaseStudy = {
  slug: string;
  id: string;
  title: string;
  client: string;
  tagline: string;
  description: string;
  context: {
    mission: string;
    client: string;
    objectives: string[];
  };
  approach: {
    stack: string[];
    process: string;
    decisions: string[];
  };
  results: {
    metrics: { label: string; value: string }[];
    kpis?: string[];
    testimonial?: string;
  };
  tags: string[];
  href: string;
  ogImage?: string;
};

export type Stat = {
  value: string | number;
  label: string;
  suffix?: string;
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
    description:
      "Interfaces immersives qui marquent les esprits. Three.js, shaders, scènes 3D interactives et optimisées.",
    tags: ["Three.js", "WebGL", "GLSL"],
  },
  {
    id: "SVC-02",
    slug: "vitrine",
    title: "Sites vitrines premium",
    description:
      "Design haut de gamme, performances maximales, SEO intégré. Aucun template — tout est construit sur mesure.",
    tags: ["Next.js", "React", "TypeScript"],
    href: "/services/vitrine",
  },
  {
    id: "SVC-03",
    slug: "saas",
    title: "Applications SaaS",
    description:
      "Du MVP au produit en production. Auth, billing, dashboards, API — architecture scalable dès le départ.",
    tags: ["SaaS", "Node.js", "PostgreSQL"],
    href: "/services/saas",
  },
  {
    id: "SVC-04",
    slug: "ecommerce",
    title: "E-commerce",
    description:
      "Boutiques performantes, paiement Stripe, gestion stock. Conversion optimisée, zéro commission sur vos ventes.",
    tags: ["Stripe", "Next.js", "Commerce"],
    href: "/services/ecommerce",
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
      "Plateforme IA orientée productivité : agents métiers, base de connaissances vectorielle et interface de pilotage en temps réel.",
    tags: ["Next.js", "IA", "Automatisation", "Dashboard"],
    href: "/projets/eidos-ia",
    image: "https://images.unsplash.com/photo-1620121692029-d088224ddc74?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: "PRJ-02",
    slug: "lannion-twirling-club",
    title: "Lannion Twirling Club",
    client: "Association sportive · Lannion",
    description:
      "Site vitrine moderne pour une association locale, pensé pour les inscriptions, la visibilité SEO locale et la gestion d'actualites.",
    tags: ["Site vitrine", "SEO local", "UI/UX", "Performance"],
    href: "/projets/lannion-twirling-club",
    image: "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: "PRJ-03",
    slug: "les-sens-de-lharmonie",
    title: "Les Sens de l'Harmonie",
    client: "Bien-etre · Accompagnement",
    description:
      "Refonte digitale premium avec direction artistique sur mesure, parcours de conversion simplifie et storytelling visuel immersif.",
    tags: ["Branding digital", "Conversion", "Next.js", "Motion"],
    href: "/projets/les-sens-de-lharmonie",
    image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1200&auto=format&fit=crop",
  },
];

// ────────────────────────────────────────────────────────────
// CASE STUDIES (détails complets)
// ────────────────────────────────────────────────────────────

export const CASE_STUDIES: CaseStudy[] = [
  {
    slug: "eidos-ia",
    id: "PRJ-01",
    title: "Eidos IA",
    client: "Automatisation métier · IA appliquée",
    tagline: "Transformer le temps perdu en avantage opérationnel.",
    description:
      "Eidos IA est une plateforme orientée productivité qui centralise les connaissances internes, automatise les tâches répétitives et déploie des agents IA opérationnels pour les équipes.",
    context: {
      mission:
        "Concevoir un outil concret pour réduire les tâches chronophages et accélérer l'exécution quotidienne des équipes.",
      client: "PME et structures en croissance",
      objectives: [
        "Automatiser les workflows répétitifs",
        "Structurer une base de connaissance exploitable",
        "Offrir une interface claire pour les non-tech",
        "Garantir rapidité et fiabilité en production",
      ],
    },
    approach: {
      stack: ["Next.js", "TypeScript", "PostgreSQL", "LLM APIs", "Tailwind CSS"],
      process:
        "Ateliers terrain avec l'équipe, prototypage rapide des flux critiques, puis livraison itérative en cycles courts.",
      decisions: [
        "Architecture modulaire pour intégrer de nouveaux agents",
        "Système de permissions simple pour favoriser l'adoption",
        "Instrumentation des parcours pour mesurer les gains réels",
      ],
    },
    results: {
      metrics: [
        { label: "Taches automatisees", value: "25+" },
        { label: "Temps gagne / semaine", value: "~ 12h" },
        { label: "Score Lighthouse", value: "94+" },
      ],
      kpis: ["Adoption equipe", "Temps de traitement", "Qualite des reponses"],
      testimonial:
        "Nous sommes passés d'un pilotage artisanal à un système IA clair, concret et mesurable.",
    },
    tags: ["Next.js", "IA", "Automatisation", "Productivite"],
    href: "/projets/eidos-ia",
  },
  {
    slug: "lannion-twirling-club",
    id: "PRJ-02",
    title: "Lannion Twirling Club",
    client: "Association sportive · Lannion",
    tagline: "Un site local qui donne envie d'adhérer.",
    description:
      "Refonte complète du site de l'association avec un parcours clair pour les nouvelles inscriptions, une navigation mobile-first et une meilleure visibilité locale.",
    context: {
      mission:
        "Moderniser l'image en ligne du club et simplifier l'accès aux informations essentielles pour les familles.",
      client: "Association sportive locale",
      objectives: [
        "Faciliter les inscriptions et prises de contact",
        "Mettre en avant les sections et actualites",
        "Ameliorer la visibilite locale sur Google",
        "Assurer une experience mobile fluide",
      ],
    },
    approach: {
      stack: ["Next.js", "TypeScript", "SEO local", "Tailwind CSS"],
      process:
        "Audit de l'existant, priorisation des besoins terrain, design de parcours simples puis livraison incrementalement.",
      decisions: [
        "Structure d'information simplifiée en 3 niveaux maximum",
        "CTA de contact visibles à chaque section clé",
        "Pages optimisées pour les requêtes locales",
      ],
    },
    results: {
      metrics: [
        { label: "Performance mobile", value: "95+" },
        { label: "Temps moyen page", value: "< 2s" },
        { label: "Parcours inscription", value: "-40%" },
      ],
      kpis: ["Demandes entrantes", "Visibilite locale", "Taux de rebond"],
      testimonial:
        "Le nouveau site est plus clair pour les parents et valorise vraiment notre club.",
    },
    tags: ["Site vitrine", "SEO local", "Performance", "UX"],
    href: "/projets/lannion-twirling-club",
  },
  {
    slug: "les-sens-de-lharmonie",
    id: "PRJ-03",
    title: "Les Sens de l'Harmonie",
    client: "Bien-etre · Accompagnement",
    tagline: "Une présence digitale plus premium et plus lisible.",
    description:
      "Refonte identitaire et web pour repositionner l'activité sur une image premium, clarifier l'offre et augmenter les demandes qualifiées.",
    context: {
      mission:
        "Construire un univers digital cohérent avec la qualité des services proposés.",
      client: "Activite independante du secteur bien-etre",
      objectives: [
        "Monter en gamme sur la perception de marque",
        "Simplifier la compréhension des offres",
        "Optimiser les passages à l'action",
        "Conserver une atmosphère sensible et élégante",
      ],
    },
    approach: {
      stack: ["Next.js", "TypeScript", "Motion design", "UX writing"],
      process:
        "Direction artistique, prototypage des sections de conversion, puis intégration front avec animations sobres et performantes.",
      decisions: [
        "Hiérarchie éditoriale plus nette pour faciliter la lecture",
        "Animations courtes orientées feedback, sans surcharge",
        "Bloc de preuve sociale renforcé sur les sections chaudes",
      ],
    },
    results: {
      metrics: [
        { label: "Demandes de contact", value: "+60%" },
        { label: "Temps de chargement", value: "< 2.3s" },
        { label: "Taux de conversion", value: "+28%" },
      ],
      kpis: ["Leads qualifiés", "Temps sur page", "Conversion formulaire"],
      testimonial:
        "Le site renvoie enfin l'image juste de notre accompagnement: claire, haut de gamme et vivante.",
    },
    tags: ["Branding digital", "Conversion", "UX", "Next.js"],
    href: "/projets/les-sens-de-lharmonie",
  },
];

export function getCaseStudyBySlug(slug: string): CaseStudy | undefined {
  return CASE_STUDIES.find((cs) => cs.slug === slug);
}

// ────────────────────────────────────────────────────────────
// STATS (3 stats)
// ────────────────────────────────────────────────────────────

export const STATS: Stat[] = [
  { value: 32, label: "projets livrés", suffix: "+" },
  { value: 67, label: "hausse moyenne des leads", suffix: "%" },
  { value: 97, label: "score Lighthouse médian", suffix: "+" },
];

// ── HERO TAGLINE ──────────────────────────────────────────────────────────────
// Différencié du manifeste (acte 3) pour éviter la répétition.
// Le manifeste développe "beaux ET performants" sur 3 actes ;
// le hero pose l'entrée — plus courte, plus directe.
export const HERO_TAGLINE = "Beaux. Performants. Sans compromis.";

export const HOME_CHAPTERS: HomeChapter[] = [
  {
    id: "CH-01",
    eyebrow: "Manifeste",
    title: "Une identité qui raconte juste",
    summary:
      "Chaque section joue un rôle précis dans le récit et la conversion.",
  },
  {
    id: "CH-02",
    eyebrow: "Mouvement",
    title: "Des interactions nettes et utiles",
    summary:
      "Le motion guide l'attention sans voler la vedette au message.",
  },
  {
    id: "CH-03",
    eyebrow: "Performance",
    title: "Un rendu premium qui reste rapide",
    summary:
      "Direction visuelle ambitieuse, base technique propre, vitesse mesurable.",
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
  { label: "GitHub", href: "https://github.com/eidos-studio", ariaLabel: "GitHub" },
  { label: "LinkedIn", href: "https://linkedin.com/company/eidos-studio", ariaLabel: "LinkedIn" },
  { label: "Twitter", href: "https://twitter.com/eidos_studio", ariaLabel: "Twitter / X" },
];

// ────────────────────────────────────────────────────────────
// ABOUT_TABLE (5 rows: Fondée / Localisation / Équipe / Stack / Statut)
// ────────────────────────────────────────────────────────────

export const ABOUT_TABLE: AboutTableRow[] = [
  { label: "Fondée", value: "2024" },
  { label: "Localisation", value: "Lannion · Bretagne, France" },
  { label: "Équipe", value: "Studio indépendant" },
  { label: "Stack", value: "Next.js · Three.js · TypeScript" },
  { label: "Statut", value: "OUVERT AUX DEVIS", isStatus: true },
];