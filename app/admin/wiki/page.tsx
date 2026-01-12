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
} from 'lucide-react';

export default function WikiPage() {
  const [activeSection, setActiveSection] = useState('about');
  const [expandedItems, setExpandedItems] = useState<string[]>(['about']);

  const toggleExpand = (id: string) => {
    setExpandedItems(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const sections = [
    {
      id: 'about',
      title: 'Über DanceMotion',
      icon: Heart,
      description: 'Wer wir sind und wofür wir stehen',
      content: (
        <div className="space-y-6">
          <div>
            <h2 className="text-3xl font-bold mb-4" style={{ color: 'var(--fg)' }}>
              DanceMotion Eschweiler
            </h2>
            <p style={{ color: 'var(--muted)' }} className="text-lg leading-relaxed mb-4">
              DanceMotion ist eine offene Tanzgemeinschaft in Eschweiler, die Menschen jeden Alters zusammenbringt. 
              Wir glauben, dass Tanzen ein universales Ausdrucksmittel ist – für Freude, Kreativität und Gemeinschaft.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 rounded-lg" style={{ backgroundColor: 'var(--panel)', border: '1px solid var(--border)' }}>
              <Trophy className="w-8 h-8 mb-3" style={{ color: 'var(--accent)' }} />
              <h3 className="font-bold mb-2" style={{ color: 'var(--fg)' }}>Unsere Mission</h3>
              <p style={{ color: 'var(--muted)' }} className="text-sm">
                Schaffen eines inklusiven Raums, wo Tanz Leidenschaft, Ausdruck und Gemeinschaft fördert.
              </p>
            </div>

            <div className="p-6 rounded-lg" style={{ backgroundColor: 'var(--panel)', border: '1px solid var(--border)' }}>
              <Target className="w-8 h-8 mb-3" style={{ color: 'var(--accent)' }} />
              <h3 className="font-bold mb-2" style={{ color: 'var(--fg)' }}>Unsere Vision</h3>
              <p style={{ color: 'var(--muted)' }} className="text-sm">
                Ein anerkannter Tanzverein, der kulturelle Vielfalt feiert und professionelle Standards setzt.
              </p>
            </div>

            <div className="p-6 rounded-lg" style={{ backgroundColor: 'var(--panel)', border: '1px solid var(--border)' }}>
              <Zap className="w-8 h-8 mb-3" style={{ color: 'var(--accent)' }} />
              <h3 className="font-bold mb-2" style={{ color: 'var(--fg)' }}>Energie & Leidenschaft</h3>
              <p style={{ color: 'var(--muted)' }} className="text-sm">
                Jede Bewegung erzählt eine Geschichte. Wir bringen diese Geschichten auf die Bühne.
              </p>
            </div>

            <div className="p-6 rounded-lg" style={{ backgroundColor: 'var(--panel)', border: '1px solid var(--border)' }}>
              <Users className="w-8 h-8 mb-3" style={{ color: 'var(--accent)' }} />
              <h3 className="font-bold mb-2" style={{ color: 'var(--fg)' }}>Community First</h3>
              <p style={{ color: 'var(--muted)' }} className="text-sm">
                Wir sind eine Familie. Zusammen wachsen, zusammen feiern, zusammen tanzen.
              </p>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'groups',
      title: 'Unsere Gruppen',
      icon: Users,
      description: 'Alle Tanzgruppen im Überblick',
      content: (
        <div className="space-y-6">
          <h2 className="text-3xl font-bold" style={{ color: 'var(--fg)' }}>
            Vier Tanzgruppen, ein Ziel
          </h2>

          <div className="grid gap-6">
            {[
              {
                name: 'Little Joys',
                emoji: '👶',
                description: 'Für die Kleinsten — spielerisch, lustig und mit viel Bewegung.',
                colors: ['#FFD700', '#FFA500'],
              },
              {
                name: 'Smileys',
                emoji: '😊',
                description: 'Fröhliche Gruppe für Kinder mit modernem Tanzstil.',
                colors: ['#FF6B9D', '#C44569'],
              },
              {
                name: 'Emotion',
                emoji: '⚡',
                description: 'Für Jugendliche und Erwachsene — ausdrucksstark und energiegeladen.',
                colors: ['#00D4FF', '#0099FF'],
              },
              {
                name: 'Event Studio',
                emoji: '🎭',
                description: 'Professionelle Vermietung für Events, Kurse und Workshops.',
                colors: ['#00D4FF', '#2EC4C6'],
              },
            ].map((group) => (
              <div
                key={group.name}
                className="p-6 rounded-xl border transition-all hover:shadow-lg"
                style={{
                  backgroundColor: 'var(--panel)',
                  borderColor: 'var(--border)',
                  borderWidth: '1px',
                }}
              >
                <div className="flex items-start gap-4">
                  <div className="text-4xl">{group.emoji}</div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold mb-2" style={{ color: 'var(--fg)' }}>
                      {group.name}
                    </h3>
                    <p style={{ color: 'var(--muted)' }} className="mb-4">
                      {group.description}
                    </p>
                    <Link
                      href={`/gruppen/${group.name.toLowerCase().replace(' ', '-')}`}
                      className="inline-block px-4 py-2 rounded-full font-semibold transition-all text-sm"
                      style={{
                        backgroundColor: 'var(--accent)',
                        color: 'var(--bg)',
                      }}
                    >
                      Mehr erfahren →
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ),
    },
    {
      id: 'management',
      title: 'Management & Team',
      icon: Briefcase,
      description: 'Organigramm und Verantwortlichkeiten',
      content: (
        <div className="space-y-6">
          <h2 className="text-3xl font-bold" style={{ color: 'var(--fg)' }}>
            Vorstand & Leitung
          </h2>

          <div className="space-y-4">
            {[
              {
                role: 'Vorsitz',
                responsibility: 'Gesamtverantwortung, strategische Ausrichtung',
                icon: '👔',
              },
              {
                role: 'Schatzmeister',
                responsibility: 'Finanzen, Budget, Abrechnungen',
                icon: '💰',
              },
              {
                role: 'Schriftführer',
                responsibility: 'Dokumentation, Protokolle, Verwaltung',
                icon: '📝',
              },
              {
                role: 'IT & Webentwicklung',
                responsibility: 'Website, Apps, Digitale Infrastruktur',
                icon: '💻',
              },
              {
                role: 'Gruppenleitern',
                responsibility: 'Choreo, Training, Gruppenmanagement',
                icon: '🎭',
              },
            ].map((item) => (
              <div
                key={item.role}
                className="p-4 rounded-lg flex items-start gap-4"
                style={{
                  backgroundColor: 'var(--panel)',
                  border: '1px solid var(--border)',
                }}
              >
                <div className="text-3xl">{item.icon}</div>
                <div className="flex-1">
                  <h3 className="font-bold" style={{ color: 'var(--fg)' }}>
                    {item.role}
                  </h3>
                  <p style={{ color: 'var(--muted)' }} className="text-sm">
                    {item.responsibility}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      ),
    },
    {
      id: 'identity',
      title: 'Design & Corporate Identity',
      icon: Palette,
      description: 'Farbschema, Logo und visuelle Identität',
      content: (
        <div className="space-y-6">
          <h2 className="text-3xl font-bold" style={{ color: 'var(--fg)' }}>
            Visuelle Identität
          </h2>

          <div>
            <h3 className="text-xl font-bold mb-4" style={{ color: 'var(--fg)' }}>
              Farbpalette
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { name: 'Accent (Teal)', color: '#2EC4C6' },
                { name: 'Light Background', color: '#FAF5ED' },
                { name: 'Dark Background', color: '#0A0A0A' },
                { name: 'Muted Text', color: '#6B5B4F' },
              ].map((item) => (
                <div key={item.color} className="text-center">
                  <div
                    className="h-24 rounded-lg mb-3 border-2"
                    style={{
                      backgroundColor: item.color,
                      borderColor: 'var(--border)',
                    }}
                  ></div>
                  <p className="font-mono text-sm" style={{ color: 'var(--muted)' }}>
                    {item.color}
                  </p>
                  <p style={{ color: 'var(--fg)' }} className="text-xs font-semibold mt-1">
                    {item.name}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-4" style={{ color: 'var(--fg)' }}>
              Logo Verwendung
            </h3>
            <ul style={{ color: 'var(--muted)' }} className="space-y-2">
              <li>✓ Ein einheitliches Hauptlogo für alle Auftritt</li>
              <li>✓ Gruppeneigene Logos für Ereignisse und Promotions</li>
              <li>✓ Event-Studio Logo für kommerzielle Events</li>
              <li>✓ Konsistente Farbgebung über alle Medien</li>
            </ul>
          </div>
        </div>
      ),
    },
    {
      id: 'values',
      title: 'Werte & Standards',
      icon: Shield,
      description: 'Ethik, Qualität und Verantwortung',
      content: (
        <div className="space-y-6">
          <h2 className="text-3xl font-bold" style={{ color: 'var(--fg)' }}>
            Unsere Werte
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            {[
              {
                title: 'Inklusion',
                icon: '🤝',
                description: 'Jeder ist willkommen, unabhängig von Alter, Fähigkeit oder Hintergrund.',
              },
              {
                title: 'Exzellenz',
                icon: '⭐',
                description: 'Wir streben nach hohen Qualitätsstandards in allen unseren Aktivitäten.',
              },
              {
                title: 'Kreativität',
                icon: '🎨',
                description: 'Wir ermutigen innovatives Denken und künstlerischen Ausdruck.',
              },
              {
                title: 'Respekt',
                icon: '🙏',
                description: 'Gegenseitiger Respekt ist das Fundament unserer Gemeinschaft.',
              },
              {
                title: 'Verantwortung',
                icon: '💪',
                description: 'Wir sind verantwortlich für unsere Entscheidungen und Handlungen.',
              },
              {
                title: 'Freude',
                icon: '🎉',
                description: 'Tanz soll Spaß machen — Freude ist unser antreibendes Prinzip.',
              },
            ].map((value) => (
              <div
                key={value.title}
                className="p-6 rounded-lg"
                style={{
                  backgroundColor: 'var(--panel)',
                  border: '1px solid var(--border)',
                }}
              >
                <div className="text-3xl mb-3">{value.icon}</div>
                <h3 className="font-bold mb-2" style={{ color: 'var(--fg)' }}>
                  {value.title}
                </h3>
                <p style={{ color: 'var(--muted)' }} className="text-sm leading-relaxed">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--bg)', color: 'var(--fg)' }}>
      {/* Header */}
      <div
        className="p-6 border-b"
        style={{ backgroundColor: 'var(--panel)', borderColor: 'var(--border)' }}
      >
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-3 mb-2">
            <Book className="w-8 h-8" style={{ color: 'var(--accent)' }} />
            <h1 className="text-3xl font-bold">DanceMotion Wiki</h1>
          </div>
          <p style={{ color: 'var(--muted)' }}>
            Alles über unsere Organisation, Werte und Vision
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Navigation */}
          <aside className="lg:col-span-1">
            <nav className="space-y-2 sticky top-6">
              {sections.map((section) => {
                const Icon = section.icon;
                const isExpanded = expandedItems.includes(section.id);

                return (
                  <button
                    key={section.id}
                    onClick={() => {
                      setActiveSection(section.id);
                      toggleExpand(section.id);
                    }}
                    className="w-full text-left p-3 rounded-lg transition-all"
                    style={{
                      backgroundColor:
                        activeSection === section.id
                          ? 'var(--panel)'
                          : 'transparent',
                      borderColor: 'var(--border)',
                      borderWidth: activeSection === section.id ? '1px' : '0',
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Icon
                          size={20}
                          style={{
                            color:
                              activeSection === section.id
                                ? 'var(--accent)'
                                : 'var(--muted)',
                          }}
                        />
                        <div className="text-left">
                          <div className="font-semibold" style={{ color: 'var(--fg)' }}>
                            {section.title}
                          </div>
                          <div
                            className="text-xs"
                            style={{ color: 'var(--muted)' }}
                          >
                            {section.description}
                          </div>
                        </div>
                      </div>
                      {isExpanded ? (
                        <ChevronDown size={18} />
                      ) : (
                        <ChevronRight size={18} />
                      )}
                    </div>
                  </button>
                );
              })}
            </nav>
          </aside>

          {/* Main Content */}
          <main className="lg:col-span-2">
            <div className="prose prose-invert max-w-none">
              {sections.find((s) => s.id === activeSection)?.content}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
