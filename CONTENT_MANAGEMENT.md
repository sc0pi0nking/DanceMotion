# 📝 Content Management Guide

## Übersicht

Das Content Management System (CMS) ermöglicht es dir, alle Texte auf der Website zentral zu verwalten - ohne Code anfassen zu müssen!

## 🚀 Schnellstart

1. **Gehe zum Admin-Bereich**: `/admin/content`
2. **Initiale Daten laden**: Führe `supabase/seed-content.sql` in Supabase aus (einmalig)
3. **Inhalte bearbeiten**: Klicke auf "Bearbeiten" bei einem Eintrag
4. **Speichern**: Änderungen werden sofort gespeichert

## 📋 Funktionen

### ✏️ Inhalte bearbeiten
- Klicke auf "Bearbeiten" neben einem Inhalt
- Ändere den Text im Textfeld
- Klicke "Speichern" oder "Abbrechen"

### ➕ Neue Inhalte hinzufügen
1. Klicke auf "Neu" oben rechts
2. Fülle die Felder aus:
   - **Key**: Eindeutiger Identifier (z.B. `home.hero.title`)
   - **Bereich/Section**: Kategorie (z.B. `Homepage`, `Gruppen`)
   - **Beschreibung**: Was ist dieser Inhalt? (optional)
   - **Inhalt**: Der eigentliche Text
3. Klicke "Erstellen"

### 🗑️ Inhalte löschen
- Klicke auf das Papierkorb-Symbol neben einem Eintrag
- Bestätige die Löschung

### 🔍 Suchen & Filtern
- **Suchleiste**: Suche nach Key, Beschreibung oder Inhalt
- **Bereich-Filter**: Zeige nur Inhalte eines bestimmten Bereichs

## 🏗️ Content-Struktur

### Key-Namenskonvention
Wir verwenden eine hierarchische Struktur mit Punkten:

```
<seite>.<bereich>.<element>
```

**Beispiele:**
- `home.hero.title` = Homepage > Hero-Bereich > Titel
- `group.smileys.about.text` = Smileys-Gruppe > Über-Bereich > Text
- `footer.contact.email` = Footer > Kontakt > E-Mail

### Sections/Bereiche
Organisiere Inhalte nach Bereichen:
- **Homepage**: Alle Texte auf der Startseite
- **Gruppen - Little Joys**: Texte der Little Joys Seite
- **Gruppen - Smileys**: Texte der Smileys Seite
- **Gruppen - Emotion**: Texte der Emotion Seite
- **Eventstudio**: Texte der Eventstudio-Seite
- **Footer**: Footer-Informationen
- **Termine**: Event-Seite Texte
- **Allgemein**: Wiederverwendbare Texte

## 🎯 Häufige Anwendungsfälle

### Gruppenbeschreibung ändern
1. Gehe zu `/admin/content`
2. Wähle den Bereich `Gruppen - [Name]`
3. Finde `group.[name].about.text`
4. Bearbeiten → Text ändern → Speichern

### Kontaktdaten aktualisieren
1. Bereich: `Footer`
2. Finde die Keys:
   - `footer.contact.address`
   - `footer.contact.email`
   - `footer.contact.phone`
3. Bearbeiten und speichern

### Neue Promotion hinzufügen
1. Klicke "Neu"
2. Key: `general.promo.current`
3. Bereich: `Allgemein`
4. Beschreibung: "Aktuelle Aktion"
5. Inhalt: Dein Promo-Text
6. Erstellen

## 💾 Datenbank

### Tabelle: `content`
```sql
CREATE TABLE content (
  id TEXT PRIMARY KEY,
  key TEXT UNIQUE NOT NULL,      -- z.B. "home.hero.title"
  value JSONB NOT NULL,           -- { "text": "Dein Text" }
  section TEXT,                   -- z.B. "Homepage"
  description TEXT,               -- Beschreibung
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ,
  updated_by TEXT
)
```

### Value-Struktur
Aktuell wird nur Text gespeichert:
```json
{
  "text": "Dein Textinhalt hier"
}
```

Später könnten hier auch andere Formate unterstützt werden:
```json
{
  "text": "...",
  "html": "<p>...</p>",
  "markdown": "# Titel\n..."
}
```

## 🔌 Integration in Seiten

### Methode 1: Direkt in einer Seite
```tsx
'use client'
import { useEffect, useState } from 'react'

export default function MyPage() {
  const [title, setTitle] = useState('')

  useEffect(() => {
    fetch('/api/admin/content/home.hero.title')
      .then(r => r.json())
      .then(data => setTitle(data.value?.text || ''))
  }, [])

  return <h1>{title}</h1>
}
```

### Methode 2: Mit Server Component
```tsx
import { fetchContent } from '@/lib/content-db'

export default async function MyPage() {
  const title = await fetchContent('home.hero.title')
  
  return <h1>{title || 'Fallback Titel'}</h1>
}
```

### Methode 3: Mit Context/Provider (empfohlen für viele Inhalte)
```tsx
// In einem Layout oder Provider
const content = await fetchAllContent()
// Dann per Context an Komponenten weitergeben
```

## 🎨 Best Practices

### ✅ Do's
- Verwende sprechende Keys (`home.hero.title` statt `h1`)
- Gruppiere verwandte Inhalte in Sections
- Füge Beschreibungen hinzu für bessere Übersicht
- Nutze Zeilenumbrüche für Listen oder Absätze
- Teste Änderungen auf der Live-Seite

### ❌ Don'ts
- Keine HTML-Tags im Text (wird als Text angezeigt)
- Keys nicht nach dem Erstellen ändern
- Keine sensiblen Daten (Keys, Passwörter) speichern
- Nicht zu viele kleine Inhalte - lieber zusammenfassen

## 🔮 Zukünftige Features

### Geplant
- [ ] Rich-Text Editor (Fett, Kursiv, Links)
- [ ] Markdown-Unterstützung
- [ ] Bild-Upload
- [ ] Mehrsprachigkeit (DE/EN)
- [ ] Versionierung (Änderungshistorie)
- [ ] Vorschau vor dem Speichern
- [ ] Import/Export von Inhalten

## 📊 Statistiken

Im Admin-Panel siehst du:
- **Gesamt Inhalte**: Anzahl aller Content-Items
- **Bereiche**: Anzahl verschiedener Sections
- **Gefiltert**: Anzahl nach Such-/Filterkriterien

## ❓ Troubleshooting

### Problem: Inhalte werden nicht angezeigt
1. Überprüfe, ob der Key korrekt ist
2. Prüfe, ob die Seite den Content abruft
3. Schaue in die Browser-Console für Fehler

### Problem: Speichern funktioniert nicht
1. Bist du eingeloggt im Admin-Bereich?
2. Prüfe Netzwerk-Tab im Browser
3. Schaue in die Server-Logs

### Problem: Keine Inhalte sichtbar
1. Wurde `seed-content.sql` ausgeführt?
2. Sind die RLS-Policies korrekt?
3. Prüfe Supabase-Verbindung

## 📞 Support

Bei Fragen:
1. Schaue in `CONTENT_EXAMPLES.md` für praktische Beispiele
2. Prüfe die Dokumentation in `DOCUMENTATION_INDEX.md`
3. Kontaktiere den Entwickler

---

**Viel Erfolg beim Verwalten deiner Inhalte! 🚀**
