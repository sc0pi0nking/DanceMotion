# 🚨 KRITISCH: Datenbank-Tabellen müssen JETZT erstellt werden

## Problem
Events können nicht gespeichert werden, weil die Datenbank-Tabellen in Supabase noch nicht existieren.

```
Error: 500 - Database tables not initialized
```

---

## ✅ Lösung: SQL Migration in Supabase ausführen

### Schritt 1: Supabase Dashboard öffnen
1. Gehe zu: **https://app.supabase.com**
2. Wähle dein Projekt: **sbbrjdfcxvbbcswnbyki**
3. Klicke auf **"SQL Editor"** in der linken Sidebar

### Schritt 2: Neue Query erstellen
1. Klicke auf **"+ New Query"**
2. Es öffnet sich ein leerer SQL-Editor

### Schritt 3: SQL-Code kopieren und einfügen
1. Öffne die Datei: `supabase/migrations/001_create_tables.sql` (im Projekt-Verzeichnis)
2. **Kopiere den KOMPLETTEN Inhalt** (alle 160 Zeilen)
3. **Füge ihn** im Supabase SQL Editor ein

### Schritt 4: Ausführen
1. Klicke auf den blauen **"Run"** Button
   - ODER drücke: `Cmd+Enter` (Mac) / `Ctrl+Enter` (Windows)

### Schritt 5: Überprüfen
Wenn erfolgreich, siehst du: **"Success"** Message

Gehe zu **"Database"** → **"Tables"** und verifiziere, dass diese 6 Tabellen existieren:
- ✅ `events`
- ✅ `content`
- ✅ `forms`
- ✅ `form_submissions`
- ✅ `gallery`
- ✅ `admin_users`

---

## 🔴 Wenn SQL-Fehler kommt

**Error: "syntax error at or near..."**
- Die SQL hat einen Fehler in den RLS-Policies
- **Lösung**: Die SQL-Datei wurde gerade behoben. Versuche es erneut mit der aktuellen Version

**Error: "Table already exists"**
- Das ist OK! Die Tabelle existiert bereits
- Diese Fehlermeldung kannst du ignorieren (es ist `IF NOT EXISTS`)

---

## ⏭️ Nach der SQL-Ausführung

1. Aktualisiere die Website: **https://dancemotion.org**
2. Gehe zum Admin Panel: **https://dancemotion.org/admin/login**
3. Melde dich an
4. Gehe zu **"Events"**
5. Klicke **"Neues Event erstellen"**
6. Fülle das Formular aus und speichere
7. ✅ Event sollte jetzt gespeichert werden!

---

## Was ist neu?

- ✅ Website lädt ohne Fehler
- ✅ Admin Panel funktioniert
- ❌ Events speichern funktioniert **NUR wenn Tabellen existieren**
- ❌ Fallback-Content wird angezeigt, wenn keine Events in der DB sind

---

## Tl;dr - Schnelle Anleitung

```
1. https://app.supabase.com → Projekt sbbrjdfcxvbbcswnbyki
2. SQL Editor → "+ New Query"
3. Datei supabase/migrations/001_create_tables.sql kopieren
4. In Supabase einfügen → Run
5. Fertig ✅
```

