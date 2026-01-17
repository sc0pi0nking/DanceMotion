import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "./components/Header";
import Footer from "./components/Footer";
import ScrollToTop from "./components/ScrollToTop";

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
    default: "DanceMotion Eschweiler — Tanzgruppen & Eventstudio",
    template: "%s | DanceMotion Eschweiler",
  },
  description: "Offene Tanzgemeinschaft in Eschweiler: Little Joys, Smileys, Emotion & Eventstudio. Energie, Kreativität und Wärme für alle Altersgruppen.",
  keywords: ["Tanzgruppe", "Eschweiler", "DanceMotion", "Kindertanz", "Erwachsenentanz", "Eventstudio", "Tanzkurse", "NRW"],
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
    title: "DanceMotion Eschweiler — Tanzgruppen & Eventstudio",
    description: "Offene Tanzgemeinschaft in Eschweiler: Little Joys, Smileys, Emotion & Eventstudio. Energie, Kreativität und Wärme.",
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
    title: "DanceMotion Eschweiler — Tanzgruppen & Eventstudio",
    description: "Offene Tanzgemeinschaft in Eschweiler: Little Joys, Smileys, Emotion & Eventstudio.",
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
  icons: {
    icon: "/favicon.ico",
  },
  // manifest: "/site.webmanifest", // Aktivieren wenn Icons erstellt wurden
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <Header />
        <main className="relative z-10">{children}</main>
        <Footer />
        <ScrollToTop />
      </body>
    </html>
  );
}
