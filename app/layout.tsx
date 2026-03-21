import type { Metadata, Viewport } from "next";
import { Sora, IBM_Plex_Mono, DM_Sans } from "next/font/google";
import "./globals.css";
import { Nav } from "@/components/nav";
import { StructuredData } from "@/components/structured-data";
import { SmoothScroll } from "@/components/ui/smooth-scroll";
import { Cursor } from "@/components/ui/cursor";
import { Preloader } from "@/components/preloader";
import { PreloaderProvider } from "@/lib/preloader-context";
import { RevealObserver } from "@/components/ui/reveal-observer";

const sora = Sora({
  variable: "--font-d",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  preload: true,
});

const dmSans = DM_Sans({
  variable: "--font-b",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
  preload: true,
});

const ibmPlexMono = IBM_Plex_Mono({
  variable: "--font-m",
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  display: "swap",
  preload: true,
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export const metadata: Metadata = {
  metadataBase: new URL("https://www.eidos-studio.com"),

  title: {
    default: "Eidos Studio — Agence WebGL & Sites premium · Bretagne",
    template: "%s | Eidos Studio",
  },

  description:
    "Eidos Studio, agence web à Lannion (22300) en Bretagne. " +
    "Nous rendons visible l'essentiel : WebGL, sites premium, SaaS et e-commerce sur mesure. " +
    "Clarté, forme durable, performance et conversion.",

  keywords: [
    "agence web Bretagne",
    "agence webgl france",
    "studio webgl",
    "site premium",
    "agence web Lannion",
    "création site internet Lannion",
    "agence digitale Bretagne",
    "création site web Bretagne",
    "développement Next.js",
    "agence SaaS France",
    "site e-commerce React",
    "studio développement web",
    "Eidos Studio",
  ],

  authors: [{ name: "Eidos Studio", url: "https://www.eidos-studio.com" }],
  creator: "Eidos Studio",
  publisher: "Eidos Studio",

  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },

  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: "https://www.eidos-studio.com",
    siteName: "Eidos Studio",
    title: "Eidos Studio — Agence WebGL & Sites premium · Bretagne",
    description:
      "Voir ce qui compte vraiment — puis le livrer : WebGL, sites premium, apps sur mesure en Bretagne.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Eidos Studio — Agence WebGL premium à Lannion",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Eidos Studio — Agence WebGL & Sites premium · Bretagne",
    description:
      "Rendre visible l'essentiel : WebGL, sites premium, apps. Studio à Lannion, Bretagne.",
    images: ["/og-image.png"],
    creator: "@eidos_studio",
  },

  alternates: {
    canonical: "https://www.eidos-studio.com",
  },

  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/icon-16.png", sizes: "16x16", type: "image/png" },
      { url: "/icon-32.png", sizes: "32x32", type: "image/png" },
    ],
  },

  manifest: "/site.webmanifest",
  category: "technology",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fr"
      className={`${sora.variable} ${dmSans.variable} ${ibmPlexMono.variable}`}
    >
      <body className="antialiased pt-14">
        <a
          href="#main"
          className="skip-link"
        >
          Aller au contenu principal
        </a>
        <PreloaderProvider>
          <Preloader />
          <SmoothScroll />
          <Cursor />
          <Nav />
          <StructuredData />
          <RevealObserver />
          {children}
        </PreloaderProvider>
      </body>
    </html>
  );
}
