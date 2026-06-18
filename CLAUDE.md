# DanceMotion 2.0 — Entwicklungskontext für Claude

## Was du gerade vor dir hast

Das ist die **DanceMotion 1.0** — eine Next.js Website für einen Tanzverein in Eschweiler.
Du arbeitest auf dem Branch `v2` (oder einem Feature-Branch davon).
**Ziel: Eine grundlegend überarbeitete 2.0** — kein Patch, kein Refactor einzelner Stellen,
sondern ein Meisterwerk das auf dem bestehenden Fundament aufbaut.

Die 1.0 bleibt im Branch `main` vollständig erhalten. Lies sie als Referenz.

---

## Was die App tut (Kurzüberblick)

**Öffentliche Seiten:** Homepage · Termine · 3 Gruppendetailseiten · Galerie · Team · FAQ · Dokumente · Sponsoren · Datenschutz · Impressum

**Admin-Panel (22 Bereiche):** Events · Galerie · Content · Team · FAQs · Dokumente · Sponsoren · Eventanfragen · Social Links · Hero-Banner · Gruppen-Banner · Recurring Events · Alerts · Tickets · Users · Rollen · Analytics · Audit-Log · Einstellungen · Passwort · Wiki Admin · Wiki Dev

**Backend:** Supabase (PostgreSQL + RLS + Auth) · 19 Tabellen · 60+ Next.js API Routes

Lies `app/`, `lib/`, `supabase/migrations/` um die Details zu verstehen — der Code ist die beste Dokumentation.

---

## Die zentralen Probleme der 1.0 die du löst

### Kritisch (zuerst):
1. `middleware.ts` schützt `/admin/*` nicht — Admin-UI wird für unauthentifizierte Nutzer gerendert
2. Kein Rate-Limit auf `app/api/admin/auth/login/route.ts`
3. `lib/rate-limiter.ts` → `getClientIp()` nimmt X-Forwarded-For blind (spoofbar)
4. `lib/validators.ts` → `sanitizeHtml()` nutzt `document.createElement` → Server-Crash
5. Admin-Passwort-Reset (`app/api/admin/users/[id]/reset-password/route.ts`) prüft nur 6 Zeichen, ignoriert `validatePassword()`

### Architektur:
6. **Alle öffentlichen Seiten sind `"use client"`** → SEO-blind, JS-Waterfall nach Hydration
7. `EditableContent` macht pro Instanz 2 eigene `fetch()` → N+1 HTTP-Requests (8 Felder = 16 Calls)
8. Gruppen (`lib/site-data.ts`) sind hardcoded TypeScript — neue Gruppe = Deployment
9. `content`-Tabelle überladen: speichert CMS-Text, Footer-Kontakt UND System-Settings
10. In-Memory Rate-Limiter bricht bei Restart/Multi-Instance

### Datenbank:
11. 6 Analytics-Funktionen aus Migration 019 sind broken (referenzieren `page_path`, `referrer_url`, `performance_metrics` — existieren nicht)
12. Kein `groups`-Table in der DB
13. `admin_users.password_hash` ist toter Code (Auth läuft über Supabase Auth)
14. Migration-Numbering-Konflikte (008, 009, 010 mehrfach vergeben)

---

## Architektur-Vorgaben für die 2.0

### Rendering: RSC by default
```
// SO NICHT (1.0-Muster):
"use client"
export default function Page() {
  const [events, setEvents] = useState([])
  useEffect(() => { fetch('/api/events').then(...) }, [])
}

// SO (2.0):
// app/termine/page.tsx — keine Direktive = Server Component
export default async function Page() {
  const events = await getUpcomingEvents() // direkt Supabase, kein HTTP
  return <EventTimeline events={events} />
}
```

`"use client"` nur wenn zwingend nötig: useState, useEffect, Browser-APIs, Framer Motion.
Daten werden im RSC gefetcht, als Props an Client-Islands übergeben.

