# 📚 DanceMotion - Content Änderungs-Beispiele

Praktische Beispiele für häufige Content-Änderungen.

---

## 📋 Inhaltsverzeichnis

1. [Gruppe umbenennen](#gruppe-umbenennen)
2. [Gruppenbeschreibung ändern](#gruppenbeschreibung-ändern)
3. [Neue Gruppe hinzufügen](#neue-gruppe-hinzufügen)
4. [Kontaktinformationen ändern](#kontaktinformationen-ändern)
5. [Termine ändern](#termine-ändern)
6. [Navigation Links anpassen](#navigation-links-anpassen)

---

## 🏷️ Gruppe umbenennen

### Szenario: "Little Joys" soll "Tiny Dancers" heißen

**Schritt 1:** Öffne `lib/site-data.ts`

```typescript
// VORHER:
{
  title: "Little Joys",
  slug: "little-joys",
  shortDescription: "Tanzen für die Kleinsten — spielerisch und mit viel Freude.",
  href: "/gruppen/little-joys",
  logo: "/logo-littlejoys.svg",
},

// NACHHER:
{
  title: "Tiny Dancers",  // ← GEÄNDERT
  slug: "little-joys",    // ← NICHT ÄNDERN (URLs würden kaputt gehen!)
  shortDescription: "Tanzen für die Kleinsten — spielerisch und mit viel Freude.",
  href: "/gruppen/little-joys",
  logo: "/logo-littlejoys.svg",
},
```

**Schritt 2:** Öffne `app/gruppen/little-joys/page.tsx`

```tsx
// VORHER:
<h1 className="text-4xl font-bold">Little Joys</h1>

// NACHHER:
<h1 className="text-4xl font-bold">Tiny Dancers</h1>
```

**Schritt 3:** Speichern - Fertig! ✅

---

## 📝 Gruppenbeschreibung ändern

### Szenario: Die Beschreibung von "Smileys" updaten

**Datei:** `lib/site-data.ts`

```typescript
// VORHER:
{
  title: "Smileys",
  slug: "smileys",
  shortDescription: "Fröhliche Gruppe für Kinder mit Bewegung und Musik.",
  href: "/gruppen/smileys",
  logo: "/logo-smileys.svg",
},

// NACHHER:
{
  title: "Smileys",
  slug: "smileys",
  shortDescription: "Für Kids ab 5 Jahren - Tanzen, spielen & Spaß haben mit Freunden!", // ← GEÄNDERT
  href: "/gruppen/smileys",
  logo: "/logo-smileys.svg",
},
```

Diese Beschreibung wird auf der Homepage angezeigt.

**Für lange Beschreibungen auf der Gruppen-Seite:**

Öffne `app/gruppen/smileys/page.tsx` und ändere:

```tsx
<section id="about" className="mx-auto max-w-6xl px-6 py-28">
  <h2 className="text-3xl font-bold mb-6">Über Smileys</h2>
  <p className="text-lg leading-relaxed" style={{ color: "var(--muted)" }}>
    Alte Beschreibung...
  </p>
  
  {/* NEUE VERSION: */}
  <p className="text-lg leading-relaxed" style={{ color: "var(--muted)" }}>
    Smileys ist die perfekte Gruppe für Kinder ab 5 Jahren! Wir tanzen zu ihrer Lieblingsmusik,
    spielen Tanzspiele und lernen gemeinsam coole Moves. In einer freundlichen und lustigen Atmosphäre
    bauen die Kinder Vertrauen in ihren Körper auf und entwickeln Rhythmusgefühl.
  </p>
</section>
```

---

## ✨ Neue Gruppe hinzufügen

### Szenario: Neue Gruppe "Hip-Hop Generation" starten

**Schritt 1:** Öffne `lib/site-data.ts`

Füge am Ende des `tiles` Array hinzu:

```typescript
export const tiles: Tile[] = [
  // ... bestehende Gruppen ...
  
  // NEU HINZUFÜGEN:
  {
    title: "Hip-Hop Generation",
    slug: "hip-hop-generation",
    shortDescription: "Coole Hip-Hop Choreographien für Teenager und Erwachsene.",
    href: "/gruppen/hip-hop-generation",
    logo: "/logo-hiphop.svg",
  },
];
```

**Schritt 2:** Erstelle einen neuen Ordner

```
app/gruppen/hip-hop-generation/
└── page.tsx
```

**Schritt 3:** Erstelle `app/gruppen/hip-hop-generation/page.tsx`

Du kannst den Inhalt von einer bestehenden Gruppe kopieren und anpassen:

```tsx
"use client";
import Link from "next/link";
import HeroScene from "../../components/HeroScene";

export default function HipHopPage() {
  return (
    <div className="min-h-screen">
      <HeroScene />

      <section id="about" className="mx-auto max-w-6xl px-6 py-28">
        <h1 className="text-4xl font-bold" style={{ color: "var(--fg)" }}>
          Hip-Hop Generation
        </h1>
        <p className="mt-6 text-lg" style={{ color: "var(--muted)" }}>
          Die Hip-Hop Generation ist für alle, die coole, moderne Choreographien lieben.
          Von aktuellen Musikvideostylen bis zu klassischen Hip-Hop Basics - hier lernst du alles!
        </p>
      </section>

      <section id="schedule" className="mx-auto max-w-6xl px-6 py-28">
        <h2 className="text-3xl font-bold mb-8" style={{ color: "var(--fg)" }}>
          Termine
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 rounded-lg border" style={{ borderColor: "var(--border)", backgroundColor: "var(--panel)" }}>
            <p className="font-semibold" style={{ color: "var(--fg)" }}>Dienstag & Freitag</p>
            <p className="text-sm mt-2" style={{ color: "var(--muted)" }}>19:00 - 20:30 Uhr</p>
          </div>
        </div>
      </section>

      <section id="contact" className="mx-auto max-w-6xl px-6 py-28">
        <h2 className="text-3xl font-bold mb-4" style={{ color: "var(--fg)" }}>
          Interesse?
        </h2>
        <p className="mt-4" style={{ color: "var(--muted)" }}>
          Schreib uns eine Email oder komm vorbei!
        </p>
        <Link
          href="mailto:info@dancemotion.de"
          className="inline-block mt-6 px-8 py-3 rounded-full font-semibold"
          style={{
            backgroundColor: "var(--accent)",
            color: "#000",
          }}
        >
          Email schreiben
        </Link>
      </section>
    </div>
  );
}
```

**Schritt 4:** Logo hochladen

- Speichere dein Logo als `logo-hiphop.svg` im `public/` Ordner
- (Oder verwende ein bestehendes Logo und ändere den Namen)

**Schritt 5:** Navigation updaten (Optional)

Wenn du den Link in den Header-Navigation haben möchtest, öffne `app/components/Header.tsx` und füge hinzu:

```tsx
<Link href="/gruppen/hip-hop-generation" className="site-nav-link">
  Hip-Hop
</Link>
```

---

## 📞 Kontaktinformationen ändern

### Szenario: Email-Adresse aktualisieren

**Datei:** `app/gruppen/emotion/page.tsx` (oder jede andere Gruppen-Seite)

```tsx
// VORHER:
<Link
  href="mailto:info@old-email.com"
  className="btn-accent"
>
  Kontakt
</Link>

// NACHHER:
<Link
  href="mailto:kontakt@dancemotion.de"  // ← GEÄNDERT
  className="btn-accent"
>
  Kontakt
</Link>
```

### Adresse ändern:

Suche nach Text wie "Tanzstudio" oder "Adresse" in der Gruppen-Seite:

```tsx
// VORHER:
<p className="text-sm mt-2">
  Tanzstudio DanceMotion, Alte Straße 123, 10115 Berlin
</p>

// NACHHER:
<p className="text-sm mt-2">
  DanceMotion Studio, Neue Straße 456, 10115 Berlin  {/* ← GEÄNDERT */}
</p>
```

---

## 📅 Termine ändern

### Szenario: Neue Zeiten für "Emotion"

**Datei:** `app/gruppen/emotion/page.tsx`

```tsx
// VORHER:
<div className="p-6 rounded-lg border" style={{ borderColor: "var(--border)", backgroundColor: "var(--panel)" }}>
  <p className="font-semibold">Montag & Mittwoch</p>
  <p className="text-sm mt-2">19:00 - 20:30 Uhr</p>
</div>

// NACHHER:
<div className="p-6 rounded-lg border" style={{ borderColor: "var(--border)", backgroundColor: "var(--panel)" }}>
  <p className="font-semibold">Montag & Donnerstag</p>  {/* ← TAGE GEÄNDERT */}
  <p className="text-sm mt-2">19:30 - 21:00 Uhr</p>      {/* ← ZEIT GEÄNDERT */}
</div>
```

### Neuen Termin hinzufügen:

```tsx
{/* BESTEHENDER TERMIN */}
<div className="p-6 rounded-lg border" style={{ borderColor: "var(--border)", backgroundColor: "var(--panel)" }}>
  <p className="font-semibold">Montag & Donnerstag</p>
  <p className="text-sm mt-2">19:30 - 21:00 Uhr</p>
</div>

{/* NEUER TERMIN HINZUFÜGEN */}
<div className="p-6 rounded-lg border" style={{ borderColor: "var(--border)", backgroundColor: "var(--panel)" }}>
  <p className="font-semibold">Samstag</p>
  <p className="text-sm mt-2">10:00 - 11:30 Uhr</p>
</div>
```

---

## 🔗 Navigation Links anpassen

### Datei: `app/components/Header.tsx`

```tsx
// AKTUELLE NAVIGATION:
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

### Link umbenennen:

```tsx
// VORHER:
<Link href="/gruppen/emotion" className="site-nav-link">Emotion</Link>

// NACHHER:
<Link href="/gruppen/emotion" className="site-nav-link">Emotion - Dance</Link>
```

### Neuen Link hinzufügen:

```tsx
// Nach dem last Link hinzufügen:
<Link href="/galerie" className="site-nav-link">Galerie</Link>
```

### Link entfernen:

Einfach die ganze `<Link>` Zeile löschen.

---

## 🎨 Design & Farben anpassen

### Szenario: Accent-Farbe von Teal zu Lila ändern

**Datei:** `app/globals.css` (ca. Zeile 60-75)

```css
/* VORHER - Light Mode: */
html[data-theme="light"] {
  --accent: #2EC4C6;  /* Teal */
}

/* NACHHER - Lila: */
html[data-theme="light"] {
  --accent: #9D4EDD;  /* Lila */
}

/* VORHER - Dark Mode: */
html[data-theme="dark"] {
  --accent: #2EC4C6;  /* Teal */
}

/* NACHHER - Lila: */
html[data-theme="dark"] {
  --accent: #9D4EDD;  /* Lila */
}
```

### Hintergrund-Farbe ändern:

```css
/* VORHER - Light Mode: */
html[data-theme="light"] {
  --bg: #FAF5ED;  /* Warmes Beige */
}

/* NACHHER - Helleres Weiß: */
html[data-theme="light"] {
  --bg: #FFFCF9;  /* Heller */
}
```

### Text-Farbe ändern:

```css
/* VORHER - Light Mode: */
html[data-theme="light"] {
  --fg: #1A1410;  /* Dunkles Braun-Schwarz */
}

/* NACHHER - Reines Schwarz: */
html[data-theme="light"] {
  --fg: #000000;  /* Schwarz */
}
```

---

## 📧 Eventstudio Block Text ändern

### Datei: `app/page.tsx` (ca. Zeile 120-190)

```tsx
// HAUPTTITEL:
<h2 className="mt-8 text-4xl font-bold leading-tight" style={{ color: "var(--fg)" }}>
  DanceMotion <br /> <span style={{ color: "var(--accent)" }}>Eventstudio</span>
</h2>

// BESCHREIBUNG:
<p className="mt-6 text-lg leading-relaxed" style={{ color: "var(--muted)" }}>
  Professionelle Räume für Vermietung, Proben und Events. Dein Platz für Creativity und Performance.
</p>

// BUTTON:
<Link
  href="/eventstudio"
  className="inline-flex items-center rounded-full px-8 py-4 font-semibold transition-all duration-300 hover:shadow-lg"
  style={{
    backgroundColor: "var(--accent)",
    color: "#000",
  }}
>
  Studio erkunden →
</Link>
```

Einfach die Texte anpassen!

---

## ✅ Checkliste vor dem Speichern

- [ ] Text-Änderungen vorgenommen
- [ ] HTML-Tags nicht gelöscht
- [ ] Links überprüft (funktionieren sie noch?)
- [ ] Formatierung erhalten (Bold, Italics, etc.)
- [ ] Keine neuen Fehler eingeführt
- [ ] Datei gespeichert

---

## 🐛 Häufige Fehler vermeiden

❌ **FALSCH** - HTML-Tag löschen:
```tsx
// FALSCH:
Emotion <p className="text-lg">Beschreibung</p>

// RICHTIG:
<h1>Emotion</h1>
<p className="text-lg">Beschreibung</p>
```

❌ **FALSCH** - Link href vergessen:
```tsx
// FALSCH:
<Link className="btn">Link</Link>

// RICHTIG:
<Link href="/seite" className="btn">Link</Link>
```

❌ **FALSCH** - Typos in CSS-Variablen:
```css
/* FALSCH: */
color: var(--acccent);  /* 3 c's! */

/* RICHTIG: */
color: var(--accent);   /* 2 c's */
```

---

## 🚀 Nach Änderungen

1. **Datei speichern** (Strg+S)
2. **Browser aktualisieren** (F5)
3. **Änderung überprüfen**
4. **Beide Themes testen** (Dark & Light Mode)

Die Website sollte sich automatisch aktualisieren! ✨

---

**Viel Erfolg beim Bearbeiten!** 🎉
