# 🚀 DanceMotion Server Deployment Guide

Wie du DanceMotion auf deinem Server mit Docker & Traefik deployst.

---

## 📋 Voraussetzungen

- ✅ Server läuft (ubuntu-template)
- ✅ Docker & Docker Compose installiert
- ✅ Traefik v3.1 läuft (mit traefik_proxy Network)
- ✅ Cloudflare Tunnel configured
- ✅ Git Repo geclont: `/opt/dancemotion/web/`

---

## 🔑 Schritt 1: Supabase Keys besorgen

### 1.1 Supabase Projekt erstellen

Falls noch nicht getan:
- https://supabase.com
- New Project erstellen
- Database Password merken!
- Region: Europe - Frankfurt

### 1.2 API Keys kopieren

Im Supabase Dashboard:
```
Settings → API

Kopiere diese 3 Werte:
- Project URL
- anon public key
- service_role key
```

---

## 📝 Schritt 2: .env Datei auf dem Server erstellen

SSH zum Server:
```bash
ssh luca@192.168.178.104
```

Dann erstelle die `.env` Datei:
```bash
cat > /opt/dancemotion/web/.env << 'EOF'
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Admin Credentials
ADMIN_EMAIL=admin@dancemotion.de
ADMIN_PASSWORD=DeinSicheresPassword123!

# App Config
NEXT_PUBLIC_APP_URL=https://dancemotion.homebasetheisen.me
EOF
```

**WICHTIG:** Ersetze die `...` mit deinen echten Keys von Supabase!

---

## 🐳 Schritt 3: Docker Container neu bauen & starten

### 3.1 Alten Container stoppen
```bash
cd /opt/dancemotion/web
docker compose down
```

### 3.2 Neuen Container bauen & starten
```bash
docker compose up -d --build
```

### 3.3 Container Status checken
```bash
docker ps | grep dancemotion
docker compose logs -f
```

Du solltest sehen:
```
> next@16.1.1 start
> next start

  ▲ Next.js 16.1.1
  - Local:        http://localhost:3000
```

---

## ✅ Schritt 4: Testen

### 4.1 Container Logs checken
```bash
docker compose logs dancemotion-web | tail -20
```

Sollte keine Errors zeigen.

### 4.2 Öffne die Website
```
https://dancemotion.homebasetheisen.me
```

Du solltest die Homepage sehen! ✅

### 4.3 Admin Panel testen
```
https://dancemotion.homebasetheisen.me/admin/login
```

Melde dich an mit:
- Email: `admin@dancemotion.de`
- Password: (was du in .env gesetzt hast)

---

## 📊 Monitoring

### Container Logs anschauen
```bash
docker compose logs -f dancemotion-web
```

### Container Stats
```bash
docker stats dancemotion-web
```

### Traefik Dashboard
```
https://ops-control.homebasetheisen.me/traefik
```
Dort siehst du den Router für `dancemotion.homebasetheisen.me`

---

## 🔄 Updates deployen

Wenn du Code änderungen machst:

### 1. Local committen & pushen
```bash
# Auf deinem PC
git add -A
git commit -m "deine änderung"
git push origin main
```

### 2. Auf dem Server pullen
```bash
cd /opt/dancemotion/web
git pull origin main
docker compose up -d --build
```

Das war's! Container wird neu gebaut & gestartet 🚀

---

## 🆘 Troubleshooting

### ❌ Container startet nicht
```bash
docker compose logs dancemotion-web
```

Schau auf Errors - wahrscheinlich fehlen Environment Variables.

### ❌ Admin Login funktioniert nicht
- Checke ob `.env` Datei richtig gesetzt ist
- Verify Supabase Keys sind richtig kopiert
- Schau Supabase Auth ist in Supabase Dashboard konfiguriert

### ❌ Domain erreichbar aber nur Error
```bash
# Container neu starten
docker compose restart dancemotion-web

# Logs anschauen
docker compose logs -f
```

### ❌ Traefik sieht den Container nicht
```bash
# Checke ob traefik_proxy Network existiert
docker network ls | grep traefik

# Wenn nicht, erstelle es
docker network create traefik_proxy
```

---

## 📁 Datei-Struktur

```
/opt/dancemotion/web/
├── dockerfile              ← Multi-stage build mit ENV support
├── docker-compose.yml      ← Services mit environment: section
├── .env                    ← Secrets (nicht in Git!)
├── .env.example            ← Template (in Git)
├── .gitignore              ← Ignoriert .env
├── app/                    ← Next.js App
├── lib/                    ← Backend Code
├── supabase/               ← DB Migrations
└── ... (andere Dateien)
```

---

## 🔒 Sicherheit

✅ **Best Practices:**

- `.env` Datei ist **NICHT** in Git (siehe `.gitignore`)
- Service Role Key wird **NUR** auf dem Server geladen
- Public Keys sind okay öffentlich (NEXT_PUBLIC_*)
- Passwords sollten sicher sein (mind. 12 Zeichen)

⚠️ **Vor Production:**
- Default Password ändern
- HTTPS überprüfen (Cloudflare Tunnel macht das)
- Supabase RLS überprüfen
- Backups konfigurieren

---

## 📚 Weitere Infos

- **BACKEND_SETUP.md** - Supabase Setup Anleitung
- **BACKEND_IMPLEMENTATION.md** - Technische Details
- **docker-compose.yml** - Container Konfiguration
- **dockerfile** - Image Build Script

---

**Deployment: ✅ READY!** 🚀

Bei Fragen: Schau die Logs oder frag!
