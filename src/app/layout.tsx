import type { Metadata } from "next";
import { Geist, Geist_Mono, Montserrat } from "next/font/google";
import "./globals.css";
import { cvData } from "@/data/cv-data";
import { ThemeProvider } from "@/context/theme-context";
import { LanguageProvider } from "@/context/language-context";
import { CustomCursor } from "@/components/ui/custom-cursor";
import { ScrollProgress } from "@/components/ui/scroll-progress";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["700", "800", "900"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://abraham-martin-heras.dev"),
  title: `${cvData.profile.name} | Full Stack AI · Automatización de Procesos`,
  description: cvData.profile.tagline,
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "32x32" },
      { url: "/icon.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      { url: "/apple-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  keywords: [
    "Abraham Martín Heras",
    "Full Stack AI",
    "Automatización de Procesos",
    "Vibe Coding",
    "Next.js",
    "React 19",
    "TypeScript",
    "Python",
    "n8n",
    "Playwright",
    "Ciberseguridad",
    "PostGIS",
  ],
  authors: [{ name: cvData.profile.name }],
  creator: cvData.profile.name,
  openGraph: {
    type: "website",
    locale: "es_ES",
    alternateLocale: "en_US",
    url: "https://abraham-martin-heras.dev",
    title: `${cvData.profile.name} | Full Stack AI & Operational Automation`,
    description: cvData.profile.tagline,
    siteName: `${cvData.profile.name} Portfolio`,
    images: [
      {
        url: "/logo-amh.png",
        width: 1024,
        height: 1024,
        alt: `${cvData.profile.name} · AMH Identity Logo`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${cvData.profile.name} | Full Stack AI & Process Automation`,
    description: cvData.profile.tagline,
    images: ["/logo-amh.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "https://abraham-martin-heras.dev",
    languages: {
      "es-ES": "https://abraham-martin-heras.dev",
      "en-US": "https://abraham-martin-heras.dev?lang=en",
      "x-default": "https://abraham-martin-heras.dev",
    },
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Person",
      "@id": "https://abraham-martin-heras.dev/#person",
      name: cvData.profile.name,
      jobTitle: cvData.profile.role,
      description: cvData.profile.tagline,
      url: "https://abraham-martin-heras.dev",
      sameAs: [
        "https://github.com/superabienator",
        "https://linkedin.com/in/abraham-martin-heras",
      ],
      knowsAbout: [
        "Full Stack Development",
        "Artificial Intelligence",
        "Process Automation",
        "Next.js",
        "React",
        "TypeScript",
        "Python",
        "n8n",
        "Playwright",
        "Cybersecurity",
        "PostGIS",
      ],
      alumniOf: {
        "@type": "EducationalOrganization",
        name: "Universitat de València",
      },
    },
    {
      "@type": "ProfilePage",
      "@id": "https://abraham-martin-heras.dev/#webpage",
      url: "https://abraham-martin-heras.dev",
      name: `${cvData.profile.name} | Full Stack AI · Automatización de Procesos`,
      description: cvData.profile.tagline,
      inLanguage: ["es", "en"],
      mainEntity: { "@id": "https://abraham-martin-heras.dev/#person" },
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      data-theme="pearl"
      className={`${geistSans.variable} ${geistMono.variable} ${montserrat.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-full transition-colors duration-300 selection:bg-violet-500/20 selection:text-violet-950 dark:selection:bg-cyan-500/20 dark:selection:text-cyan-200">
        {/* Enlace accesible para saltar directamente al contenido principal (WCAG 2.4.1) */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2.5 focus:rounded-xl focus:bg-violet-600 focus:text-white focus:font-semibold focus:text-xs focus:shadow-xl focus:ring-2 focus:ring-offset-2 focus:ring-white transition-all"
        >
          Saltar al contenido principal / Skip to main content
        </a>
        <ThemeProvider>
          <LanguageProvider>
            <ScrollProgress />
            <CustomCursor />
            {children}
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
