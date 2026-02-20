# 🚀 Backend Setup Guide - Supabase

Schritt-für-Schritt Anleitung zum Aktivieren des Admin Panels.

---

## 📋 Übersicht

Das Admin Panel ist **bereit zum Deployment**, aber braucht:
1. **Supabase Projekt** (kostenlosen Tier nutzen!)
2. **Environment Variables** konfigurieren
3. **Database Tables** erstellen (SQL Migration)
4. **Fertig!** Admin Panel läuft unter `/admin`

---

## 🔑 Schritt 1: Supabase Projekt erstellen

### 1.1 Account erstellen
- Gehe zu https://supabase.com
- Klick auf "Sign Up"
- Nutze Email oder GitHub

### 1.2 Neues Projekt erstellen
- Dashboard → "New Project"
- **Name:** "dancemotion" (oder beliebig)
- **Database Password:** Sicheres Passwort notieren! ⚠️
- **Region:** "Europe" (näher zu Nutzern)
- Warte auf Initialisierung (2-3 Min)

### 1.3 API Keys kopieren
Gehe zu **Settings → API** und kopiere:
- **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
- **anon public key** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- **Service Role key** → `SUPABASE_SERVICE_ROLE_KEY` (geheim halten!)

---

## 🗄️ Schritt 2: Database Setup

### 2.1 SQL Migration ausführen
- Gehe in Supabase Dashboard zu **SQL Editor**
- Erstelle neue Query
- Kopiere den Inhalt aus: `supabase/migrations/001_create_tables.sql`
- Führe aus (▶️ Button oder Strg+Enter)
- ✅ Alle 6 Tables sollten erstellt sein

### 2.2 Verifizieren
- Gehe zu **Table Editor**
- Sollte sehen: `events`, `content`, `forms`, `form_submissions`, `gallery`, `admin_users`

---

## 🔐 Schritt 3: Environment Variables

### 3.1 `.env.local` aktualisieren

Öffne `c:\Users\HP\Desktop\DanceMotion\.env.local` und ersetze die Werte:

```env
# Supabase URLs (von Step 1.3)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Admin Account (setze dein Passwort!)
ADMIN_EMAIL=admin@dancemotion.de
ADMIN_PASSWORD=DeinSicheresPassword123!

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

⚠️ **WICHTIG:** `.env.local` ist in `.gitignore` - wird nicht gepusht!

---

## 👤 Schritt 4: Admin User erstellen

### 4.1 Supabase Auth setup
- Gehe zu **Authentication → Providers**
- Stelle sicher "Email" ist aktiviert
- Gehe zu **Users** (unter Authentication)

### 4.2 Admin User erstellen
- Klick auf "Invite user"
- **Email:** `admin@dancemotion.de` (oder deine Wahl)
- **Password:** Etwas sicheres eingeben
- Supabase sendet ein Verification Email

### 4.3 User verifizieren
- Öffne das Email von Supabase
- Bestätige Email
- Set Password

---

## 🧪 Schritt 5: Testen

### 5.1 Dev Server starten
```bash
npm run dev
```

### 5.2 Admin Panel öffnen
- Öffne http://localhost:3000/admin/login
- Melde dich an mit der Email/Password aus Step 4.2

### 5.3 Dashboard testen
- ✅ Dashboard sollte laden
- ✅ "Neue Events" Button klickbar
- ✅ Termin erstellen und speichern
- ✅ Homepage unter `/` sollte aktualisiert werden

---

## 🌐 Schritt 6: Production Deployment

Wenn alles lokal funktioniert:

### 6.1 Vercel Deploy
- Gehe zu https://vercel.com
- Importiere dein GitHub Repo
- Setze Environment Variables:
  ```
  NEXT_PUBLIC_SUPABASE_URL=...
  NEXT_PUBLIC_SUPABASE_ANON_KEY=...
  SUPABASE_SERVICE_ROLE_KEY=...
  ADMIN_EMAIL=...
  ADMIN_PASSWORD=...
  ```
- Deploy! 🚀

### 6.2 Sicherheit
- ⚠️ `SUPABASE_SERVICE_ROLE_KEY` und `ADMIN_PASSWORD` sind **geheim**!
- Nie in Git committen
- Nutze Vercel Secrets Management
- Ändere Default Password nach Go-Live!

### 6.3 Self-Hosted Deployment (VM)
Für VM-Deployments nutze den neuen Host:

```bash
ssh dev@dancemotion-prod "cd /opt/dancemotion/web && git pull origin main && docker compose up -d --build"
# alternativ:
ssh dev@192.168.178.116 "cd /opt/dancemotion/web && git pull origin main && docker compose up -d --build"
```

---

## 📁 Datei-Übersicht

```
Backend Struktur:
├── app/admin/
│   ├── login/page.tsx          ← Login Seite
│   ├── events/page.tsx         ← Event Management
│   ├── content/page.tsx        ← Text Management
│   ├── gallery/page.tsx        ← (Placeholder)
│   ├── layout.tsx              ← Admin Layout + Nav
│   └── page.tsx                ← Dashboard
├── app/api/admin/
│   ├── auth/
│   │   ├── login/route.ts      ← Login API
│   │   ├── logout/route.ts     ← Logout API
│   │   └── session/route.ts    ← Session Check
│   ├── events/
│   │   ├── route.ts            ← GET/POST Events
│   │   └── [id]/route.ts       ← GET/PUT/DELETE Event
│   └── content/
│       ├── route.ts            ← GET/POST Content
│       └── [key]/route.ts      ← GET/PUT Content
├── lib/
│   ├── supabase.ts             ← Supabase Clients + Types
│   └── auth.ts                 ← Auth Helpers
└── supabase/
    └── migrations/
        └── 001_create_tables.sql ← Database Schema
