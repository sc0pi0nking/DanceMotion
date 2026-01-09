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
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Lädt Dokumente...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center text-red-600 dark:text-red-400">
          <p className="text-xl font-semibold">Fehler beim Laden</p>
          <p className="mt-2">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-20 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Formulare & Dokumente
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            Alle wichtigen Unterlagen zum Download
          </p>
        </div>

        {/* Suche & Filter */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
          <div className="grid md:grid-cols-2 gap-4">
            {/* Suchfeld */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Dokument suchen..."
                className="w-full pl-10 pr-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Kategorie Filter */}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
          <p className="text-sm text-gray-500 mt-4">
            {filteredDocuments.length} Dokument(e) gefunden
          </p>
        </div>

        {/* Dokumente Liste */}
        {filteredDocuments.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <p className="text-xl text-gray-500">Keine Dokumente gefunden</p>
            <p className="text-sm text-gray-400 mt-2">
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
                    <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                      <div className="w-1 h-8 bg-blue-600 rounded"></div>
                      {group.category.label}
                    </h2>

                    <div className="grid gap-4">
                      {group.documents.map((doc) => (
                        <a
                          key={doc.id}
                          href={doc.file_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="group bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 hover:shadow-xl transition-all duration-300 border-2 border-transparent hover:border-blue-500"
                        >
                          <div className="flex items-start gap-4">
                            {/* PDF Icon */}
                            <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                              <FileText className="w-8 h-8 text-red-500" />
                            </div>

                            {/* Content */}
                            <div className="flex-1 min-w-0">
                              <h3 className="text-xl font-semibold mb-2 group-hover:text-blue-600 transition-colors">
                                {doc.title}
                              </h3>
                              {doc.description && (
                                <p className="text-gray-600 dark:text-gray-400 mb-3">
                                  {doc.description}
                                </p>
                              )}
                              <div className="flex flex-wrap gap-3 text-sm text-gray-500">
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
                              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center group-hover:bg-blue-600 group-hover:scale-110 transition-all">
                                <Download className="w-6 h-6 text-blue-600 group-hover:text-white transition-colors" />
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
