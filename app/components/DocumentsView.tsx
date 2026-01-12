'use client';

import { useState, useEffect } from 'react';
import { FileText, Download, Search, Filter } from 'lucide-react';

interface Document {
  id: string;
  title: string;
  description?: string;
  category: string;
  file_url: string;
  file_name: string;
  file_size: number;
  is_active?: boolean;
  created_at: string;
}

const CATEGORIES = [
  { value: 'all', label: 'Alle Kategorien' },
  { value: 'anmeldung', label: 'Anmeldeformulare' },
  { value: 'info', label: 'Informationsblätter' },
  { value: 'datenschutz', label: 'Datenschutz & Rechtliches' },
  { value: 'sonstiges', label: 'Sonstige Dokumente' },
];

export default function DocumentsView() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      const res = await fetch('/api/documents');
      if (!res.ok) throw new Error('Failed to fetch documents');
      const data = await res.json();
      setDocuments(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Filter Dokumente
  const filteredDocuments = documents.filter((doc) => {
    const matchesSearch =
      doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.description?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      selectedCategory === 'all' || doc.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  // Gruppiere nach Kategorie
  const groupedDocuments = CATEGORIES.filter((cat) => cat.value !== 'all').map(
    (cat) => ({
      category: cat,
      documents: filteredDocuments.filter((doc) => doc.category === cat.value),
    })
  );

  // Format Dateigröße
  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto mb-4" style={{ borderColor: "var(--accent)" }}></div>
          <p style={{ color: "var(--muted)" }}>Lädt Dokumente...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl font-semibold" style={{ color: "var(--fg)" }}>Fehler beim Laden</p>
          <p className="mt-2" style={{ color: "var(--muted)" }}>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-20 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4" style={{ color: "var(--fg)" }}>
            Formulare & Dokumente
          </h1>
          <p className="text-xl" style={{ color: "var(--muted)" }}>
            Alle wichtigen Unterlagen zum Download
          </p>
        </div>

        {/* Suche & Filter */}
        <div className="rounded-lg shadow-lg p-6 mb-8" style={{ backgroundColor: "var(--panel)", border: "1px solid var(--border)" }}>
          <div className="grid md:grid-cols-2 gap-4">
            {/* Suchfeld */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: "var(--muted)" }} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Dokument suchen..."
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent"
                style={{
                  backgroundColor: "var(--bg)",
                  color: "var(--fg)",
                  borderColor: "var(--border)",
                  "--tw-ring-color": "var(--accent)",
                } as any}
              />
            </div>

            {/* Kategorie Filter */}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: "var(--muted)" }} />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent"
                style={{
                  backgroundColor: "var(--bg)",
                  color: "var(--fg)",
                  borderColor: "var(--border)",
                  "--tw-ring-color": "var(--accent)",
                } as any}
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Ergebnis-Counter */}
          <p className="text-sm mt-4" style={{ color: "var(--muted)" }}>
            {filteredDocuments.length} Dokument(e) gefunden
          </p>
        </div>

        {/* Dokumente Liste */}
        {filteredDocuments.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="w-16 h-16 mx-auto mb-4" style={{ color: "var(--muted)", opacity: 0.3 }} />
            <p className="text-xl" style={{ color: "var(--fg)" }}>Keine Dokumente gefunden</p>
            <p className="text-sm mt-2" style={{ color: "var(--muted)" }}>
              {searchQuery || selectedCategory !== 'all'
                ? 'Versuchen Sie eine andere Suche oder Kategorie'
                : 'Es wurden noch keine Dokumente hochgeladen'}
            </p>
          </div>
        ) : (
          <div className="space-y-8">
            {groupedDocuments.map(
              (group) =>
                group.documents.length > 0 && (
                  <div key={group.category.value}>
                    <h2 className="text-2xl font-bold mb-4 flex items-center gap-2" style={{ color: "var(--fg)" }}>
                      <div className="w-1 h-8 rounded" style={{ backgroundColor: "var(--accent)" }}></div>
                      {group.category.label}
                    </h2>

                    <div className="grid gap-4">
                      {group.documents.map((doc) => (
                        <a
                          key={doc.id}
                          href={doc.file_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="group rounded-lg shadow-lg p-6 hover:shadow-xl transition-all duration-300"
                          style={{
                            backgroundColor: "var(--panel)",
                            border: "2px solid var(--border)",
                          }}
                        >
                          <div className="flex items-start gap-4">
                            {/* PDF Icon */}
                            <div className="w-16 h-16 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform" style={{ backgroundColor: "rgba(46,196,198,0.15)" }}>
                              <FileText className="w-8 h-8" style={{ color: "var(--accent)" }} />
                            </div>

                            {/* Content */}
                            <div className="flex-1 min-w-0">
                              <h3 className="text-xl font-semibold mb-2 transition-colors" style={{ color: "var(--fg)" }}>
                                {doc.title}
                              </h3>
                              {doc.description && (
                                <p className="mb-3" style={{ color: "var(--muted)" }}>
                                  {doc.description}
                                </p>
                              )}
                              <div className="flex flex-wrap gap-3 text-sm" style={{ color: "var(--muted)" }}>
                                <span className="flex items-center gap-1">
                                  <FileText className="w-4 h-4" />
                                  PDF
                                </span>
                                <span>{formatFileSize(doc.file_size)}</span>
                                <span>
                                  {new Date(doc.created_at).toLocaleDateString(
                                    'de-DE'
                                  )}
                                </span>
                              </div>
                            </div>

                            {/* Download Button */}
                            <div className="flex-shrink-0">
                              <div className="w-12 h-12 rounded-lg flex items-center justify-center group-hover:scale-110 transition-all" style={{ backgroundColor: "rgba(46,196,198,0.15)" }}>
                                <Download className="w-6 h-6 transition-colors" style={{ color: "var(--accent)" }} />
                              </div>
                            </div>
                          </div>
                        </a>
                      ))}
                    </div>
                  </div>
                )
            )}
          </div>
        )}
      </div>
    </div>
  );
}
