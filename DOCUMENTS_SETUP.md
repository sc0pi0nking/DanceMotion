# 📄 Formulare/Dokumente Setup - Supabase Storage

## ⚠️ WICHTIG: Supabase Setup für PDF-Dokumente

### 1. **SQL Editor: Database Migration ausführen**

1. Gehen Sie zu **SQL Editor** im Supabase Dashboard
2. Führen Sie folgende Migrationen nacheinander aus:
   - `supabase/migrations/002_create_documents.sql` (Initialisierung)
   - `supabase/migrations/008_add_document_versioning.sql` (Versionierung - **NEU!**)
3. Klicken Sie auf **Run**
4. ✅ Die `documents` Tabelle mit Versionierungsfunktionen wurde erstellt

### 2. **Storage Bucket für PDFs erstellen**

Führen Sie dieses Script im **SQL Editor** aus:

```sql
-- 1. Bucket erstellen
INSERT INTO storage.buckets (id, name, public)
VALUES ('documents', 'documents', true)
ON CONFLICT (id) DO NOTHING;

-- 2. Public Read Policy (jeder kann PDFs herunterladen)
CREATE POLICY "Public Read Access"
ON storage.objects FOR SELECT
USING ( bucket_id = 'documents' );

-- 3. Public Upload Policy (für Entwicklung - später auf Auth umstellen!)
CREATE POLICY "Public Upload"
ON storage.objects FOR INSERT
WITH CHECK ( bucket_id = 'documents' );

-- 4. Public Delete Policy (für Entwicklung - später auf Auth umstellen!)
CREATE POLICY "Public Delete"
ON storage.objects FOR DELETE
USING ( bucket_id = 'documents' );
```

### 3. **Für Production: Authentifizierte Policies**

Später, wenn Auth funktioniert, ersetzen Sie die Public Upload/Delete Policies:

```sql
-- Authentifizierte Upload Policy
DROP POLICY IF EXISTS "Public Upload" ON storage.objects;
CREATE POLICY "Authenticated Upload"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'documents' 
  AND auth.role() = 'authenticated'
);

-- Authentifizierte Delete Policy
DROP POLICY IF EXISTS "Public Delete" ON storage.objects;
CREATE POLICY "Authenticated Delete"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'documents' 
  AND auth.role() = 'authenticated'
);
```

---

## 🎯 **NEU: Versionierungssystem für Dokumente**

### Das Problem
Vorher: Wenn "Mitgliedsantrag 2025" durch "Mitgliedsantrag 2026" ersetzt werden sollte, musste die alte Version gelöscht werden.

### Die Lösung
Jetzt können Sie Dokumente **verstecken** statt zu löschen:

1. **Im Admin Panel** (`/admin/documents`):
   - Alle Dokumente (aktiv & versteckt) sind sichtbar
   - Mit Eye/Eye-Off Icon kann man Dokumente aktivieren/deaktivieren
   - Versteckte Dokumente erhalten ein "Versteckt" Badge
   - Gelöschte Dokumente können optional wiederhergestellt werden

2. **Auf der öffentlichen Seite** (`/formulare`):
   - Nur **aktive** Dokumente werden angezeigt
   - Versteckte Dokumente sind nicht sichtbar

### Beispiel-Workflow
```
1. "Mitgliedsantrag 2025" ist aktiv → zeigt auf /formulare
2. Upload: "Mitgliedsantrag 2026"
3. Im Admin: "Mitgliedsantrag 2025" mit Eye-Off Icon deaktivieren
4. Ergebnis: Nur "2026" zeigt auf /formulare, "2025" bleibt aber für Admin sichtbar
```

### Technische Details
- `is_active` Spalte in `documents` Tabelle (default: `true`)
- PATCH `/api/admin/documents/[id]` mit `{ is_active: boolean }`
- RLS Policy: Public sieht nur `is_active = true`, Admins sehen alles

---

## ✅ Testen

Nach der Einrichtung:
1. Gehen Sie zu `/admin/documents`
2. Laden Sie ein Test-PDF hoch
3. Überprüfen Sie die Liste unter `/formulare`
4. Testen Sie den Download

---

## 🔧 Troubleshooting

### Fehler: "bucket not found"
- Stellen Sie sicher, dass der Bucket `documents` heißt (lowercase!)

### Fehler: "new row violates row-level security policy"
- Verwenden Sie die "Public"-Policies für Entwicklung
- Später: Wechseln zu Auth-Policies

### PDFs werden nicht angezeigt
- Prüfen Sie, ob der Bucket als **Public** markiert ist
- Prüfen Sie die Public Read Policy

---

## 📁 Dateistruktur im Bucket

```
documents/
  └── forms/
      ├── 1704729600000-anmeldung.pdf
      ├── 1704729601000-datenschutz.pdf
      └── ...
```

---

## 📊 Kategorien

Standard-Kategorien:
- `anmeldung` - Anmeldeformulare
- `info` - Informationsblätter
- `datenschutz` - Datenschutz & Rechtliches
- `sonstiges` - Sonstige Dokumente

---

**Nach dem Setup sollten die Formulare funktionieren!** 🎉
