import DocumentsView from '@/app/components/DocumentsView';
// import ContactForm from '@/app/components/ContactForm'; // TODO: Temporär deaktiviert

export const metadata = {
  title: 'Formulare & Dokumente - DanceMotion',
  description: 'Kontaktformular und Download von wichtigen Dokumenten',
};

export default function FormularePage() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--bg)', color: 'var(--fg)' }}>
      {/* Header */}
      <div className="pt-24 pb-12 px-6" style={{ backgroundImage: 'linear-gradient(135deg, rgba(46,196,198,0.1) 0%, rgba(0,212,212,0.05) 100%)' }}>
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Kontakt & Dokumente</h1>
          <p className="text-lg" style={{ color: 'var(--muted)' }}>
            Dokumente zum Download und schnelle Kontaktmöglichkeiten
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid md:grid-cols-2 gap-12">
          {/* Contact Info - Temporär statt Formular */}
          <div>
            <h2 className="text-2xl font-bold mb-6" style={{ color: 'var(--fg)' }}>
              📬 Kontaktieren Sie uns
            </h2>
            <div
              className="p-8 rounded-2xl"
              style={{
                backgroundColor: 'var(--panel)',
                border: '2px solid var(--accent)',
              }}
            >
              <p style={{ color: 'var(--muted)', marginBottom: '1.5rem' }}>
                Senden Sie uns gerne eine Email mit Ihren Fragen oder Anliegen:
              </p>
              <a
                href="mailto:dance-music-school@web.de"
                className="inline-flex items-center gap-3 px-6 py-3 rounded-full font-semibold transition-all hover:scale-105 active:scale-95"
                style={{
                  backgroundColor: 'var(--accent)',
                  color: 'var(--bg)',
                }}
              >
                <span>✉️</span>
                <span>dance-music-school@web.de</span>
              </a>
            </div>
          </div>

          {/* Documents */}
          <div>
            <h2 className="text-2xl font-bold mb-6" style={{ color: 'var(--fg)' }}>
              📄 Dokumente
            </h2>
            <DocumentsView />
          </div>
        </div>
      </div>
    </div>
  );
}
