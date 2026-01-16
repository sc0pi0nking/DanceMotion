import DocumentsView from '@/app/components/DocumentsView';

export const metadata = {
  title: 'Dokumente - DanceMotion',
  description: 'Download von wichtigen Dokumenten',
};

export default function FormularePage() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--bg)', color: 'var(--fg)' }}>
      {/* Header */}
      <div className="pt-24 pb-12 px-6" style={{ backgroundImage: 'linear-gradient(135deg, rgba(46,196,198,0.1) 0%, rgba(0,212,212,0.05) 100%)' }}>
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Dokumente</h1>
          <p className="text-lg" style={{ color: 'var(--muted)' }}>
            Wichtige Dokumente zum Download
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-6 py-12">
        <DocumentsView />
      </div>
    </div>
  );
}