### Content-Loading: Batch via Context
```
// SO NICHT (1.0): jedes EditableContent macht eigenen fetch
<EditableContent contentKey="hero_title" />      // 2 requests
<EditableContent contentKey="hero_subtitle" />   // 2 requests

// SO (2.0): RSC lädt alle Keys gebündelt
const content = await loadContentBatch(['hero_title', 'hero_subtitle', ...])
return (
  <ContentProvider value={content}>
    <EditableContent contentKey="hero_title" />   // liest aus Context
  </ContentProvider>
)
```

### Middleware: echter Auth-Gate
```typescript
// middleware.ts 2.0
export async function middleware(req: NextRequest) {
  if (req.nextUrl.pathname.startsWith('/admin') &&
      !req.nextUrl.pathname.startsWith('/admin/login')) {
    const session = await verifyAdminSession(req.cookies)
    if (!session) {
      return NextResponse.redirect(new URL('/admin/login', req.url))
    }
  }
  // Security headers wie bisher
}
```

### Input-Validierung: Zod für alle API-Routes
```typescript
// lib/schemas/events.ts
import { z } from 'zod'
export const CreateEventSchema = z.object({
  title: z.string().min(1).max(200),
  date:  z.string().date(),
  // ...
})

// in route.ts:
const body = CreateEventSchema.safeParse(await req.json())
if (!body.success) return Response.json({ error: body.error.flatten() }, { status: 400 })
```

### Rate-Limiting: Upstash Redis
```
// lib/redis.ts — Upstash HTTP-Client
// Ersetzt den In-Memory-Store in lib/rate-limiter.ts
// Interface bleibt gleich, nur Backing-Store wechselt
```

---

## Neue Features die gebaut werden

### Feature 1: Gruppen aus Datenbank
- Neue `groups`-Tabelle: `id, slug, name, short_desc, logo_url, color, sort_order, is_active`
- Dynamische Route `app/gruppen/[slug]/page.tsx` mit `generateStaticParams()`
- Admin-Panel `/admin/groups` (CRUD, Logo-Upload, Reihenfolge)
- Die 3 bestehenden Gruppen werden als Seed-Daten migriert

### Feature 2: Probestunden-Buchung
- Öffentliches Formular pro Gruppe (Name, E-Mail, Wunschtermin, Nachricht)
- Neuer `trial_bookings`-Table (DSGVO: 90-Tage-Auto-Delete wie event_requests)
- Admin-Panel `/admin/trial-bookings` (Status, Bestätigung, Ablehnung)
- Bestätigungs-E-Mail via Nodemailer (Transporter als Singleton auf Modul-Ebene!)

### Feature 3: iCal-Export
- Route `/api/ical/[slug].ics` → RFC-5545-konformer Feed pro Gruppe
- "In Google Kalender hinzufügen"-Button auf Terminseite und Gruppendetail

### Feature 4: Newsletter (Listmonk)
- Self-hosted via Docker (neuer Container in `docker-compose.yml`)
- Opt-in Formular auf Website (Double-Opt-In, DSGVO-konform)
- Admin versendet über Listmonk-UI (kein Custom-Admin nötig)

### Feature 5: Blog / News
- Neuer `posts`-Table: `id, slug, title, content (Markdown), cover_image, tags, published_at`
- Route `/news` und `/news/[slug]` als RSC
- Admin-Panel `/admin/posts` mit Markdown-Editor

### Feature 6: Interaktive Karte
- Leaflet.js + OpenStreetMap (kein API-Key)
- Trainingsort als Pin auf Gruppen-Detailseiten
- "Route planen"-Link öffnet OpenStreetMap

### Feature 7: Volltext-Suche
- Supabase Full-Text-Search (PostgreSQL `tsvector`, kein extra Service)
- Cmd+K Search-Modal (global)
- Durchsucht: Events, FAQs, News, Gruppen

### Feature 8: Video-Galerie
- YouTube-Playlist-Embed (kein API-Key benötigt)
- Admin hinterlegt Playlist-URL, iFrame wird rendert
- Route `/videos`

---

## Design-System 2.0

