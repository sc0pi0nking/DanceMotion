# 📝 Content Management Guide

## ✨ Inline Content Editing

Alle Texte auf der Website können jetzt **direkt auf den Seiten bearbeitet** werden!

### 🔐 Voraussetzung
Sie müssen im **Admin-Bereich eingeloggt** sein (`/admin/login`).

---

## 🎯 So funktioniert's

### 1. **Einloggen**
- Gehen Sie zu `/admin/login`
- Loggen Sie sich mit Ihren Supabase-Zugangsdaten ein

### 2. **Seite besuchen**
- Navigieren Sie zu der Seite, die Sie bearbeiten möchten
- Z.B. `/gruppen/emotion`, `/impressum`, `/datenschutz`, oder die Startseite

### 3. **Texte bearbeiten**
- **Hover** über einen Text → Ein **Stift-Icon** (✏️) erscheint rechts
- **Klicken** Sie auf das Stift-Icon
- Ein **Eingabefeld** öffnet sich
- **Bearbeiten** Sie den Text
- **Speichern** oder **Abbrechen**

### 4. **Änderungen sind live!**
- Nach dem Speichern wird der Text **sofort aktualisiert**
- Die Änderung wird in der **Datenbank gespeichert**
- Alle Besucher sehen die neue Version

---

## 📍 Editierbare Bereiche

### **Startseite (`/`)**
- ✅ Hero-Titel: "Bewegung ist Ausdruck"
- ✅ Hero-Untertitel
- ✅ Gruppenbeschreibungen (Kurztexte)

### **Gruppenseiten**
- ✅ `/gruppen/little-joys`
  - Untertitel
  - "Für wen?" Text
  - "Was erwartet dich?" Liste
  - Kontakttext
  
- ✅ `/gruppen/smileys`
  - Untertitel
  - "Für wen?" Text
  - "Was erwartet dich?" Liste
  - Kontakttext

- ✅ `/gruppen/emotion`
  - Untertitel
  - "Für wen?" Text
  - "Was erwartet dich?" Liste
  - Kontakttext

### **Rechtliche Seiten**
- ✅ `/impressum`
  - Verantwortlich
  - Kontakt
  - Website & Hosting
  - Haftungshinweis
  - Urheberrecht

- ✅ `/datenschutz`
  - Alle Abschnitte vollständig editierbar

---

## 🔑 Content Keys

Jeder editierbare Text hat einen eindeutigen **Key**, z.B.:
- `hero.title` → Hero-Titel
- `emotion.subtitle` → Emotion Untertitel
- `impressum.contact` → Impressum Kontakt

Diese Keys werden automatisch in der Datenbank gespeichert.

---

## 💾 Datenbank-Struktur

Die Texte werden in der **`content`-Tabelle** in Supabase gespeichert:

```sql
{
  id: "uuid",
  key: "emotion.subtitle",
  value: { text: "Ihr bearbeiteter Text" },
  section: "emotion",
  description: "Content for emotion.subtitle",
  created_at: "timestamp",
  updated_at: "timestamp"
}
```

---

## 🛠️ Technische Details

### **Component: `EditableContent`**

```tsx
<EditableContent
  contentKey="emotion.subtitle"
  defaultValue="Standardtext wenn nichts in DB ist"
  className="text-lg"
  style={{ color: "var(--muted)" }}
  multiline={true}  // Für mehrzeilige Texte
  as="p"            // HTML-Element: p, h1, h2, div
/>
```

### **API-Endpoints**
- `GET /api/admin/content/:key` → Lädt Content
- `PUT /api/admin/content/:key` → Speichert Content

---

## ⚠️ Wichtige Hinweise

1. **Nur Admins sehen Edit-Buttons**
   - Normale Besucher sehen nur den Text
   - Edit-Funktionalität ist nur für eingeloggte Admins sichtbar

2. **Änderungen sind sofort live**
   - Kein Deploy notwendig
   - Direkt nach "Speichern" für alle Besucher sichtbar

3. **Default-Werte**
   - Wenn kein Content in der DB ist, wird der Default-Wert angezeigt
   - Beim ersten Speichern wird der Eintrag in der DB erstellt

4. **Multiline vs. Single Line**
   - `multiline={false}` → Einfaches Textfeld
   - `multiline={true}` → Mehrzeiliges Textarea

---

## 🎨 Best Practices

### **Texte strukturieren**
Für Listen verwenden Sie Bullet-Points:
```
• Punkt 1
• Punkt 2
• Punkt 3
```

### **Absätze trennen**
Nutzen Sie Leerzeilen für Absätze:
```
Erster Absatz hier.

Zweiter Absatz hier.
```

### **Kurz und prägnant**
- Hero-Texte: Kurz und kraftvoll
- Gruppenbeschreibungen: 2-3 Sätze
- Kontakttexte: Freundlich und einladend

---

## 🚀 Nächste Schritte

Weitere editierbare Bereiche können leicht hinzugefügt werden:
1. Neue Seiten erstellen
2. `EditableContent`-Component verwenden
3. Eindeutigen `contentKey` vergeben
4. Fertig!

---

**Viel Erfolg beim Bearbeiten! 🎉**