```

---

## 🆘 Häufige Fehler

### ❌ "Error: Cannot find module @supabase/supabase-js"
**Lösung:** `npm install @supabase/supabase-js`

### ❌ "Error: 42P01: relation "events" does not exist"
**Lösung:** SQL Migration nicht ausgeführt. Siehe Step 2.1

### ❌ "Error: Invalid login credentials"
**Lösung:** 
- Email und Password korrekt?
- User in Supabase erstellt und verifiziert?
- `.env.local` aktualisiert?

### ❌ Admin Login lädt unendlich
**Lösung:**
- Browser Console öffnen (F12)
- Schaue auf Errors
- Checke Network Tab auf failed Requests
- Wahrscheinlich Supabase Keys falsch

### ❌ "Unauthorized" beim Speichern
**Lösung:**
- Logout und wieder einloggen
- Session Token ist abgelaufen
- Browser Cookies checken

---

## ✅ Checkliste

Bevor du sagst "fertig":

- [ ] Supabase Projekt erstellt
- [ ] API Keys in `.env.local` eingefügt
- [ ] SQL Migration ausgeführt (6 Tables in Supabase)
- [ ] Admin User erstellt in Supabase Auth
- [ ] `npm run dev` läuft fehlerfrei
- [ ] `/admin/login` öffnet sich
- [ ] Kann mich mit Email/Password anmelden
- [ ] Dashboard zeigt Stats
- [ ] Kann ein Event erstellen
- [ ] Event erscheint auf der Homepage

---

## 🚀 Nächste Schritte

**Nach erfolgreicher Einrichtung:**

1. Teste alle Admin Features:
   - ✅ Events CRUD
   - ✅ Content Edit
   - ✅ Login/Logout

2. Integriere Content auf den Seiten:
   - Nutze DB-Daten statt `lib/*.ts` Static Files
   - Ermöglicht Live-Updates ohne Deploy

3. Ergänzungen (Optional):
   - Form Builder
   - Gallery Upload
   - Email Notifications

---

**Viel Erfolg beim Aufsetzen! 🎉**

Fragen? Kontakt!