### Farben (unveränderlich)
```css
--bg:     #0A0A0A   /* Dark background */
--fg:     #F9F7F4   /* Text */
--muted:  #888888
--panel:  #111111
--border: #1e1e1e
--accent: #2EC4C6   /* Teal — Markenfarbe, NIEMALS ändern */
```

### Neue Libraries (installieren)
```bash
npm install lenis                        # Smooth Scroll
npm install @react-three/fiber @react-three/drei three  # 3D Hero
npm install @lottiefiles/dotlottie-react # Animations
npm install embla-carousel-react         # Carousel
npm install @formkit/auto-animate        # Admin Listen
npm install sonner                       # Toast Notifications
npm install react-countup                # CountUp Stats
npm install zod                          # Schema-Validierung
npm install leaflet react-leaflet        # Karte
npm install pino                         # Structured Logging
```

### Visual-Konzept
Lies `homepage-2.0-concept.html` im Root des Projekts.
Das ist eine fertige interaktive HTML-Datei die zeigt wie die Homepage aussehen soll:
- Bento Grid für Gruppen
- 3D-Torus-Canvas-Animation im Hero
- Grain-Overlay (4% opacity)
- Custom Cursor (Teal-Punkt + Ring)
- Magnetic Buttons
- Gradient Text auf Headings
- CountUp Stats
- Scroll-Reveal via IntersectionObserver

### Framer Motion: mehr nutzen
Das Package ist bereits installiert. In der 2.0 wird es konsequenter eingesetzt:
- `useInView` statt `whileInView` für präzise Kontrolle
- `AnimatePresence` für alle Page-Transitions
- `layout` prop für automatische Listen-Animationen
- `useScroll` + `useTransform` für Parallax (bereits in HeroScene, ausweiten)

---

## Datenbank-Änderungen

### Neue Tabellen anlegen
```sql
-- groups (neue Kernfunktion)
CREATE TABLE groups (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug        TEXT NOT NULL UNIQUE,
  name        TEXT NOT NULL,
  short_desc  TEXT,
  logo_url    TEXT,
  color       TEXT DEFAULT '#2EC4C6',
  sort_order  INT DEFAULT 0,
  is_active   BOOLEAN DEFAULT true,
  created_at  TIMESTAMPTZ DEFAULT now(),
  updated_at  TIMESTAMPTZ DEFAULT now()
);

-- trial_bookings (Probestunden)
CREATE TABLE trial_bookings (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name            TEXT NOT NULL,
  email           TEXT NOT NULL,
  phone           TEXT,
  group_slug      TEXT NOT NULL REFERENCES groups(slug),
  preferred_date  DATE,
  message         TEXT,
  status          TEXT DEFAULT 'new' CHECK (status IN ('new','confirmed','rejected','completed')),
  notes           TEXT,
  consent_given_at TIMESTAMPTZ NOT NULL,
  created_at      TIMESTAMPTZ DEFAULT now(),
  updated_at      TIMESTAMPTZ DEFAULT now()
);

-- posts (Blog/News)
CREATE TABLE posts (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug        TEXT NOT NULL UNIQUE,
  title       TEXT NOT NULL,
  content     TEXT NOT NULL,
  cover_image TEXT,
  tags        TEXT[] DEFAULT '{}',
  published_at TIMESTAMPTZ,
  created_by  UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at  TIMESTAMPTZ DEFAULT now(),
  updated_at  TIMESTAMPTZ DEFAULT now()
);

-- performance_metrics (für Analytics, war in 1.0 referenziert aber nie erstellt)
CREATE TABLE performance_metrics (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_hash TEXT NOT NULL,
  metric_name  TEXT NOT NULL,
  metric_value FLOAT NOT NULL,
  path         TEXT NOT NULL,
  created_at   TIMESTAMPTZ DEFAULT now()
);
```

### Bestehende Tabellen bereinigen
```sql
-- content aufteilen: settings in eigene Tabelle auslagern
-- (content mit section='settings' → site_settings)
CREATE TABLE site_settings (
  key        TEXT PRIMARY KEY,
  value      JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Toten Code entfernen
ALTER TABLE admin_users DROP COLUMN IF EXISTS password_hash;

-- Referenzielle Integrität herstellen
ALTER TABLE event_requests
  ALTER COLUMN assigned_to TYPE UUID USING assigned_to::UUID;
-- FK hinzufügen wenn Daten sauber sind
```

