# 📸 Galerie Setup - Supabase Storage

## ⚠️ WICHTIG: Supabase Storage Bucket erstellen

Bevor Sie die Galerie nutzen können, müssen Sie einen Storage Bucket in Supabase erstellen:

### 1. **Supabase Dashboard öffnen**
- Gehen Sie zu https://app.supabase.com
- Wählen Sie Ihr Projekt

### 2. **Storage Bucket erstellen**
- Klicken Sie auf **Storage** in der linken Seitenleiste
- Klicken Sie auf **New Bucket**
- **Bucket Name**: `images`
- **Public bucket**: ✅ **JA** (aktivieren!)
- **File size limit**: 10 MB (empfohlen)
- **Allowed MIME types**: `image/*` (alle Bildformate)
- Klicken Sie auf **Create Bucket**

### 3. **Bucket-Policies setzen**

Gehen Sie zu **Policies** und erstellen Sie folgende Policies:

#### **Policy 1: Public Read (Lesen für alle)**
```sql
CREATE POLICY "Public Read Access"
ON storage.objects FOR SELECT
USING ( bucket_id = 'images' );
```

#### **Policy 2: Authenticated Upload (Upload für Admins)**
```sql
CREATE POLICY "Authenticated Upload"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'images' 
  AND auth.role() = 'authenticated'
);
```

#### **Policy 3: Authenticated Delete (Löschen für Admins)**
```sql
CREATE POLICY "Authenticated Delete"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'images' 
  AND auth.role() = 'authenticated'
);
```

### 4. **Alternative: Policy ohne Auth (wenn Probleme auftreten)**

Falls Sie Probleme mit Auth haben, können Sie temporär folgende Policies verwenden:

```sql
-- Public Read
CREATE POLICY "Public Images"
ON storage.objects FOR SELECT
USING ( bucket_id = 'images' );

-- Public Upload (NUR FÜR ENTWICKLUNG!)
CREATE POLICY "Public Upload"
ON storage.objects FOR INSERT
WITH CHECK ( bucket_id = 'images' );

-- Public Delete (NUR FÜR ENTWICKLUNG!)
CREATE POLICY "Public Delete"
ON storage.objects FOR DELETE
USING ( bucket_id = 'images' );
```

⚠️ **WICHTIG**: Für Production sollten Sie die Auth-Policies verwenden!

---

## ✅ Testen

Nach der Einrichtung:
1. Gehen Sie zu `/admin/gallery`
2. Klicken Sie auf **Neue Galerie**
3. Laden Sie ein Testbild hoch
4. Überprüfen Sie, ob das Bild in der Galerie erscheint

---

## 🔧 Troubleshooting

### Fehler: "bucket not found"
- Stellen Sie sicher, dass der Bucket `images` heißt (genau so, lowercase!)

### Fehler: "new row violates row-level security policy"
- Überprüfen Sie die Storage Policies
- Temporär: Nutzen Sie die "Public"-Policies oben

### Bilder werden nicht angezeigt
- Prüfen Sie, ob der Bucket als **Public** markiert ist
- Prüfen Sie die Public Read Policy

---

## 📁 Dateistruktur im Bucket

Die Bilder werden wie folgt gespeichert:
```
images/
  └── gallery/
      ├── 1704729600000-abc123.jpg
      ├── 1704729601000-def456.png
      └── ...
```

---

**Nach dem Setup sollte die Galerie funktionieren!** 🎉
