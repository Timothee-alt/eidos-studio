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