### Migration-Naming ab 2.0
```
Format: YYYYMMDD_HHMMSS_beschreibung.sql
Beispiel: 20250618_120000_add_groups_table.sql
Keine Nummern mehr — verhindert Konflikte
```

---

## Dateistruktur Ziel

```
app/
  (public)/              # Route Group: RSC by default, kein Auth
    page.tsx             # Homepage: alle Daten server-seitig
    termine/page.tsx     # RSC + revalidateTag('events')
    gruppen/[slug]/      # Dynamisch aus DB
    news/                # Blog: RSC
    videos/              # YouTube Embeds
    team/page.tsx        # RSC
    galerie/page.tsx     # RSC mit Client-Lightbox als Island
  admin/
    groups/              # NEU
    trial-bookings/      # NEU
    posts/               # NEU
    [alle bisherigen]/   # wie gehabt, aber mit Sonner Toasts + AutoAnimate
  api/
    ical/[slug]/         # NEU: iCal Feed
    search/              # NEU: Volltextsuche

lib/
  schemas/               # NEU: Zod-Schemas je Domain
    events.ts
    groups.ts
    posts.ts
    users.ts
  logger.ts              # NEU: Pino-Instance
  redis.ts               # NEU: Upstash-Client (Rate-Limiting)
  content-context.ts     # NEU: ContentProvider für Batch-Loading

components/
  ui/                    # Atomic (Button, Modal, Badge...)
  features/              # Feature-Components
    EventTimeline.tsx    # wie bisher
    GroupCard.tsx        # neu, aus Bento Grid
    SearchModal.tsx      # NEU: Cmd+K
  three/                 # NEU: React Three Fiber
    HeroTorus.tsx
  cursor/
    CustomCursor.tsx     # NEU
```

---

## Sprint-Reihenfolge

**Sprint 1 — Security (ZUERST, nichts anderes bis das done ist)**
- [ ] Middleware-Auth für `/admin/*`
- [ ] Rate-Limit auf Login-Endpunkt
- [ ] `sanitizeHtml()` server-safe machen
- [ ] `error.message` aus 500-Responses entfernen
- [ ] Admin Passwort-Reset: `validatePassword()` aufrufen

**Sprint 2 — Datenbank**
- [ ] `groups`-Tabelle + Seed-Daten (Little Joys, Smileys, Emotion)
- [ ] `trial_bookings`-Tabelle
- [ ] `posts`-Tabelle
- [ ] `performance_metrics`-Tabelle
- [ ] `site_settings` aus `content` auslagern
- [ ] 6 kaputte Analytics-Funktionen neu schreiben

**Sprint 3 — RSC-Migration der Public Pages**
- [ ] `app/(public)/page.tsx` → RSC
- [ ] `app/(public)/termine/page.tsx` → RSC
- [ ] `app/(public)/gruppen/[slug]/page.tsx` → dynamisch aus DB
- [ ] `ContentProvider` + `loadContentBatch()` für EditableContent
- [ ] `app/(public)/team/page.tsx` → RSC

**Sprint 4 — Neue Features**
- [ ] Admin `/admin/groups` + öffentliche `/gruppen/[slug]`
- [ ] Probestunden-Buchung (Form + Admin + E-Mail)
- [ ] iCal-Export
- [ ] Blog/News
- [ ] Leaflet-Karte
- [ ] Supabase-Volltextsuche + Search-Modal

**Sprint 5 — Visual Upgrade**
- [ ] Lenis installieren + in layout.tsx wrappen
- [ ] HeroScene: React Three Fiber Torus (Referenz: `homepage-2.0-concept.html`)
- [ ] CustomCursor-Komponente
- [ ] Grain-Overlay in globals.css
- [ ] Sonner Toasts im gesamten Admin
- [ ] AutoAnimate für alle Listen
- [ ] CountUp für Stats
- [ ] Embla Carousel für Sponsoren/Team mobil

