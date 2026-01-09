# 📝 DanceMotion - Content Änderungs-Guide

Dieser Guide zeigt dir, wo und wie du alle Inhalte der Website ändern kannst.

---

## 📍 Übersicht

Die Website hat folgende Bereiche mit änderbar Inhalten:

1. **Gruppen** (Little Joys, Smileys, Emotion)
2. **Eventstudio** (Studio Vermietung)
3. **Header/Navigation**
4. **Footer**
5. **Gruppen-Detail-Seiten**

---

## 🎯 Schnell-Navigation

- [Gruppen-Karten Daten](#gruppen-karten-daten)
- [Header & Navigation](#header--navigation)
- [Eventstudio Block](#eventstudio-block)
- [Gruppen-Detail-Seiten](#gruppen-detail-seiten)
- [Footer](#footer)
- [Farben & Design](#farben--design)

---

## 🏘️ Gruppen-Karten Daten

### Datei: `lib/site-data.ts`

**Wo:** `c:\Users\HP\Desktop\DanceMotion\lib\site-data.ts`

Hier sind alle Gruppen definiert. Die Homepage zeigt diese Daten automatisch.

```typescript
export const tiles: Tile[] = [
  {
    title: "Little Joys",                    // Name der Gruppe (wird auf der Karte angezeigt)
    slug: "little-joys",                     // URL-Name (z.B. /gruppen/little-joys)
    shortDescription: "Tanzen für die Kleinsten — spielerisch und mit viel Freude.",  // Kurzbeschreibung auf Homepage
    href: "/gruppen/little-joys",            // Link zur Detail-Seite
    logo: "/logo-littlejoys.svg",            // Logo-Datei (in public/ Ordner)
  },
  {
    title: "Smileys",
    slug: "smileys",
    shortDescription: "Fröhliche Gruppe für Kinder mit Bewegung und Musik.",
    href: "/gruppen/smileys",
    logo: "/logo-smileys.svg",
  },
  {
    title: "Emotion",
    slug: "emotion",
    shortDescription: "Ausdrucksstarker Tanz für Jugendliche und Erwachsene.",
    href: "/gruppen/emotion",
    logo: "/logo-emotion.svg",
  },
];
```

### Was du ändern kannst:

| Feld | Beispiel | Beschreibung |
|------|----------|-------------|
| `title` | "Little Joys" | Name der Gruppe (wird überall angezeigt) |
| `slug` | "little-joys" | Technischer Name für URLs |
| `shortDescription` | "Tanzen für die Kleinsten..." | Text auf der Homepage-Karte |
| `logo` | "/logo-littlejoys.svg" | Pfad zum Logo im `public/` Ordner |

### Neue Gruppe hinzufügen:

```typescript
{
  title: "Deine neue Gruppe",
  slug: "deine-neue-gruppe",
  shortDescription: "Beschreibung der Gruppe...",
  href: "/gruppen/deine-neue-gruppe",
  logo: "/logo-deine-gruppe.svg",
},
```

> **Wichtig:** Wenn du eine neue Gruppe hinzufügst, musst du auch eine neue Seite erstellen (siehe [Gruppen-Detail-Seiten](#gruppen-detail-seiten))

---

## 🏠 Header & Navigation

### Datei: `app/components/Header.tsx`

**Wo:** `c:\Users\HP\Desktop\DanceMotion\app\components\Header.tsx`

Der Header enthält:
- Logo/Branding
- Navigations-Links
- Theme-Toggle (Dark/Light Mode)

### Navigation ändern:

```tsx
<nav className="flex gap-1">
  <Link href="/" className="site-nav-link">Home</Link>
  <Link href="/gruppen/little-joys" className="site-nav-link">Little Joys</Link>
  <Link href="/gruppen/smileys" className="site-nav-link">Smileys</Link>
  <Link href="/gruppen/emotion" className="site-nav-link">Emotion</Link>
  <Link href="/eventstudio" className="site-nav-link">Eventstudio</Link>
  <Link href="/impressum" className="site-nav-link">Impressum</Link>
  <Link href="/datenschutz" className="site-nav-link">Datenschutz</Link>
</nav>
```

**Einen Link ändern:**
```tsx
// ALT:
<Link href="/gruppen/little-joys" className="site-nav-link">Little Joys</Link>

// NEU (z.B. Text ändern):
<Link href="/gruppen/little-joys" className="site-nav-link">Kids Dance</Link>
```

**Einen Link hinzufügen:**
```tsx
<Link href="/neue-seite" className="site-nav-link">Neue Seite</Link>
```

---

## 🎭 Eventstudio Block

### Datei: `app/page.tsx`

**Wo:** `c:\Users\HP\Desktop\DanceMotion\app\page.tsx` (ca. Zeile 120-190)

Der Eventstudio Block zeigt auf der Homepage ein spezielles Angebot.

### Text ändern:

```tsx
<h2 className="mt-8 text-4xl font-bold leading-tight" style={{ color: "var(--fg)" }}>
  DanceMotion <br /> <span style={{ color: "var(--accent)" }}>Eventstudio</span>
</h2>

<p className="mt-6 text-lg leading-relaxed" style={{ color: "var(--muted)" }}>
  Professionelle Räume für Vermietung, Proben und Events. Dein Platz für Creativity und Performance.
</p>
```

Einfach den Text zwischen den Tags ändern.

### Bullet-Points ändern:

```tsx
<div className="flex gap-4 items-start">
  <div className="mt-1.5 h-1 w-1 rounded-full flex-shrink-0" style={{ backgroundColor: "var(--accent)" }}></div>
  <div>
    <p className="font-semibold" style={{ color: "var(--fg)" }}>Stundenvermietung</p>
    <p className="text-sm" style={{ color: "var(--muted)" }}>Tagsüber bis abends, flexibel buchbar</p>
  </div>
</div>
```

Einfach "Stundenvermietung" und "Tagsüber bis abends..." mit deinen Texten ersetzen.

### Button Text/Link ändern:

```tsx
<Link
  href="/eventstudio"  // ← Diese URL ändern
  className="inline-flex items-center rounded-full px-8 py-4 font-semibold transition-all duration-300 hover:shadow-lg"
  style={{
    backgroundColor: "var(--accent)",
    color: "#000",
  }}
>
  Studio erkunden →   {/* ← Diesen Text ändern */}
</Link>
```

---

## 📄 Gruppen-Detail-Seiten

### Dateien: 

```
app/gruppen/
  ├── little-joys/page.tsx
  ├── smileys/page.tsx
  └── emotion/page.tsx
```

**Wo:** `c:\Users\HP\Desktop\DanceMotion\app\gruppen\[gruppe]\page.tsx`

Jede Gruppe hat eine eigene Seite mit ausführlichen Informationen.

### Struktur einer Gruppen-Seite:

```tsx
export default function GroupPage() {
  return (
    <div className="min-h-screen">
      <HeroScene />
      
      <section id="about" className="mx-auto max-w-6xl px-6 py-28">
        <h1 className="text-4xl font-bold">Little Joys</h1>
        <p className="mt-4 text-lg">Ausführliche Beschreibung...</p>
      </section>

      <section id="schedule" className="mx-auto max-w-6xl px-6 py-28">
        <h2 className="text-3xl font-bold">Termine & Zeiten</h2>
        {/* Termine hier */}
      </section>

      <section id="contact" className="mx-auto max-w-6xl px-6 py-28">
        <h2 className="text-3xl font-bold">Kontakt</h2>
        {/* Kontaktinfo hier */}
      </section>
    </div>
  );
}
```

### Text ändern:

Einfach den Text in den `<h1>`, `<h2>`, `<p>` Tags ändern.

### Termine hinzufügen:

```tsx
<div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
  <div className="p-6 rounded-lg border border-border" style={{ backgroundColor: "var(--panel)" }}>
    <p className="font-semibold">Montag & Mittwoch</p>
    <p className="text-sm" style={{ color: "var(--muted)" }}>17:00 - 18:30 Uhr</p>
    <p className="text-sm mt-2">Tanzstudio DanceMotion, Adresse...</p>
  </div>
  
  <div className="p-6 rounded-lg border border-border" style={{ backgroundColor: "var(--panel)" }}>
    <p className="font-semibold">Samstag</p>
    <p className="text-sm" style={{ color: "var(--muted)" }}>10:00 - 11:30 Uhr</p>
    <p className="text-sm mt-2">Tanzstudio DanceMotion, Adresse...</p>
  </div>
</div>
```

---

## 🦶 Footer

### Datei: `app/components/Footer.tsx`

**Wo:** `c:\Users\HP\Desktop\DanceMotion\app\components\Footer.tsx`

Der Footer enthält Links zu wichtigen Seiten.

### Footer Links ändern:

```tsx
<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
  {/* Kolumne 1: Gruppen */}
  <div>
    <h3 className="font-semibold mb-4">Gruppen</h3>
    <ul className="space-y-2">
      <li><Link href="/gruppen/little-joys">Little Joys</Link></li>
      <li><Link href="/gruppen/smileys">Smileys</Link></li>
      <li><Link href="/gruppen/emotion">Emotion</Link></li>
    </ul>
  </div>
</div>
```

Einfach Links und Texte ändern.

---

## 🎨 Farben & Design

### Datei: `app/globals.css`

**Wo:** `c:\Users\HP\Desktop\DanceMotion\app\globals.css` (ca. Zeile 60-75)

### Light Mode Farben:

```css
html[data-theme="light"] {
  --bg: #FAF5ED;           /* Hintergrund */
  --fg: #1A1410;           /* Text-Farbe */
  --muted: #8B7B6F;        /* Grauer Text (Beschreibungen) */
  --panel: #FEF8F0;        /* Karten-Background */
  --border: #E8D9C8;       /* Borders */
  --accent: #2EC4C6;       /* Hauptfarbe (Teal) */
}
```

### Dark Mode Farben:

```css
html[data-theme="dark"] {
  --bg: #0A0A0A;           /* Hintergrund */
  --fg: #F9F7F4;           /* Text-Farbe */
  --muted: #A89F99;        /* Grauer Text */
  --panel: #121212;        /* Karten-Background */
  --border: #2A2A2A;       /* Borders */
  --accent: #2EC4C6;       /* Hauptfarbe (Teal) */
}
```

### Farben ändern:

Einfach die Hex-Werte anpassen. Beispiel:

```css
/* ALT: */
--bg: #FAF5ED;

/* NEU (helleres Beige): */
--bg: #FFFBF5;
```

---

## 📝 Häufig gestellte Fragen (FAQ)

### F: Wie füge ich eine neue Gruppe hinzu?

**A:** 
1. Füge die Gruppe in `lib/site-data.ts` hinzu
2. Erstelle eine neue Datei `app/gruppen/[neue-gruppe]/page.tsx`
3. Kopiere die Struktur von einer bestehenden Gruppe (z.B. `little-joys`)
4. Ändere den Inhalt

### F: Wo kann ich Bilder/Logos hochladen?

**A:** Alle Bilder gehen in den `public/` Ordner:
- `public/logo-*.svg` → Logos
- `public/images/` → Andere Bilder

Dann einfach in der Komponente verwenden:
```tsx
<Image src="/logo-mein-logo.svg" alt="Mein Logo" width={120} height={120} />
```

### F: Wie ändere ich die Adresse/Kontakt?

**A:** 
- Impressum: `app/impressum/page.tsx`
- Datenschutz: `app/datenschutz/page.tsx`

Einfach den Text dort ändern.

### F: Kann ich neue Seiten erstellen?

**A:** Ja! Erstelle einen neuen Ordner in `app/`:
```
app/neue-seite/page.tsx
```

Dann ist die Seite automatisch unter `/neue-seite` erreichbar.

### F: Wie ändern ich die Texte auf der Homepage?

**A:** 
- **Haupttitel:** `app/page.tsx` (ca. Zeile 15)
- **Hero-Text:** `app/page.tsx` → `HeroScene` Komponente
- **Gruppen-Titel:** `lib/site-data.ts`
- **Eventstudio Block:** `app/page.tsx` (ca. Zeile 120)

---

## 🔗 Wichtige Dateien Quick-Referenz

| Bereich | Datei | Beschreibung |
|---------|-------|-------------|
| **Gruppen** | `lib/site-data.ts` | Alle Gruppen-Daten |
| **Homepage** | `app/page.tsx` | Haupt-Inhalte |
| **Header** | `app/components/Header.tsx` | Navigation |
| **Footer** | `app/components/Footer.tsx` | Fußzeile |
| **Gruppen-Seiten** | `app/gruppen/*/page.tsx` | Detail-Seiten |
| **Styling** | `app/globals.css` | Farben & Design |
| **Impressum** | `app/impressum/page.tsx` | Impressum |
| **Datenschutz** | `app/datenschutz/page.tsx` | Datenschutz |

---

## 🚀 Tipps zum Arbeiten

### Texte ändern - Best Practices:

1. **HTML-Tags nicht löschen**, nur Text ändern
2. **Formatierung beibehalten** (Bold, Italics, etc.)
3. **Nach Änderung speichern** - Webpage lädt automatisch neu

### Farben ändern:

1. Gehe zu `app/globals.css`
2. Finde `html[data-theme="light"]` oder `html[data-theme="dark"]`
3. Ändere die Hex-Werte
4. Speichern → Webpage aktualisiert sich

### Neue Links hinzufügen:

```tsx
<Link href="/neue-seite" className="site-nav-link">
  Neuer Link
</Link>
```

---

## 📞 Support & Weitere Hilfe

Bei Fragen oder Problemen:
1. Schau in die jeweilige `.tsx` Datei
2. Suche nach dem Text, den du ändern möchtest
3. Ändere nur den sichtbaren Text, nicht die HTML-Struktur

Viel Erfolg beim Bearbeiten! 🎉
