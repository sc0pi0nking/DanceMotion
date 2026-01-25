"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Mail, MapPin, Phone, Instagram, Facebook, Youtube, Twitter, Music2, Link as LinkIcon, MessageSquare, Edit2, Save, X } from "lucide-react";
import TicketModal from "./TicketModal";

interface SocialLink {
  id: string;
  platform: string;
  url: string;
  icon: string;
  label: string;
}

interface ContactInfo {
  email: string;
  phone: string;
  location: string;
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
  const [contactInfo, setContactInfo] = useState<ContactInfo>({
    email: "info@dancemotion-eschweiler.de",
    phone: "+49 (0) 2405 87 51",
    location: "Eschweiler, NRW",
  });
  const [ticketModalOpen, setTicketModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editValues, setEditValues] = useState<ContactInfo>(contactInfo);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch social links
        const socialRes = await fetch("/api/social-links");
        const socialData = await socialRes.json();
        if (socialData.success && socialData.data) {
          setSocialLinks(socialData.data);
        }

        // Fetch contact info from content API
        const contactRes = await fetch("/api/admin/content");
        const contentData = await contactRes.json();
        if (Array.isArray(contentData)) {
          const contactContent = contentData.filter((item: any) => item.section === "Footer");
          const emailItem = contactContent.find((item: any) => item.key === "footer_email");
          const phoneItem = contactContent.find((item: any) => item.key === "footer_phone");
          const locationItem = contactContent.find((item: any) => item.key === "footer_location");
          
          if (emailItem || phoneItem || locationItem) {
            const newInfo = {
              email: emailItem?.value?.text || emailItem?.value || contactInfo.email,
              phone: phoneItem?.value?.text || phoneItem?.value || contactInfo.phone,
              location: locationItem?.value?.text || locationItem?.value || contactInfo.location,
            };
            setContactInfo(newInfo);
            setEditValues(newInfo);
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
    fetchData();
  }, []);

  const handleEditClick = () => {
    setEditValues(contactInfo);
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Save email
      await fetch("/api/admin/content/footer_email", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          value: { text: editValues.email },
          section: "Footer",
        }),
      });

      // Save phone
      await fetch("/api/admin/content/footer_phone", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          value: { text: editValues.phone },
          section: "Footer",
        }),
      });

      // Save location
      await fetch("/api/admin/content/footer_location", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          value: { text: editValues.location },
          section: "Footer",
        }),
      });

      setContactInfo(editValues);
      setIsEditing(false);
    } catch (error) {
      console.error("Save failed:", error);
    } finally {
      setIsSaving(false);
    }
  };

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
      <footer className="site-footer w-full relative z-20" style={{ borderColor: "var(--border)", backgroundColor: "var(--bg)", marginBottom: "0" }}>
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
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-sm font-semibold" style={{ color: "var(--fg)" }}>Kontakt</h4>
              {!isEditing && (
                <button
                  onClick={handleEditClick}
                  className="p-1 hover:bg-accent/10 rounded transition opacity-0 hover:opacity-100 group-hover:opacity-100"
                  title="Kontaktinfos bearbeiten"
                >
                  <Edit2 size={14} style={{ color: "var(--accent)" }} />
                </button>
              )}
            </div>

            {isEditing ? (
              <div className="space-y-3 bg-gray-50 dark:bg-gray-800/50 p-3 rounded-lg border border-gray-200 dark:border-gray-700">
                <input
                  type="email"
                  value={editValues.email}
                  onChange={(e) => setEditValues({ ...editValues, email: e.target.value })}
                  className="w-full px-2 py-1.5 text-sm border rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  placeholder="Email"
                />
                <input
                  type="tel"
                  value={editValues.phone}
                  onChange={(e) => setEditValues({ ...editValues, phone: e.target.value })}
                  className="w-full px-2 py-1.5 text-sm border rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  placeholder="Telefon"
                />
                <input
                  type="text"
                  value={editValues.location}
                  onChange={(e) => setEditValues({ ...editValues, location: e.target.value })}
                  className="w-full px-2 py-1.5 text-sm border rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  placeholder="Ort"
                />
                <div className="flex gap-2">
                  <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="flex-1 px-2 py-1.5 bg-accent text-white text-sm rounded hover:opacity-90 disabled:opacity-50 font-medium flex items-center justify-center gap-1"
                  >
                    <Save size={14} />
                    Speichern
                  </button>
                  <button
                    onClick={handleCancel}
                    className="flex-1 px-2 py-1.5 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-100 text-sm rounded hover:bg-gray-400 dark:hover:bg-gray-500 font-medium flex items-center justify-center gap-1"
                  >
                    <X size={14} />
                    Abbrechen
                  </button>
                </div>
              </div>
            ) : (
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <Mail size={16} style={{ color: "var(--accent)", marginTop: "2px" }} />
                  <a href={`mailto:${contactInfo.email}`} className="text-sm-muted hover:text-accent transition-colors">
                    {contactInfo.email}
                  </a>
                </li>
                <li className="flex items-start gap-3">
                  <Phone size={16} style={{ color: "var(--accent)", marginTop: "2px" }} />
                  <a href={`tel:${contactInfo.phone.replace(/\s/g, '')}`} className="text-sm-muted hover:text-accent transition-colors">
                    {contactInfo.phone}
                  </a>
                </li>
                <li className="flex items-start gap-3">
                  <MapPin size={16} style={{ color: "var(--accent)", marginTop: "2px" }} />
                  <span className="text-sm-muted">
                    {contactInfo.location}
                  </span>
                </li>
              </ul>
            )}
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
          <div className="flex gap-4 text-sm flex-wrap justify-center">
            <button
              onClick={() => setTicketModalOpen(true)}
              className="text-sm-muted hover:text-accent transition-colors flex items-center gap-1"
            >
              <MessageSquare size={16} />
              Fehler melden
            </button>
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
    <TicketModal isOpen={ticketModalOpen} onClose={() => setTicketModalOpen(false)} />
    </>
  );
}
