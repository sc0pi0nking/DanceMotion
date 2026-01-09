'use client';

import { useState, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { FileText, Upload, Trash2, Download, AlertCircle } from 'lucide-react';

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
    return <div className="p-8 text-center">Lädt Dokumente...</div>;
  }

  return (
    <div className="space-y-8">
      {/* Upload Form */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold mb-6">Neues Dokument hochladen</h2>

        <form onSubmit={handleUpload} className="space-y-6">
          {/* Dropzone */}
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
              isDragActive
                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                : 'border-gray-300 dark:border-gray-600 hover:border-gray-400'
            }`}
          >
            <input {...getInputProps()} />
            <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            {selectedFile ? (
              <div>
                <p className="font-medium text-green-600 dark:text-green-400">
                  ✓ {selectedFile.name}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {formatFileSize(selectedFile.size)}
                </p>
              </div>
            ) : (
              <div>
                <p className="font-medium text-gray-900 dark:text-gray-100">
                  {isDragActive
                    ? 'PDF hier ablegen...'
                    : 'PDF hier ablegen oder klicken zum Auswählen'}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Nur PDF-Dateien</p>
              </div>
            )}
          </div>

          {/* Titel */}
          <div>
            <label className="block font-medium mb-2 text-gray-900 dark:text-gray-100">
              Titel <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600"
              placeholder="z.B. Anmeldeformular 2024"
              required
            />
          </div>

          {/* Beschreibung */}
          <div>
            <label className="block font-medium mb-2 text-gray-900 dark:text-gray-100">Beschreibung</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600"
              rows={3}
              placeholder="Optionale Beschreibung..."
            />
          </div>

          {/* Kategorie */}
          <div>
            <label className="block font-medium mb-2 text-gray-900 dark:text-gray-100">
              Kategorie <span className="text-red-500">*</span>
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600"
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
            <div className="flex items-center gap-2 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-600 dark:text-red-400">
              <AlertCircle className="w-5 h-5" />
              <span>{error}</span>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={uploading || !selectedFile || !title}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
          >
            {uploading ? 'Wird hochgeladen...' : 'Dokument hochladen'}
          </button>
        </form>
      </div>

      {/* Dokumente Liste */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold mb-6">
          Hochgeladene Dokumente ({documents.length})
        </h2>

        {documents.length === 0 ? (
          <p className="text-center text-gray-500 py-8">
            Noch keine Dokumente hochgeladen
          </p>
        ) : (
          <div className="space-y-4">
            {documents.map((doc) => (
              <div
                key={doc.id}
                className="flex items-start gap-4 p-4 border rounded-lg dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
              >
                <FileText className="w-8 h-8 text-red-500 flex-shrink-0 mt-1" />

                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-lg">{doc.title}</h3>
                  {doc.description && (
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      {doc.description}
                    </p>
                  )}
                  <div className="flex flex-wrap gap-3 mt-2 text-sm text-gray-500">
                    <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded">
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
                  <a
                    href={doc.file_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                    title="Herunterladen"
                  >
                    <Download className="w-5 h-5" />
                  </a>
                  <button
                    onClick={() => handleDelete(doc.id, doc.title)}
                    className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
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
    </div>
  );
}
