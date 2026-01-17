"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Mail, MapPin, Phone, Instagram, Facebook, Youtube, Twitter, Music2, Link as LinkIcon } from "lucide-react";

interface SocialLink {
  id: string;
  platform: string;
  url: string;
  icon: string;
  label: string;
}

// Icon mapping
const iconMap: Record<string, React.ComponentType<{ size?: number }>> = {
  instagram: Instagram,
  facebook: Facebook,
  youtube: Youtube,
  twitter: Twitter,
  tiktok: Music2,
  other: LinkIcon,
};

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);

  useEffect(() => {
    async function fetchSocialLinks() {
      try {
        const res = await fetch("/api/social-links");
        const data = await res.json();
        if (data.success && data.data) {
          setSocialLinks(data.data);
        }
      } catch (error) {
        console.error("Error fetching social links:", error);
      }
    }
    fetchSocialLinks();
  }, []);

  return (
    <>
      {/* Gradient overlay to fade out parallax before footer */}
      <div 
        className="relative z-10 w-full h-32 pointer-events-none"
        style={{
          background: "linear-gradient(to bottom, transparent 0%, var(--bg) 100%)",
          marginBottom: "-1px",
        }}
      />
      <footer className="site-footer w-full relative z-20" style={{ borderColor: "var(--border)", backgroundColor: "var(--bg)" }}>
      <div className="mx-auto max-w-6xl px-6 py-12 sm:py-16">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div>
            <h3 className="h4 mb-4">DanceMotion</h3>
            <p className="text-sm-muted">
              Offene Tanzgemeinschaft in Eschweiler mit vier dynamischen Gruppen.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold mb-4" style={{ color: "var(--fg)" }}>Navigation</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/#groups" className="text-sm-muted hover:text-accent transition-colors">
                  Gruppen
                </Link>
              </li>
              <li>
                <Link href="/termine" className="text-sm-muted hover:text-accent transition-colors">
                  Termine
                </Link>
              </li>
              <li>
                <Link href="/galerie" className="text-sm-muted hover:text-accent transition-colors">
                  Galerie
                </Link>
              </li>
              <li>
                <Link href="/team" className="text-sm-muted hover:text-accent transition-colors">
                  Team
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-sm font-semibold mb-4" style={{ color: "var(--fg)" }}>Kontakt</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <Mail size={16} style={{ color: "var(--accent)", marginTop: "2px" }} />
                <a href="mailto:info@dancemotion-eschweiler.de" className="text-sm-muted hover:text-accent transition-colors">
                  info@dancemotion-eschweiler.de
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Phone size={16} style={{ color: "var(--accent)", marginTop: "2px" }} />
                <a href="tel:+4924058751" className="text-sm-muted hover:text-accent transition-colors">
                  +49 (0) 2405 87 51
                </a>
              </li>
              <li className="flex items-start gap-3">
                <MapPin size={16} style={{ color: "var(--accent)", marginTop: "2px" }} />
                <span className="text-sm-muted">
                  Eschweiler, NRW
                </span>
              </li>
            </ul>
          </div>

          {/* Social Media - Dynamic */}
          <div>
            <h4 className="text-sm font-semibold mb-4" style={{ color: "var(--fg)" }}>Social Media</h4>
            <div className="flex gap-3 flex-wrap">
              {socialLinks.length > 0 ? (
                socialLinks.map((link) => {
                  const IconComponent = iconMap[link.icon] || LinkIcon;
                  return (
                    <a
                      key={link.id}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 rounded-full flex items-center justify-center transition-all hover:scale-110 hover:shadow-lg"
                      style={{ backgroundColor: "var(--accent)", color: "var(--bg)" }}
                      title={link.label}
                    >
                      <IconComponent size={20} />
                    </a>
                  );
                })
              ) : (
                // Fallback while loading or if no links
                <p className="text-sm text-muted">Folge uns bald auf Social Media!</p>
              )}
            </div>
          </div>
        </div>

        {/* Divider */}
        <div style={{ borderTop: "1px solid var(--border)", margin: "2rem 0" }} />

        {/* Bottom Footer */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm-muted">
            © {currentYear} DanceMotion Eschweiler. Alle Rechte vorbehalten.
          </p>
          <div className="flex gap-4 text-sm">
            <Link href="/impressum" className="text-sm-muted hover:text-accent transition-colors">
              Impressum
            </Link>
            <Link href="/datenschutz" className="text-sm-muted hover:text-accent transition-colors">
              Datenschutz
            </Link>
          </div>
        </div>
      </div>
    </footer>
    </>
  );
}