**Sprint 6 — Infrastruktur**
- [ ] Pino-Logger
- [ ] Upstash Redis Rate-Limiter
- [ ] Zod-Schemas für alle API-Routes
- [ ] Playwright E2E-Tests (Login, Event-CRUD, Content-Edit)
- [ ] React Testing Library für EditableContent, AdminModal
- [ ] Next.js Image Optimierung in Prod aktivieren (`unoptimized: false`)
- [ ] Content-Security-Policy Header in Middleware

**Sprint 7 — Newsletter**
- [ ] Listmonk Container in `docker-compose.yml`
- [ ] Opt-in Formular auf Website
- [ ] Admin-Link zu Listmonk-UI

---

## Was du NIEMALS tun sollst

```
❌ "use client" auf neue Seiten-Komponenten ohne zwingenden Grund
❌ fetch() in useEffect für initiale Daten (→ RSC stattdessen)
❌ Nodemailer-Transporter innerhalb einer Funktion erstellen (→ Modul-Ebene!)
❌ error.message in HTTP-Response-Bodies zurückgeben
❌ X-Forwarded-For blind als Rate-Limit-Key nutzen
❌ document.* in Code der auch server-seitig laufen kann
❌ any als Typ für DB-Payloads
❌ Admin-Migrations ohne Timestamp-Prefix benennen
❌ Neue Gruppen als statische Dateien anlegen (→ DB + dynamische Route)
❌ Den In-Memory-Rate-Limiter für neue Rate-Limits nutzen (→ Redis)
```

---

## E-Mail Setup (Zoho Mail)

Für Nodemailer in der 2.0 wird Zoho Mail Free genutzt (info@dancemotion.org):
```typescript
// lib/email.ts — Transporter als Singleton (NICHT pro Aufruf erstellen!)
import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  host: 'smtp.zoho.eu',
  port: 465,
  secure: true,
  auth: {
    user: process.env.ZOHO_EMAIL,
    pass: process.env.ZOHO_PASSWORD,
  },
})

export async function sendEmail(options: {...}) {
  return transporter.sendMail(options)  // Singleton wird wiederverwendet
}
```

---

## Technischer Kontext

- **Framework:** Next.js 16+ mit App Router
- **Sprache:** TypeScript (strict mode)
- **Styling:** Tailwind CSS v4 + CSS Custom Properties
- **Animationen:** Framer Motion (installiert) + neu: Lenis, React Three Fiber, Lottie
- **Icons:** Lucide React
- **Datenbank:** Supabase (PostgreSQL, RLS, Auth, Storage)
- **Tests:** Vitest (vorhanden) + neu: Playwright, React Testing Library
- **Deployment:** Docker Compose auf selbst-gehostetem VPS (Hetzner)
- **E-Mail:** Zoho Mail Free (eigene Domain) via Nodemailer
- **Newsletter:** Listmonk (Self-hosted Docker)
- **Karten:** Leaflet.js + OpenStreetMap (kein API-Key)
- **Rate-Limiting:** Upstash Redis (ersetzt In-Memory-Store)

---

## Wichtige bestehende Dateien als Referenz

| Datei | Wofür |
|---|---|
| `homepage-2.0-concept.html` | Visuelles Ziel der Homepage (öffnen im Browser) |
| `supabase/migrations/` | Komplettes DB-Schema, alle 27 Migrationen lesen |
| `lib/auth.ts` | RBAC-System — unverändert übernehmen |
| `lib/audit-logger.ts` | Audit-Pattern — unverändert, nur `details: unknown` statt `any` |
| `app/admin/components/` | Admin Design-System — konsistent nutzen, auf ALLE Admin-Pages ausweiten |
| `lib/content-loader.ts` | `loadContentBatch()` existiert bereits — nur noch nicht genutzt |
| `app/api/admin/auth/` | Auth-Routes als Referenz — aber hardenen wie oben beschrieben |
