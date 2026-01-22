import DocumentsView from '@/app/components/DocumentsView';
import TicketForm from '@/app/components/TicketForm';

export const metadata = {
  title: 'Formulare - DanceMotion',
  description: 'Kontakt-Formulare und Support-Anfragen',
};

export default function FormularePage() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--bg)', color: 'var(--fg)' }}>
      {/* Header */}
      <div className="pt-24 pb-12 px-6" style={{ backgroundImage: 'linear-gradient(135deg, rgba(46,196,198,0.1) 0%, rgba(0,212,212,0.05) 100%)' }}>
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Formulare & Support</h1>
          <p className="text-lg" style={{ color: 'var(--muted)' }}>
            Reiche eine Anfrage ein oder lade Dokumente herunter
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Ticket Form */}
          <div>
            <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-gray-100">Anfrage einreichen</h2>
            <TicketForm />
          </div>

          {/* Documents */}
          <div>
            <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-gray-100">Dokumente</h2>
            <DocumentsView />
          </div>
        </div>
      </div>
    </div>
  );
}
