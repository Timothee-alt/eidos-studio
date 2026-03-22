/** Signature courte (hero, menu plein écran, OG) */
export const STUDIO_SIGNATURE = "Rendre visible l'essentiel";

/** Accroche sous le bloc titre hero — promesse Eidos (voir / forme) */
export const STUDIO_CLAIM =
  "On voit ce que les autres ne voient pas — nous en faisons une forme claire et durable.";

export type NavLink = {
  label: string;
  href: string;
};

export const NAV_LINKS: NavLink[] = [
  { label: "Expertises", href: "/#capabilities" },
  { label: "Projets", href: "/#projets" },
  { label: "Studio", href: "/#about" },
  { label: "Contact", href: "/#contact" },
];
