# 📄 Formulare/Dokumente Setup - Supabase Storage

## ⚠️ WICHTIG: Supabase Setup für PDF-Dokumente

### 1. **SQL Editor: Database Migration ausführen**

1. Gehen Sie zu **SQL Editor** im Supabase Dashboard
2. Fügen Sie den Inhalt von `supabase/migrations/002_create_documents.sql` ein
3. Klicken Sie auf **Run**
4. ✅ Die `documents` Tabelle wurde erstellt

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
