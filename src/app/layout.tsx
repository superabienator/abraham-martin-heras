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
  },
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
      <body className="min-h-full transition-colors duration-300 selection:bg-violet-500/20 selection:text-violet-950 dark:selection:bg-cyan-500/20 dark:selection:text-cyan-200">
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
