# 🚀 Deployment Checklist - FAQ & Team System

## ⚠️ WICHTIG: Migrationen müssen ausgeführt werden!

Der Code ist deployed, aber die Datenbank-Tabellen fehlen noch.
Sie müssen folgende Schritte **IN DIESER REIHENFOLGE** ausführen:

---

## 📋 Schritt-für-Schritt Anleitung

### 1. **Migration 006 - FAQ System** ✅

1. **Supabase Dashboard öffnen**
   - https://supabase.com/dashboard
   - Ihr Projekt auswählen

2. **SQL Editor öffnen**
   - Linke Sidebar → **SQL Editor**
   - Oder direkt: Database → SQL Editor

3. **Migration ausführen**
   - Datei öffnen: `supabase/migrations/006_faq_system.sql`
   - **GESAMTEN INHALT** kopieren (Zeilen 1-142)
   - Im SQL Editor einfügen
   - **"Run"** klicken (oder Strg+Enter)

4. **Erfolgskontrolle**
   ```sql
   -- Diese Abfrage sollte 13 FAQs zurückgeben:
   SELECT COUNT(*) FROM public.faqs;
   ```

---

### 2. **Migration 007 - Team System** ✅

1. **SQL Editor** (bereits offen)

2. **Migration ausführen**
   - Datei öffnen: `supabase/migrations/007_team_system.sql`
   - **GESAMTEN INHALT** kopieren
   - Im SQL Editor einfügen
   - **"Run"** klicken

3. **Erfolgskontrolle**
   ```sql
   -- Diese Abfrage sollte 4 Team-Mitglieder zurückgeben:
   SELECT COUNT(*) FROM public.team_members;
   ```

---

### 3. **Storage Bucket erstellen** 🗂️

1. **Storage öffnen**
   - Linke Sidebar → **Storage**

2. **Neuen Bucket erstellen**
   - Button: **"New bucket"**
   - Name: `team-images`
   - **Public bucket**: ✅ JA (ankreuzen!)
   - **"Create bucket"** klicken

3. **Bucket-Policies (Optional - für mehr Sicherheit)**
   ```sql
   -- Im SQL Editor ausführen, um Upload nur für Admins zu erlauben:
   
   CREATE POLICY "Anyone can view team images"
   ON storage.objects FOR SELECT
   USING (bucket_id = 'team-images');

   CREATE POLICY "Admins can upload team images"
   ON storage.objects FOR INSERT
   WITH CHECK (bucket_id = 'team-images');

   CREATE POLICY "Admins can update team images"
   ON storage.objects FOR UPDATE
   USING (bucket_id = 'team-images');

   CREATE POLICY "Admins can delete team images"
   ON storage.objects FOR DELETE
   USING (bucket_id = 'team-images');
   ```

---

### 4. **Refresh Schema Cache** 🔄

Nach den Migrationen muss Supabase den Schema Cache neu laden:

**Option A: Automatisch (Warten)**
- Warten Sie 1-2 Minuten
- Supabase lädt den Cache automatisch neu

**Option B: Manuell (Schneller)**
1. Supabase Dashboard → **Settings** → **API**
2. Button: **"Reload schema cache"** klicken
3. Warten bis "Success" erscheint

---

### 5. **Container neu starten** 🐳

Jetzt den Docker Container neu starten, damit die Fehler verschwinden:

```powershell
ssh luca@192.168.178.104 "cd /opt/dancemotion/web && docker compose restart"
```

---

### 6. **Testen** ✅

Nach dem Neustart sollten alle Seiten funktionieren:

1. **FAQ-Seite (Public)**
   - http://192.168.178.104:3000/faq
   - Sollte 13 FAQs in 4 Kategorien zeigen

2. **Team-Seite (Public)**
   - http://192.168.178.104:3000/team
   - Sollte 4 Team-Mitglieder zeigen

3. **Admin FAQ-Verwaltung**
   - http://192.168.178.104:3000/admin/faqs
   - FAQs bearbeiten, erstellen, löschen

4. **Admin Team-Verwaltung**
   - http://192.168.178.104:3000/admin/team
   - Team-Mitglieder bearbeiten, Bilder hochladen

---

## 🎯 Troubleshooting

### Fehler: "Could not find the table 'public.faqs'"
→ Migration 006 wurde noch nicht ausgeführt oder Schema Cache nicht neu geladen

### Fehler: "Could not find the table 'public.team_members'"
→ Migration 007 wurde noch nicht ausgeführt

### Fehler: "Bucket does not exist"
→ Storage Bucket 'team-images' muss noch erstellt werden

### Bilder werden nicht angezeigt
→ Bucket muss als **Public** markiert sein

---

## ✅ Checkliste (zum Abhaken)

- [ ] Migration 006 (FAQ) in Supabase ausgeführt
- [ ] Migration 007 (Team) in Supabase ausgeführt
- [ ] Storage Bucket 'team-images' erstellt (Public!)
- [ ] Schema Cache neu geladen (automatisch oder manuell)
- [ ] Docker Container neu gestartet
- [ ] /faq getestet (sollte 13 FAQs zeigen)
- [ ] /team getestet (sollte 4 Mitglieder zeigen)
- [ ] /admin/faqs getestet (CRUD funktioniert)
- [ ] /admin/team getestet (Upload funktioniert)

---

## 📊 Erwartete Daten nach Migration

### FAQs (13 Einträge)
- **Kurse**: 5 FAQs
- **Anmeldung**: 3 FAQs
- **Events**: 2 FAQs
- **Allgemein**: 3 FAQs

### Team (4 Mitglieder)
- Studio-Leitung
- Choreografin
- Hip-Hop Trainer
- Ballett-Lehrerin

**Alle mit Platzhalter-Bildern** (diese können Sie dann im Admin-Bereich durch echte Fotos ersetzen!)

---

**Nach Ausführung aller Schritte sollte alles funktionieren!** 🎉
