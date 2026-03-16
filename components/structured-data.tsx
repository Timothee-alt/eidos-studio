export function StructuredData() {
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": "https://www.eidos-studio.com/#organization",
        name: "Eidos Studio",
        url: "https://www.eidos-studio.com",
        logo: "https://www.eidos-studio.com/logo.svg",
        description:
          "Agence web à Lannion en Bretagne. Expériences WebGL, sites vitrines premium et applications sur mesure.",
        address: {
          "@type": "PostalAddress",
          addressLocality: "Lannion",
          postalCode: "22300",
          addressRegion: "Bretagne",
          addressCountry: "FR",
        },
        areaServed: ["Bretagne", "France", "Europe"],
        foundingDate: "2024",
        knowsAbout: ["Next.js", "React", "TypeScript", "WebGL", "Three.js", "SaaS", "E-commerce"],
        sameAs: [
          "https://github.com/eidos-studio",
          "https://www.linkedin.com/company/eidos-studio",
        ],
      },
      {
        "@type": "WebSite",
        "@id": "https://www.eidos-studio.com/#website",
        url: "https://www.eidos-studio.com",
        name: "Eidos Studio",
        publisher: { "@id": "https://www.eidos-studio.com/#organization" },
      },
      {
        "@type": "LocalBusiness",
        "@id": "https://www.eidos-studio.com/#localbusiness",
        name: "Eidos Studio",
        image: "https://www.eidos-studio.com/og-image.png",
        url: "https://www.eidos-studio.com",
        email: "contact@eidos.studio",
        contactPoint: {
          "@type": "ContactPoint",
          contactType: "service commercial",
          email: "contact@eidos.studio",
          areaServed: ["FR", "EU"],
          availableLanguage: ["French"],
        },
        address: {
          "@type": "PostalAddress",
          addressLocality: "Lannion",
          postalCode: "22300",
          addressRegion: "Bretagne",
          addressCountry: "FR",
        },
        geo: {
          "@type": "GeoCoordinates",
          latitude: 48.2,
          longitude: -2.9,
        },
        openingHoursSpecification: {
          "@type": "OpeningHoursSpecification",
          dayOfWeek: [
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
          ],
          opens: "09:00",
          closes: "18:00",
        },
        priceRange: "€€",
        currenciesAccepted: "EUR",
        paymentAccepted: "Virement bancaire",
        areaServed: ["Lannion", "Bretagne", "France"],
      },
      {
        "@type": "Service",
        name: "Création de sites vitrines",
        provider: { "@id": "https://www.eidos-studio.com/#organization" },
        areaServed: "France",
        description:
          "Sites vitrines premium en Next.js, design sur mesure et SEO local.",
        serviceType: "Développement web",
      },
      {
        "@type": "Service",
        name: "Expériences WebGL & 3D",
        provider: { "@id": "https://www.eidos-studio.com/#organization" },
        areaServed: "France",
        description:
          "Expériences web immersives, animations 3D et interfaces cinématiques performantes.",
        serviceType: "WebGL et motion design",
      },
      {
        "@type": "Service",
        name: "Développement application SaaS",
        provider: { "@id": "https://www.eidos-studio.com/#organization" },
        areaServed: "France",
        description:
          "Applications SaaS sur mesure, de la conception au déploiement.",
        serviceType: "Développement logiciel",
      },
      {
        "@type": "Service",
        name: "Création de boutiques e-commerce",
        provider: { "@id": "https://www.eidos-studio.com/#organization" },
        areaServed: "France",
        description:
          "E-commerce performant sur stack React / Next.js.",
        serviceType: "E-commerce",
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
