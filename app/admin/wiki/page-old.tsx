'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  Book, 
  Zap,
  Users, 
  Briefcase,
  Heart,
  Target,
  MessageCircle,
  Eye,
  Code,
  Palette,
  Shield,
  Trophy,
  ChevronDown,
  ChevronRight,
  ExternalLink,
} from 'lucide-react';

interface WikiSection {
  id: string;
  title: string;
  icon: React.ElementType;
  description: string;
  content: React.ReactNode;
}

export default function WikiPage() {
  const [activeSection, setActiveSection] = useState('overview');
  const [expandedSections, setExpandedSections] = useState<string[]>(['admin-guide']);
  const [copiedCommand, setCopiedCommand] = useState<string | null>(null);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCommand(id);
    setTimeout(() => setCopiedCommand(null), 2000);
  };

  const CodeBlock = ({ children, id }: { children: string; id: string }) => (
    <div className="relative group">
      <pre className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto text-sm font-mono">
        {children}
      </pre>
      <button
        onClick={() => copyToClipboard(children, id)}
        className="absolute top-2 right-2 p-2 bg-gray-700 hover:bg-gray-600 rounded opacity-0 group-hover:opacity-100 transition-opacity"
        title="Kopieren"
      >
        {copiedCommand === id ? (
          <Check size={14} className="text-green-400" />
        ) : (
          <Copy size={14} className="text-gray-300" />
        )}
      </button>
    </div>
  );

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev => 
      prev.includes(sectionId) 
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  const sections: WikiSection[] = [
    {
      id: 'overview',
      title: 'Übersicht',
      icon: Book,
      content: (
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Willkommen im DanceMotion Admin-Wiki</h2>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
              Dieses Wiki enthält alle wichtigen Informationen zur Verwaltung der DanceMotion Website. 
              Hier finden Sie Anleitungen für alle Admin-Funktionen sowie technische Dokumentation für Entwickler.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <h3 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">🎯 Für Admins</h3>
              <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
                <li>• Termine verwalten</li>
                <li>• Inhalte bearbeiten</li>
                <li>• Galerie & Dokumente</li>
                <li>• Event-Anfragen bearbeiten</li>
                <li>• FAQ & Team verwalten</li>
              </ul>
            </div>
            <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
              <h3 className="font-semibold text-purple-800 dark:text-purple-200 mb-2">💻 Für Entwickler</h3>
              <ul className="text-sm text-purple-700 dark:text-purple-300 space-y-1">
                <li>• Deployment-Commands</li>
                <li>• Datenbank-Struktur</li>
                <li>• API-Dokumentation</li>
                <li>• Projektstruktur</li>
              </ul>
            </div>
          </div>

          <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
            <h3 className="font-semibold text-yellow-800 dark:text-yellow-200 mb-2">⚡ Quick Links</h3>
            <div className="flex flex-wrap gap-2">
              <a href="/admin/events" className="px-3 py-1 bg-yellow-200 dark:bg-yellow-800 text-yellow-800 dark:text-yellow-200 rounded-full text-sm hover:opacity-80">Termine</a>
              <a href="/admin/content" className="px-3 py-1 bg-yellow-200 dark:bg-yellow-800 text-yellow-800 dark:text-yellow-200 rounded-full text-sm hover:opacity-80">Inhalte</a>
              <a href="/admin/gallery" className="px-3 py-1 bg-yellow-200 dark:bg-yellow-800 text-yellow-800 dark:text-yellow-200 rounded-full text-sm hover:opacity-80">Galerie</a>
              <a href="/admin/faqs" className="px-3 py-1 bg-yellow-200 dark:bg-yellow-800 text-yellow-800 dark:text-yellow-200 rounded-full text-sm hover:opacity-80">FAQ</a>
              <a href="/admin/team" className="px-3 py-1 bg-yellow-200 dark:bg-yellow-800 text-yellow-800 dark:text-yellow-200 rounded-full text-sm hover:opacity-80">Team</a>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'events',
      title: 'Termine verwalten',
      icon: Calendar,
      content: (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">📅 Termine verwalten</h2>
          
          <div className="space-y-4">
            <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <h3 className="font-semibold mb-2 text-gray-900 dark:text-white">Neuen Termin erstellen</h3>
              <ol className="list-decimal list-inside text-gray-600 dark:text-gray-300 space-y-2">
                <li>Gehe zu <a href="/admin/events" className="text-blue-600 hover:underline">Admin → Termine</a></li>
                <li>Klicke auf "+ Neuer Termin"</li>
                <li>Fülle alle Pflichtfelder aus:
                  <ul className="list-disc list-inside ml-4 mt-1 text-sm">
                    <li><strong>Titel:</strong> Name des Events</li>
                    <li><strong>Datum:</strong> Wann findet es statt?</li>
                    <li><strong>Uhrzeit:</strong> Format: HH:MM (z.B. 18:00)</li>
                    <li><strong>Beschreibung:</strong> Was passiert?</li>
                  </ul>
                </li>
                <li>Klicke "Speichern"</li>
              </ol>
            </div>

            <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <h3 className="font-semibold mb-2 text-gray-900 dark:text-white">Termin bearbeiten / löschen</h3>
              <ul className="text-gray-600 dark:text-gray-300 space-y-2">
                <li>✏️ <strong>Bearbeiten:</strong> Klicke auf den Bearbeiten-Button beim Termin</li>
                <li>🗑️ <strong>Löschen:</strong> Klicke auf das Papierkorb-Symbol</li>
              </ul>
            </div>

            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <h3 className="font-semibold mb-2 text-blue-800 dark:text-blue-200">💡 Tipp</h3>
              <p className="text-blue-700 dark:text-blue-300 text-sm">
                Termine werden auf der öffentlichen <a href="/termine" className="underline">Termine-Seite</a> automatisch 
                chronologisch sortiert angezeigt. Vergangene Termine werden automatisch ausgeblendet.
              </p>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'content',
      title: 'Inhalte bearbeiten',
      icon: FileText,
      content: (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">📝 Inhalte bearbeiten</h2>
          
          <div className="space-y-4">
            <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <h3 className="font-semibold mb-2 text-gray-900 dark:text-white">Inline-Bearbeitung (Direkt auf der Seite)</h3>
              <ol className="list-decimal list-inside text-gray-600 dark:text-gray-300 space-y-2">
                <li>Melde dich als Admin an</li>
                <li>Gehe zur öffentlichen Seite (z.B. Startseite)</li>
                <li>Fahre mit der Maus über einen Text → erscheint ein ✏️ Symbol</li>
                <li>Klicke darauf und bearbeite den Text</li>
                <li>Klicke außerhalb oder drücke Enter zum Speichern</li>
              </ol>
            </div>

            <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <h3 className="font-semibold mb-2 text-gray-900 dark:text-white">Bearbeitbare Bereiche</h3>
              <table className="w-full text-sm text-gray-600 dark:text-gray-300">
                <thead>
                  <tr className="border-b dark:border-gray-700">
                    <th className="text-left py-2">Seite</th>
                    <th className="text-left py-2">Was kann bearbeitet werden?</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b dark:border-gray-700">
                    <td className="py-2">Startseite</td>
                    <td>Hero-Titel, Untertitel, Beschreibungen</td>
                  </tr>
                  <tr className="border-b dark:border-gray-700">
                    <td className="py-2">Gruppen-Seiten</td>
                    <td>Titel, Beschreibungen für jede Gruppe</td>
                  </tr>
                  <tr className="border-b dark:border-gray-700">
                    <td className="py-2">Impressum</td>
                    <td>Alle Textabschnitte</td>
                  </tr>
                  <tr>
                    <td className="py-2">Datenschutz</td>
                    <td>Alle Textabschnitte</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
              <h3 className="font-semibold mb-2 text-green-800 dark:text-green-200">✅ Vorteile der Inline-Bearbeitung</h3>
              <ul className="text-green-700 dark:text-green-300 text-sm space-y-1">
                <li>• Sofort sehen, wie es aussieht</li>
                <li>• Keine Verwechslung welcher Text wo angezeigt wird</li>
                <li>• Änderungen werden sofort gespeichert</li>
              </ul>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'gallery',
      title: 'Galerie & Dokumente',
      icon: Images,
      content: (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">🖼️ Galerie & 📄 Dokumente</h2>
          
          <div className="space-y-4">
            <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <h3 className="font-semibold mb-2 text-gray-900 dark:text-white">Bilder hochladen (Galerie)</h3>
              <ol className="list-decimal list-inside text-gray-600 dark:text-gray-300 space-y-2">
                <li>Gehe zu <a href="/admin/gallery" className="text-blue-600 hover:underline">Admin → Galerie</a></li>
                <li>Klicke auf "Bilder hochladen" oder ziehe Dateien in den Upload-Bereich</li>
                <li>Wähle eine oder mehrere Bilder (JPG, PNG, GIF, WebP)</li>
                <li>Gib jedem Bild einen Titel und optionale Beschreibung</li>
                <li>Bilder erscheinen automatisch auf <a href="/galerie" className="text-blue-600 hover:underline">/galerie</a></li>
              </ol>
            </div>

            <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <h3 className="font-semibold mb-2 text-gray-900 dark:text-white">Dokumente/PDFs hochladen</h3>
              <ol className="list-decimal list-inside text-gray-600 dark:text-gray-300 space-y-2">
                <li>Gehe zu <a href="/admin/documents" className="text-blue-600 hover:underline">Admin → Dokumente</a></li>
                <li>Klicke auf "Dokument hochladen"</li>
                <li>Wähle eine PDF-Datei (max. 10 MB)</li>
                <li>Gib dem Dokument einen aussagekräftigen Titel</li>
                <li>Dokumente erscheinen auf <a href="/formulare" className="text-blue-600 hover:underline">/formulare</a></li>
              </ol>
            </div>

            <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
              <h3 className="font-semibold mb-2 text-red-800 dark:text-red-200">⚠️ Wichtig</h3>
              <ul className="text-red-700 dark:text-red-300 text-sm space-y-1">
                <li>• <strong>Bilder:</strong> Maximal 5 MB pro Bild empfohlen</li>
                <li>• <strong>PDFs:</strong> Maximal 10 MB pro Dokument</li>
                <li>• Gelöschte Dateien können nicht wiederhergestellt werden!</li>
              </ul>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'event-requests',
      title: 'Event-Anfragen',
      icon: MessageCircle,
      content: (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">📩 Event-Anfragen bearbeiten</h2>
          
          <div className="space-y-4">
            <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <h3 className="font-semibold mb-2 text-gray-900 dark:text-white">Status-Workflow</h3>
              <div className="flex flex-wrap gap-2 mb-3">
                <span className="px-3 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 rounded-full text-sm">🆕 Neu</span>
                <span className="text-gray-400">→</span>
                <span className="px-3 py-1 bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200 rounded-full text-sm">👁️ Gelesen</span>
                <span className="text-gray-400">→</span>
                <span className="px-3 py-1 bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200 rounded-full text-sm">⏳ In Bearbeitung</span>
                <span className="text-gray-400">→</span>
                <span className="px-3 py-1 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 rounded-full text-sm">✅ Abgeschlossen</span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Oder: <span className="px-2 py-0.5 bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 rounded text-xs">❌ Abgelehnt</span>
              </p>
            </div>

            <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <h3 className="font-semibold mb-2 text-gray-900 dark:text-white">Anfrage bearbeiten</h3>
              <ol className="list-decimal list-inside text-gray-600 dark:text-gray-300 space-y-2">
                <li>Gehe zu <a href="/admin/event-requests" className="text-blue-600 hover:underline">Admin → Event-Anfragen</a></li>
                <li>Klicke auf eine Anfrage in der Liste</li>
                <li>Sieh dir die Details an (Name, E-Mail, Event-Art, Wunschdatum, etc.)</li>
                <li>Ändere den Status mit den Buttons oben</li>
                <li>Füge interne Notizen hinzu (nur für Admins sichtbar)</li>
                <li>Kontaktiere den Kunden per E-Mail oder Telefon</li>
              </ol>
            </div>

            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <h3 className="font-semibold mb-2 text-blue-800 dark:text-blue-200">🔒 DSGVO-Hinweis</h3>
              <p className="text-blue-700 dark:text-blue-300 text-sm">
                Anfragen werden automatisch gelöscht:<br/>
                • <strong>90 Tage</strong> nach Abschluss/Ablehnung<br/>
                • <strong>180 Tage</strong> wenn unbearbeitet
              </p>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'faq',
      title: 'FAQ verwalten',
      icon: HelpCircle,
      content: (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">❓ FAQ verwalten</h2>
          
          <div className="space-y-4">
            <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <h3 className="font-semibold mb-2 text-gray-900 dark:text-white">Neue FAQ erstellen</h3>
              <ol className="list-decimal list-inside text-gray-600 dark:text-gray-300 space-y-2">
                <li>Gehe zu <a href="/admin/faqs" className="text-blue-600 hover:underline">Admin → FAQ</a></li>
                <li>Klicke auf "Neue FAQ"</li>
                <li>Fülle aus:
                  <ul className="list-disc list-inside ml-4 mt-1 text-sm">
                    <li><strong>Frage:</strong> Die häufig gestellte Frage</li>
                    <li><strong>Antwort:</strong> Die Antwort darauf</li>
                    <li><strong>Kategorie:</strong> Wähle eine passende Kategorie</li>
                  </ul>
                </li>
                <li>Aktiviere "Veröffentlicht" für Sichtbarkeit</li>
                <li>Klicke "Speichern"</li>
              </ol>
            </div>

            <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <h3 className="font-semibold mb-2 text-gray-900 dark:text-white">Kategorien</h3>
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm">kurse</span>
                <span className="px-3 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-full text-sm">anmeldung</span>
                <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 rounded-full text-sm">events</span>
                <span className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-full text-sm">allgemein</span>
              </div>
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                Neue Kategorien können einfach eingetippt werden.
              </p>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'team',
      title: 'Team verwalten',
      icon: Users,
      content: (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">👥 Team verwalten</h2>
          
          <div className="space-y-4">
            <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <h3 className="font-semibold mb-2 text-gray-900 dark:text-white">Neues Team-Mitglied hinzufügen</h3>
              <ol className="list-decimal list-inside text-gray-600 dark:text-gray-300 space-y-2">
                <li>Gehe zu <a href="/admin/team" className="text-blue-600 hover:underline">Admin → Team</a></li>
                <li>Klicke auf "Neues Mitglied"</li>
                <li>Fülle aus:
                  <ul className="list-disc list-inside ml-4 mt-1 text-sm">
                    <li><strong>Name:</strong> Vor- und Nachname</li>
                    <li><strong>Rolle:</strong> z.B. "Trainerin Hip-Hop"</li>
                    <li><strong>Bio:</strong> Kurze Beschreibung</li>
                    <li><strong>Bild:</strong> Profilfoto hochladen</li>
                    <li><strong>Social Links:</strong> Instagram, Facebook, E-Mail</li>
                  </ul>
                </li>
                <li>Speichern</li>
              </ol>
            </div>

            <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <h3 className="font-semibold mb-2 text-gray-900 dark:text-white">Reihenfolge ändern</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Die Reihenfolge wird über das Feld "Reihenfolge" (Nummer) gesteuert. 
                Niedrigere Zahlen erscheinen weiter oben.
              </p>
            </div>

            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <h3 className="font-semibold mb-2 text-blue-800 dark:text-blue-200">💡 Bildempfehlung</h3>
              <p className="text-blue-700 dark:text-blue-300 text-sm">
                Quadratische Bilder (1:1 Format) funktionieren am besten.<br/>
                Ideale Größe: 400x400 bis 800x800 Pixel
              </p>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'roles',
      title: 'Rollen & Berechtigungen',
      icon: Shield,
      content: (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">🔐 Rollen & Berechtigungen</h2>
          
          <div className="space-y-4">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-100 dark:bg-gray-800">
                    <th className="text-left p-3 text-gray-900 dark:text-white">Rolle</th>
                    <th className="text-center p-3 text-gray-900 dark:text-white">Termine</th>
                    <th className="text-center p-3 text-gray-900 dark:text-white">Inhalte</th>
                    <th className="text-center p-3 text-gray-900 dark:text-white">Galerie</th>
                    <th className="text-center p-3 text-gray-900 dark:text-white">Dokumente</th>
                    <th className="text-center p-3 text-gray-900 dark:text-white">Event-Anfragen</th>
                    <th className="text-center p-3 text-gray-900 dark:text-white">FAQ</th>
                    <th className="text-center p-3 text-gray-900 dark:text-white">Team</th>
                  </tr>
                </thead>
                <tbody className="text-gray-600 dark:text-gray-300">
                  <tr className="border-b dark:border-gray-700">
                    <td className="p-3 font-medium">👑 Admin</td>
                    <td className="text-center p-3">✅</td>
                    <td className="text-center p-3">✅</td>
                    <td className="text-center p-3">✅</td>
                    <td className="text-center p-3">✅</td>
                    <td className="text-center p-3">✅</td>
                    <td className="text-center p-3">✅</td>
                    <td className="text-center p-3">✅</td>
                  </tr>
                  <tr className="border-b dark:border-gray-700">
                    <td className="p-3 font-medium">📋 Event-Manager</td>
                    <td className="text-center p-3">❌</td>
                    <td className="text-center p-3">❌</td>
                    <td className="text-center p-3">❌</td>
                    <td className="text-center p-3">❌</td>
                    <td className="text-center p-3">✅</td>
                    <td className="text-center p-3">❌</td>
                    <td className="text-center p-3">❌</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-medium">✏️ Editor</td>
                    <td className="text-center p-3">❌</td>
                    <td className="text-center p-3">✅</td>
                    <td className="text-center p-3">✅</td>
                    <td className="text-center p-3">✅</td>
                    <td className="text-center p-3">❌</td>
                    <td className="text-center p-3">✅</td>
                    <td className="text-center p-3">✅</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'dev-commands',
      title: '🔧 Dev: Commands',
      icon: Terminal,
      content: (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">🔧 Entwickler: Commands</h2>
          
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2 text-gray-900 dark:text-white">Lokale Entwicklung</h3>
              <CodeBlock id="dev-local">{`# Dependencies installieren
npm install

# Development Server starten
npm run dev

# Build erstellen
npm run build

# Produktion lokal testen
npm run start`}</CodeBlock>
            </div>

            <div>
              <h3 className="font-semibold mb-2 text-gray-900 dark:text-white">Deployment auf Server</h3>
              <CodeBlock id="deploy">{`# Änderungen committen
git add -A
git commit -m "feat: beschreibung der änderung"

# Pushen
git push origin main

# Auf Server deployen
ssh luca@192.168.178.104 "cd /opt/dancemotion/web && git pull origin main && docker compose up -d --build"`}</CodeBlock>
            </div>

            <div>
              <h3 className="font-semibold mb-2 text-gray-900 dark:text-white">Docker Commands</h3>
              <CodeBlock id="docker">{`# Container Status prüfen
docker compose ps

# Logs anzeigen
docker compose logs -f

# Container neu starten (ohne Build)
docker compose restart

# Container stoppen
docker compose down

# Container mit neuem Build starten
docker compose up -d --build`}</CodeBlock>
            </div>

            <div>
              <h3 className="font-semibold mb-2 text-gray-900 dark:text-white">Server-Zugang</h3>
              <CodeBlock id="server">{`# SSH Verbindung
ssh luca@192.168.178.104

# Projekt-Verzeichnis
cd /opt/dancemotion/web

# Git Status prüfen
git status

# Neueste Änderungen holen
git pull origin main`}</CodeBlock>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'dev-database',
      title: '🗄️ Dev: Datenbank',
      icon: Database,
      content: (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">🗄️ Datenbank-Struktur</h2>
          
          <div className="space-y-4">
            <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <h3 className="font-semibold mb-2 text-gray-900 dark:text-white">Tabellen-Übersicht</h3>
              <table className="w-full text-sm text-gray-600 dark:text-gray-300">
                <thead>
                  <tr className="border-b dark:border-gray-700">
                    <th className="text-left py-2">Tabelle</th>
                    <th className="text-left py-2">Beschreibung</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b dark:border-gray-700">
                    <td className="py-2 font-mono text-blue-600">events</td>
                    <td>Termine/Veranstaltungen</td>
                  </tr>
                  <tr className="border-b dark:border-gray-700">
                    <td className="py-2 font-mono text-blue-600">site_content</td>
                    <td>Bearbeitbare Inhalte (Key-Value)</td>
                  </tr>
                  <tr className="border-b dark:border-gray-700">
                    <td className="py-2 font-mono text-blue-600">gallery_images</td>
                    <td>Galerie-Bilder</td>
                  </tr>
                  <tr className="border-b dark:border-gray-700">
                    <td className="py-2 font-mono text-blue-600">documents</td>
                    <td>PDF-Dokumente</td>
                  </tr>
                  <tr className="border-b dark:border-gray-700">
                    <td className="py-2 font-mono text-blue-600">event_requests</td>
                    <td>Event-Anfragen vom Formular</td>
                  </tr>
                  <tr className="border-b dark:border-gray-700">
                    <td className="py-2 font-mono text-blue-600">faqs</td>
                    <td>FAQ-Einträge</td>
                  </tr>
                  <tr className="border-b dark:border-gray-700">
                    <td className="py-2 font-mono text-blue-600">team_members</td>
                    <td>Team-Mitglieder</td>
                  </tr>
                  <tr className="border-b dark:border-gray-700">
                    <td className="py-2 font-mono text-blue-600">admin_users</td>
                    <td>Admin-Benutzer</td>
                  </tr>
                  <tr>
                    <td className="py-2 font-mono text-blue-600">admin_roles</td>
                    <td>Rollen (admin, editor, event-manager)</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div>
              <h3 className="font-semibold mb-2 text-gray-900 dark:text-white">Migrationen</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm mb-2">
                Migrationen befinden sich in: <code className="bg-gray-200 dark:bg-gray-700 px-1 rounded">supabase/migrations/</code>
              </p>
              <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                <li>• <code>001_create_tables.sql</code> - Basis-Tabellen</li>
                <li>• <code>003_event_requests_and_roles.sql</code> - Event-Anfragen & Rollen</li>
                <li>• <code>004_dsgvo_auto_delete.sql</code> - DSGVO Auto-Delete</li>
                <li>• <code>006_faq_system.sql</code> - FAQ-System</li>
                <li>• <code>007_team_system.sql</code> - Team-System</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-2 text-gray-900 dark:text-white">Supabase Storage Buckets</h3>
              <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                <li>• <code className="bg-gray-200 dark:bg-gray-700 px-1 rounded">images</code> - Galerie-Bilder</li>
                <li>• <code className="bg-gray-200 dark:bg-gray-700 px-1 rounded">documents</code> - PDF-Dokumente</li>
                <li>• <code className="bg-gray-200 dark:bg-gray-700 px-1 rounded">team-images</code> - Team-Profilbilder</li>
              </ul>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'dev-structure',
      title: '📁 Dev: Projektstruktur',
      icon: FolderTree,
      content: (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">📁 Projektstruktur</h2>
          
          <div className="p-4 bg-gray-900 rounded-lg overflow-x-auto">
            <pre className="text-green-400 text-sm font-mono whitespace-pre">{`DanceMotion/
├── app/                      # Next.js App Router
│   ├── layout.tsx            # Root Layout
│   ├── page.tsx              # Startseite
│   ├── globals.css           # Globale Styles
│   │
│   ├── admin/                # Admin-Bereich
│   │   ├── layout.tsx        # Admin Layout mit Navigation
│   │   ├── page.tsx          # Dashboard
│   │   ├── events/           # Termine-Verwaltung
│   │   ├── content/          # Inhalte-Verwaltung
│   │   ├── gallery/          # Galerie-Verwaltung
│   │   ├── documents/        # Dokumente-Verwaltung
│   │   ├── event-requests/   # Event-Anfragen
│   │   ├── faqs/             # FAQ-Verwaltung
│   │   ├── team/             # Team-Verwaltung
│   │   ├── wiki/             # Dieses Wiki
│   │   └── login/            # Login-Seite
│   │
│   ├── api/                  # API Routes
│   │   ├── admin/            # Admin-APIs (auth, crud)
│   │   ├── faqs/             # Public FAQ API
│   │   ├── gallery/          # Public Gallery API
│   │   ├── team/             # Public Team API
│   │   └── event-requests/   # Event Request API
│   │
│   ├── components/           # React Components
│   │   ├── Header.tsx        # Navigation + Mobile Menu
│   │   ├── Footer.tsx        # Footer
│   │   ├── HeroScene.tsx     # 3D Hero Animation
│   │   ├── ThemeToggle.tsx   # Hell/Dunkel Umschalter
│   │   ├── EditableContent.tsx # Inline-Editing
│   │   └── ...               # Weitere Components
│   │
│   ├── gruppen/              # Gruppen-Unterseiten
│   ├── termine/              # Termine-Seite
│   ├── galerie/              # Galerie-Seite
│   ├── faq/                  # FAQ-Seite
│   ├── team/                 # Team-Seite
│   ├── eventstudio/          # Event-Anfrage mit Modal
│   ├── formulare/            # Dokumente-Download
│   ├── impressum/            # Impressum
│   └── datenschutz/          # Datenschutz
│
├── lib/                      # Utility-Funktionen
│   ├── supabase.ts           # Supabase Client
│   ├── auth.ts               # Auth-Funktionen
│   └── utils.ts              # Hilfsfunktionen
│
├── supabase/                 # Datenbank
│   └── migrations/           # SQL-Migrationen
│
├── public/                   # Statische Dateien
├── package.json              # Dependencies
├── next.config.ts            # Next.js Config
├── tailwind.config.ts        # Tailwind Config
├── tsconfig.json             # TypeScript Config
├── dockerfile                # Docker Build
└── docker-compose.yml        # Docker Compose`}</pre>
          </div>
        </div>
      ),
    },
    {
      id: 'dev-api',
      title: '🔌 Dev: API Endpoints',
      icon: Globe,
      content: (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">🔌 API Endpoints</h2>
          
          <div className="space-y-4">
            <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <h3 className="font-semibold mb-2 text-gray-900 dark:text-white">Public APIs (keine Auth)</h3>
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b dark:border-gray-700 text-gray-600 dark:text-gray-300">
                    <th className="text-left py-2">Methode</th>
                    <th className="text-left py-2">Endpoint</th>
                    <th className="text-left py-2">Beschreibung</th>
                  </tr>
                </thead>
                <tbody className="text-gray-600 dark:text-gray-300">
                  <tr className="border-b dark:border-gray-700">
                    <td className="py-2"><span className="px-2 py-0.5 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded text-xs">GET</span></td>
                    <td className="py-2 font-mono text-sm">/api/faqs</td>
                    <td>Alle FAQs abrufen</td>
                  </tr>
                  <tr className="border-b dark:border-gray-700">
                    <td className="py-2"><span className="px-2 py-0.5 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded text-xs">GET</span></td>
                    <td className="py-2 font-mono text-sm">/api/gallery</td>
                    <td>Alle Galerie-Bilder</td>
                  </tr>
                  <tr className="border-b dark:border-gray-700">
                    <td className="py-2"><span className="px-2 py-0.5 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded text-xs">GET</span></td>
                    <td className="py-2 font-mono text-sm">/api/team</td>
                    <td>Alle Team-Mitglieder</td>
                  </tr>
                  <tr>
                    <td className="py-2"><span className="px-2 py-0.5 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded text-xs">POST</span></td>
                    <td className="py-2 font-mono text-sm">/api/event-requests</td>
                    <td>Neue Event-Anfrage</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <h3 className="font-semibold mb-2 text-gray-900 dark:text-white">Admin APIs (Auth erforderlich)</h3>
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b dark:border-gray-700 text-gray-600 dark:text-gray-300">
                    <th className="text-left py-2">Methode</th>
                    <th className="text-left py-2">Endpoint</th>
                    <th className="text-left py-2">Beschreibung</th>
                  </tr>
                </thead>
                <tbody className="text-gray-600 dark:text-gray-300">
                  <tr className="border-b dark:border-gray-700">
                    <td className="py-2"><span className="px-2 py-0.5 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded text-xs">POST</span></td>
                    <td className="py-2 font-mono text-sm">/api/admin/auth/login</td>
                    <td>Admin Login</td>
                  </tr>
                  <tr className="border-b dark:border-gray-700">
                    <td className="py-2"><span className="px-2 py-0.5 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded text-xs">GET</span></td>
                    <td className="py-2 font-mono text-sm">/api/admin/auth/session</td>
                    <td>Session prüfen</td>
                  </tr>
                  <tr className="border-b dark:border-gray-700">
                    <td className="py-2"><span className="px-2 py-0.5 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded text-xs">GET</span></td>
                    <td className="py-2 font-mono text-sm">/api/admin/events</td>
                    <td>Alle Events</td>
                  </tr>
                  <tr className="border-b dark:border-gray-700">
                    <td className="py-2"><span className="px-2 py-0.5 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded text-xs">POST</span></td>
                    <td className="py-2 font-mono text-sm">/api/admin/events</td>
                    <td>Event erstellen</td>
                  </tr>
                  <tr className="border-b dark:border-gray-700">
                    <td className="py-2"><span className="px-2 py-0.5 bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 rounded text-xs">PATCH</span></td>
                    <td className="py-2 font-mono text-sm">/api/admin/events/[id]</td>
                    <td>Event aktualisieren</td>
                  </tr>
                  <tr>
                    <td className="py-2"><span className="px-2 py-0.5 bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 rounded text-xs">DELETE</span></td>
                    <td className="py-2 font-mono text-sm">/api/admin/events/[id]</td>
                    <td>Event löschen</td>
                  </tr>
                </tbody>
              </table>
              <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                Gleiche Struktur für: /faqs, /team, /gallery, /documents, /content
              </p>
            </div>
          </div>
        </div>
      ),
    },
  ];

  const navCategories = [
    {
      id: 'admin-guide',
      title: 'Admin-Anleitung',
      items: sections.filter(s => !s.id.startsWith('dev-')),
    },
    {
      id: 'dev-guide',
      title: 'Entwickler-Dokumentation',
      items: sections.filter(s => s.id.startsWith('dev-')),
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 min-h-screen sticky top-0">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-2">
              <Book className="w-6 h-6 text-blue-600" />
              <h1 className="text-lg font-bold text-gray-900 dark:text-white">Wiki</h1>
            </div>
          </div>

          <nav className="p-4">
            {navCategories.map((category) => (
              <div key={category.id} className="mb-4">
                <button
                  onClick={() => toggleSection(category.id)}
                  className="flex items-center justify-between w-full text-left px-2 py-2 text-sm font-semibold text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                >
                  {category.title}
                  {expandedSections.includes(category.id) ? (
                    <ChevronDown size={16} />
                  ) : (
                    <ChevronRight size={16} />
                  )}
                </button>
                
                {expandedSections.includes(category.id) && (
                  <div className="ml-2 space-y-1">
                    {category.items.map((item) => {
                      const Icon = item.icon;
                      return (
                        <button
                          key={item.id}
                          onClick={() => setActiveSection(item.id)}
                          className={`flex items-center gap-2 w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                            activeSection === item.id
                              ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                              : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                          }`}
                        >
                          <Icon size={16} />
                          <span>{item.title}</span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            ))}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8">
          <div className="max-w-4xl">
            {sections.find(s => s.id === activeSection)?.content}
          </div>
        </main>
      </div>
    </div>
  );
}
