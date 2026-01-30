'use client';

import { useState, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { FileText, Upload, Trash2, Download, AlertCircle, Eye, EyeOff, FileDown, FolderOpen } from 'lucide-react';

interface Document {
  id: string;
  title: string;
  description?: string;
  category: string;
  file_url: string;
  file_name: string;
  file_size: number;
  is_active: boolean;
  created_at: string;
}

const CATEGORIES = [
  { value: 'anmeldung', label: 'Anmeldeformulare' },
  { value: 'info', label: 'Informationsblätter' },
  { value: 'datenschutz', label: 'Datenschutz & Rechtliches' },
  { value: 'sonstiges', label: 'Sonstige Dokumente' },
];

export default function AdminDocumentManager() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [togglingId, setTogglingId] = useState<string | null>(null);
  
  // Upload Form State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('anmeldung');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // Dokumente laden
  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      const res = await fetch('/api/admin/documents');
      if (!res.ok) throw new Error('Failed to fetch documents');
      const data = await res.json();
      setDocuments(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Dropzone
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'application/pdf': ['.pdf'],
    },
    maxFiles: 1,
    onDrop: (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        setSelectedFile(acceptedFiles[0]);
        setError('');
      }
    },
  });

  // Upload Handler
  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedFile || !title) {
      setError('Bitte Datei und Titel angeben');
      return;
    }

    setUploading(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('title', title);
      formData.append('description', description);
      formData.append('category', category);

      const res = await fetch('/api/admin/documents', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Upload failed');
      }

      // Reset Form
      setTitle('');
      setDescription('');
      setCategory('anmeldung');
      setSelectedFile(null);

      // Refresh Liste
      await fetchDocuments();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  };

  // Toggle Active Status
  const handleToggleActive = async (id: string, currentStatus: boolean) => {
    setTogglingId(id);
    try {
      const res = await fetch(`/api/admin/documents/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_active: !currentStatus }),
      });

      if (!res.ok) throw new Error('Update failed');

      const updatedDoc = await res.json();
      setDocuments(
        documents.map((doc) => (doc.id === id ? updatedDoc : doc))
      );
    } catch (err: any) {
      alert('Fehler beim Aktualisieren: ' + err.message);
    } finally {
      setTogglingId(null);
    }
  };

  // Delete Handler
  const handleDelete = async (id: string, fileName: string) => {
    if (!confirm(`"${fileName}" wirklich löschen?`)) return;

    try {
      const res = await fetch(`/api/admin/documents/${id}`, {
        method: 'DELETE',
      });

      if (!res.ok) throw new Error('Delete failed');

      setDocuments(documents.filter((doc) => doc.id !== id));
    } catch (err: any) {
      alert('Fehler beim Löschen: ' + err.message);
    }
  };

  // Format Dateigröße
  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-400"></div>
        <span className="ml-3 text-slate-400">Lädt Dokumente...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4">
          <p className="text-slate-400 text-sm mb-1">Hochgeladene Dokumente</p>
          <p className="text-2xl font-bold text-white">{documents.length}</p>
          <p className="text-xs text-slate-500 mt-1">Gesamt</p>
        </div>

        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4">
          <p className="text-slate-400 text-sm mb-1">Aktive Dokumente</p>
          <p className="text-2xl font-bold text-white">{documents.filter(d => d.is_active).length}</p>
          <p className="text-xs text-slate-500 mt-1">Öffentlich sichtbar</p>
        </div>

        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4">
          <p className="text-slate-400 text-sm mb-1">Kategorien</p>
          <p className="text-2xl font-bold text-white">{CATEGORIES.length}</p>
          <p className="text-xs text-slate-500 mt-1">Verfügbar</p>
        </div>
      </div>

      {/* Upload Form */}
      <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
        <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
          <Upload className="w-5 h-5 text-teal-400" />
          Neues Dokument hochladen
        </h2>

        <form onSubmit={handleUpload} className="space-y-6">
          {/* Dropzone */}
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
              isDragActive
                ? 'border-teal-500 bg-teal-500/10'
                : 'border-slate-600 hover:border-slate-500 bg-slate-900/50'
            }`}
          >
            <input {...getInputProps()} />
            <Upload className="w-12 h-12 mx-auto mb-4 text-slate-500" />
            {selectedFile ? (
              <div>
                <p className="font-medium text-teal-400">
                  ✓ {selectedFile.name}
                </p>
                <p className="text-sm text-slate-400 mt-1">
                  {formatFileSize(selectedFile.size)}
                </p>
              </div>
            ) : (
              <div>
                <p className="font-medium text-white">
                  {isDragActive
                    ? 'PDF hier ablegen...'
                    : 'PDF hier ablegen oder klicken zum Auswählen'}
                </p>
                <p className="text-sm text-slate-500 mt-2">Nur PDF-Dateien</p>
              </div>
            )}
          </div>

          {/* Titel */}
          <div>
            <label className="block font-medium mb-2 text-slate-300">
              Titel <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-3 border rounded-lg bg-slate-900/50 text-white border-slate-600 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 outline-none transition"
              placeholder="z.B. Anmeldeformular 2024"
              required
            />
          </div>

          {/* Beschreibung */}
          <div>
            <label className="block font-medium mb-2 text-slate-300">Beschreibung</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-3 border rounded-lg bg-slate-900/50 text-white border-slate-600 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 outline-none transition"
              rows={3}
              placeholder="Optionale Beschreibung..."
            />
          </div>

          {/* Kategorie */}
          <div>
            <label className="block font-medium mb-2 text-slate-300">
              Kategorie <span className="text-red-400">*</span>
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-3 border rounded-lg bg-slate-900/50 text-white border-slate-600 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 outline-none transition"
              required
            >
              {CATEGORIES.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>

          {/* Error */}
          {error && (
            <div className="flex items-center gap-2 p-4 bg-red-900/20 border border-red-800 rounded-lg text-red-400">
              <AlertCircle className="w-5 h-5" />
              <span>{error}</span>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={uploading || !selectedFile || !title}
            className="w-full bg-teal-600 hover:bg-teal-500 disabled:bg-slate-600 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg transition-colors"
          >
            {uploading ? 'Wird hochgeladen...' : 'Dokument hochladen'}
          </button>
        </form>
      </div>

      {/* Dokumente Liste */}
      <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
        <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
          <FolderOpen className="w-5 h-5 text-teal-400" />
          Hochgeladene Dokumente ({documents.length})
        </h2>

        {documents.length === 0 ? (
          <div className="text-center py-12">
            <FileDown className="w-12 h-12 mx-auto text-slate-600 mb-4" />
            <p className="text-slate-400">Noch keine Dokumente hochgeladen</p>
          </div>
        ) : (
          <div className="space-y-3">
            {documents.map((doc) => (
              <div
                key={doc.id}
                className={`flex items-start gap-4 p-4 border rounded-xl transition-all ${
                  !doc.is_active
                    ? 'bg-slate-900/30 border-slate-700 opacity-60'
                    : 'bg-slate-900/50 border-slate-700 hover:border-slate-600'
                }`}
              >
                <FileText className={`w-8 h-8 flex-shrink-0 mt-1 ${
                  !doc.is_active ? 'text-slate-500' : 'text-red-400'
                }`} />

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-lg text-white">{doc.title}</h3>
                    {!doc.is_active && (
                      <span className="px-2 py-0.5 bg-yellow-900/30 text-yellow-300 text-xs font-semibold rounded">
                        Versteckt
                      </span>
                    )}
                  </div>
                  {doc.description && (
                    <p className="text-sm text-slate-400 mt-1">
                      {doc.description}
                    </p>
                  )}
                  <div className="flex flex-wrap gap-3 mt-2 text-sm text-slate-500">
                    <span className="px-2 py-1 bg-slate-700 rounded text-slate-300">
                      {CATEGORIES.find((c) => c.value === doc.category)?.label ||
                        doc.category}
                    </span>
                    <span>{formatFileSize(doc.file_size)}</span>
                    <span>
                      {new Date(doc.created_at).toLocaleDateString('de-DE')}
                    </span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleToggleActive(doc.id, doc.is_active)}
                    disabled={togglingId === doc.id}
                    className={`p-2 rounded-lg transition-colors ${
                      doc.is_active
                        ? 'text-slate-400 hover:bg-slate-700'
                        : 'text-yellow-400 hover:bg-yellow-900/20'
                    } disabled:opacity-50`}
                    title={doc.is_active ? 'Verstecken' : 'Anzeigen'}
                  >
                    {doc.is_active ? (
                      <Eye className="w-5 h-5" />
                    ) : (
                      <EyeOff className="w-5 h-5" />
                    )}
                  </button>
                  <a
                    href={doc.file_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 text-teal-400 hover:bg-teal-900/20 rounded-lg transition-colors"
                    title="Herunterladen"
                  >
                    <Download className="w-5 h-5" />
                  </a>
                  <button
                    onClick={() => handleDelete(doc.id, doc.title)}
                    className="p-2 text-red-400 hover:bg-red-900/20 rounded-lg transition-colors"
                    title="Löschen"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Help Section */}
      <div className="bg-slate-800/30 border border-slate-700/50 rounded-xl p-6">
        <h3 className="font-semibold text-white mb-3">💡 Hinweise</h3>
        <ul className="space-y-2 text-sm text-slate-300">
          <li className="flex gap-2">
            <span className="text-teal-400">•</span>
            <span>Nur <strong>aktive Dokumente</strong> werden auf der öffentlichen Seite angezeigt</span>
          </li>
          <li className="flex gap-2">
            <span className="text-teal-400">•</span>
            <span>Erlaubte Dateiformate: <strong>PDF</strong></span>
          </li>
          <li className="flex gap-2">
            <span className="text-teal-400">•</span>
            <span>Dokumente werden in <strong>Kategorien</strong> organisiert</span>
          </li>
          <li className="flex gap-2">
            <span className="text-teal-400">•</span>
            <span>Das Verstecken von Dokumenten entfernt sie nicht, sondern macht sie nur unsichtbar</span>
          </li>
        </ul>
      </div>
    </div>
  );
}
