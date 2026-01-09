# 📅 Events Feature - Content Editing Guide

Wie du Events hinzufügen, bearbeiten und verwalten kannst.

---

## 🎯 Quick Start

**Datei:** `lib/events.ts`

Hier sind alle Events als statische Liste definiert.

### Event hinzufügen

```typescript
// Öffne: lib/events.ts

// Finde das events[] Array und füge hinzu:
{
  id: "evt-013",                    // Unique ID (evt-NNN Format)
  title: "Mein neues Event",        // Event Name
  date: "2026-05-10",               // ISO Format YYYY-MM-DD
  time: "19:00",                    // Optional: HH:mm Format
  location: "Mein Venue",           // Veranstaltungsort
  city: "Berlin",                   // Stadt
  category: "Auftritt",             // Auftritt | Workshop | Training | Event
  groups: ["emotion"],              // Optional: Gruppen-Slugs
  note: "Besondere Info",           // Optional: Kurzer Zusatztext
  href: "/gruppen/emotion",         // Optional: Link zu Details
}
```

### Event bearbeiten

Einfach die Werte im bestehenden Event ändern:

```typescript
// VORHER:
{
  id: "evt-001",
  title: "Sommerfest DanceMotion",
  date: "2026-01-18",
  time: "14:00",
  // ...
}

// NACHHER (Zeit geändert):
{
  id: "evt-001",
  title: "Sommerfest DanceMotion",
  date: "2026-01-18",
  time: "15:00",  // ← GEÄNDERT
  // ...
}
```

### Event löschen

Einfach das ganze Event-Objekt aus dem Array entfernen:

```typescript
// LÖSCHEN: Diese Zeilen entfernen
{
  id: "evt-001",
  title: "Event zum Löschen",
  // ...
},
```

---

## 📅 Datum Regeln

- Format: `"YYYY-MM-DD"` (ISO Standard)
- Beispiele:
  - `"2026-01-18"` = 18. Januar 2026
  - `"2026-12-25"` = 25. Dezember 2026
  - `"2025-03-07"` = 7. März 2025

⚠️ **Wichtig:** Ungültige Daten führen zu Anzeigefehlern!

---

## ⏰ Zeit (Optional)

- Format: `"HH:mm"` (24-Stunden)
- Beispiele:
  - `"14:00"` = 14 Uhr mittags
  - `"19:30"` = 19.30 Uhr
  - `"09:00"` = 9 Uhr morgens

Wenn `time` nicht angegeben: Nur Datum wird angezeigt.

---

## 🏷️ Kategorien

4 verfügbare Kategorien:

| Kategorie | Bedeutung | Beispiel |
|-----------|-----------|----------|
| **Auftritt** | Performance/Show | Emotion Live Auftritt |
| **Workshop** | Kurs/Unterricht | Hip-Hop Basics Workshop |
| **Training** | Trainings-Session | Intensiv Training |
| **Event** | Allgemeines Event | Sommerfest, Gala |

```typescript
category: "Auftritt"  // Einer dieser 4 Werte
```

---

## 👥 Gruppen (Optional)

Welche Gruppen sind dabei?

```typescript
groups: ["little-joys", "smileys", "emotion"]
```

Verfügbare Werte:
- `"little-joys"` - Little Joys Gruppe
- `"smileys"` - Smileys Gruppe
- `"emotion"` - Emotion Gruppe
- `"eventstudio"` - Eventstudio

Wenn leer oder nicht vorhanden: Nur Kategorie wird angezeigt.

---

## 📝 Zusatz-Info (Optional)

Kurzer Zusatztext unter dem Title:

```typescript
note: "Mit Live-Performance aller Gruppen"
```

Wird im compact Layout (Homepage) versteckt, aber auf der `/termine` Seite angezeigt.

---

## 🔗 Link (Optional)

Interner oder externer Link:

```typescript
href: "/gruppen/emotion"        // Interne Seite
// oder
href: "https://example.com"     // Externe Website
```

Ein "Details →" Link wird angezeigt, wenn `href` vorhanden ist.

---

## 🔍 Vollständiges Beispiel

