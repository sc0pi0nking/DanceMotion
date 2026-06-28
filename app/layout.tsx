import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "./components/Header";
import Footer from "./components/Footer";
import ParallaxBackground from "./components/ParallaxBackground";
import AnalyticsTracker from "./components/AnalyticsTracker";
import CookieBanner from "./components/CookieBanner";
import AlertsDisplay from "./components/AlertsDisplay";
import PublicShell from "./components/PublicShell";
import SearchModal from "./components/SearchModal";
import { getOrganizationSchema, getLocalBusinessSchema } from "@/lib/structured-data";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "DanceMotion Eschweiler — Tanzgruppen & Events",
    template: "%s | DanceMotion Eschweiler",
  },
  description: "Offene Tanzgemeinschaft in Eschweiler: Little Joys, Smileys, Emotion & Events. Energie, Kreativität und Wärme für alle Altersgruppen.",
  keywords: ["Tanzgruppe", "Eschweiler", "DanceMotion", "Kindertanz", "Erwachsenentanz", "Tanzkurse", "NRW", "Events"],
  authors: [{ name: "DanceMotion Eschweiler" }],
  creator: "DanceMotion Eschweiler",
  publisher: "DanceMotion Eschweiler",
  formatDetection: {
    email: false,
    telephone: false,
  },
  metadataBase: new URL("https://dancemotion.org"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "de_DE",
    url: "https://dancemotion.org",
    siteName: "DanceMotion Eschweiler",
    title: "DanceMotion Eschweiler — Tanzgruppen & Events",
    description: "Offene Tanzgemeinschaft in Eschweiler: Little Joys, Smileys, Emotion & Events. Energie, Kreativität und Wärme.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "DanceMotion Eschweiler",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "DanceMotion Eschweiler — Tanzgruppen & Events",
    description: "Offene Tanzgemeinschaft in Eschweiler: Little Joys, Smileys, Emotion & Events.",
    images: ["/og-image.jpg"],
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
  // Icons werden automatisch aus app/icon.png und app/apple-icon.png geladen
  // manifest: "/site.webmanifest", // Aktivieren wenn Icons erstellt wurden
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de">
      <head>
        {/* JSON-LD Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(getOrganizationSchema()),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(getLocalBusinessSchema()),
          }}
        />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}>
        {/* Analytics Tracking (DSGVO-konform) */}
        <AnalyticsTracker />
        {/* Cookie Banner */}
        <CookieBanner />
        {/* Public-only elements (hidden on /admin/*) */}
        <PublicShell>
          {/* System Alerts */}
          <AlertsDisplay />
          {/* Global Parallax Background - fixed, behind everything */}
          <ParallaxBackground />
          <Header />
          <SearchModal />
        </PublicShell>
        <main className="relative z-10 flex-grow">{children}</main>
        <PublicShell>
          <Footer />
        </PublicShell>
      </body>
    </html>
  );
}