```typescript
{
  id: "evt-050",
  title: "Sommer Showcase 2026",
  date: "2026-07-15",
  time: "20:00",
  location: "Tempelhof Gelände",
  city: "Berlin",
  category: "Event",
  groups: ["little-joys", "smileys", "emotion", "eventstudio"],
  note: "Das große Jahres-Event mit allen Gruppen!",
  href: "/termine",
}
```

---

## 📍 Wo werden Events angezeigt?

### Homepage (`/`)
- **Sektion:** "Nächste Auftritte & Events"
- **Zeigt:** Nächste 4 kommende Events
- **Kompakt:** Keine Group-Badges, tighter spacing

### Termine-Seite (`/termine`)
- **Sektion 1:** "Kommende Termine" (alle zukünftigen)
- **Sektion 2:** "Vergangene Events" (letzte 8, expandierbar)
- **Vollständig:** Alle Infos angezeigt

---

## 🤖 Automatische Funktionen

Du musst NICHTS manuell sortieren:

- ✅ **Automatisch sortiert**: Nach Datum aufsteigend
- ✅ **Automatisch gefiltert**: Kommend vs. Vergangen
- ✅ **Automatisch formatiert**: Deutsche Datums-Anzeige
- ✅ **Automatisch responsive**: Alle Screens

---

## ❓ FAQ

### F: Wie ändere ich nur den Ort?

```typescript
// VORHER:
location: "Studio Mitte",

// NACHHER:
location: "Studio Wedding",  // ← Geändert
```

### F: Kann ich mehrere Gruppen angeben?

**A:** Ja! Array mit mehreren Werten:

```typescript
groups: ["little-joys", "emotion"]  // 2 Gruppen
```

### F: Was ist der Unterschied zwischen Workshop und Training?

**A:**
- **Workshop**: Offene Kurse für alle
- **Training**: Interne Sessions der Gruppe

### F: Wie sortiere ich Events manuell?

**A:** Gar nicht - sie sortieren sich selbst nach Datum! 
Die neuesten/nächsten Events stehen oben.

### F: Was passiert mit alten Events?

**A:** Sie werden automatisch in die "Vergangene Events" Sektion verschoben.
Du kannst alle 8 oder alle zeigen lassen mit "Weitere Events laden".

### F: Kann ich ein Event auf die Homepage featuren?

**A:** Automatisch! Die nächsten 4 Events werden auf der Homepage angezeigt.

### F: Muss ich nach einer Änderung etwas speichern?

**A:** Ja! Datei speichern (Strg+S), Browser aktualisiert sich automatisch.

---

## ⚠️ Häufige Fehler

❌ **FALSCH** - Falsches Datums-Format:
```typescript
date: "18-01-2026"  // FALSCH!
date: "2026/01/18"  // FALSCH!
date: "Jan 18"      // FALSCH!
```

✅ **RICHTIG**:
```typescript
date: "2026-01-18"  // Immer YYYY-MM-DD
```

---

❌ **FALSCH** - Ungültige Kategorie:
```typescript
category: "Performance"  // FALSCH!
category: "Show"         // FALSCH!
```

✅ **RICHTIG** - Nur diese 4:
```typescript
category: "Auftritt"   // ✅
category: "Workshop"   // ✅
category: "Training"   // ✅
category: "Event"      // ✅
```

---

❌ **FALSCH** - Groups als String:
```typescript
groups: "emotion"  // FALSCH!
```

✅ **RICHTIG** - Array mit Strings:
```typescript
groups: ["emotion"]  // ✅
groups: ["emotion", "smileys"]  // ✅
```

---

## 🎨 Styling anpassen

Die Timeline und Cards verwenden diese CSS-Variablen:
- `--bg` = Hintergrund
- `--fg` = Text-Farbe
- `--muted` = Grauer Text
- `--panel` = Karten-Hintergrund
- `--border` = Border-Farbe
- `--accent` = Hauptfarbe (Teal)

Diese sind schon optimal gesetzt und sollten nicht geändert werden.

---

## 🚀 Speichern & Testen

1. Öffne `lib/events.ts`
2. Bearbeite den `events[]` Array
3. Speichern (Strg+S)
4. Browser aktualisiert sich automatisch
5. Überprüfe: `/` (Homepage) und `/termine` (Seite)

---

**Viel Erfolg beim Bearbeiten der Events!** 🎉
