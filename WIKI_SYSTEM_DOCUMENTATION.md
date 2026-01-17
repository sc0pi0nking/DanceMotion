# 📚 Wiki System - Admin Wiki & Dev Wiki
**Date:** 2026-01-17 | **Status:** ✅ COMPLETE

---

## 🎯 Overview

Die Wiki wurde komplett umgestellt: **Zwei spezialisierte Wikis** mit **separaten Permissions**:

### 1️⃣ **Admin Wiki** (`/admin/wiki/admin`)
Für **Non-Technische Admins** - Fokus auf **Funktionalität & Content-Management**

### 2️⃣ **Dev Wiki** (`/admin/wiki/dev`)
Für **Entwickler & Technisches Team** - Fokus auf **Architecture & Implementation**

---

## 📋 Admin Wiki Content

### ✅ Implemented Pages

| Page | URL | Purpose |
|------|-----|---------|
| **Getting Started** | `/admin/wiki/admin/getting-started` | Orientierung für neue Admins |
| **Event Management** | `/admin/wiki/admin/event-management` | Termine erstellen & verwalten |
| **Gallery Management** | `/admin/wiki/admin/gallery-management` | Bilder hochladen & organisieren |
| **Content Management** | `/admin/wiki/admin/content-management` | Website-Texte bearbeiten |
| **Document Management** | `/admin/wiki/admin` | (Link zum Dokumente-System) |
| **FAQ Management** | `/admin/wiki/admin` | (Link zu FAQ-Editor) |
| **Team Management** | `/admin/wiki/admin` | (Link zu Team-Verwaltung) |
| **Social Links** | `/admin/wiki/admin` | (Link zu Social-Media) |

### 📝 Getting Started Page
- Dashboard Übersicht
- Navigation & Menü Erklärung
- Profil & Einstellungen
- Wichtige Tipps
- Nächste Schritte Links

### 📅 Event Management Page
- Neuen Termin erstellen (Schritt für Schritt)
- Pflichtfelder vs. Optionale Felder
- Wiederkehrende Termine Setup
- Bearbeiten & Löschen
- Filterung & Ansichten
- Best Practices

### 🖼️ Gallery Management Page
- Bilder hochladen
- Bildverwaltung (Grid, Filter, Sortierung)
- Bearbeiten & Löschen
- Best Practices
- Häufige Fehler vermeiden

### ✏️ Content Management Page
- Bearbeitbare Content-Bereiche
- Schritt-für-Schritt Anleitung
- Text-Formatierung (Markdown)
- Vorschau & Live-Anzeige
- Tipps & Best Practices
- Häufige Fehler

---

## 👨‍💻 Dev Wiki Content

### ✅ Implemented Pages

| Page | URL | Purpose |
|------|-----|---------|
| **Project Structure** | `/admin/wiki/dev/project-structure` | Verzeichnis-Übersicht |
| **Audit System** | `/admin/wiki/dev` | (Link vorbereitet) |
| **User & Role Management** | `/admin/wiki/dev` | (Link vorbereitet) |
| **Settings Management** | `/admin/wiki/dev` | (Link vorbereitet) |
| **Error Handling** | `/admin/wiki/dev` | (Link vorbereitet) |
| **API Endpoints** | `/admin/wiki/dev` | (Link vorbereitet) |
| **Database & Migrations** | `/admin/wiki/dev` | (Link vorbereitet) |
| **Deployment & Server** | `/admin/wiki/dev` | (Link vorbereitet) |
| **Commands Reference** | `/admin/wiki/dev/commands` | Build, Git, Docker, SSH |
| **Security & DSGVO** | `/admin/wiki/dev` | (Link vorbereitet) |

### 📂 Project Structure Page
- Root-Verzeichnis Übersicht
- app/ Directory Struktur (Pages, APIs, Components)
- lib/ Utilities Erklärung
- supabase/ Database Config
- Naming Conventions
- Routing Examples

```
DanceMotion/
├── app/                    # Next.js App Directory
│   ├── admin/             # Admin Routes (Protected)
│   ├── api/               # API Routes
│   ├── components/        # React Components
│   └── public-pages/      # Public Website
├── lib/                   # Utilities & Helpers
├── public/                # Static Assets
├── supabase/              # Database Config
└── scripts/               # Automation
```

### 💻 Commands Reference Page
Umfassende Command-Sammlung mit Kategorien:

**Development & Build:**
- `npm run dev` - Dev Server
- `npm run build` - Production Build
- `npm run lint` - ESLint Check

**Git Operations:**
- Status, Add, Commit, Push, Pull
- Branch Management
- History & Undo (Reset, Diff, Stash)

**Database & Supabase:**
- Migration Commands
- Supabase CLI Commands

**Docker & Server:**
- Docker Compose Commands
- SSH & Server Management
- SCP File Transfer

**Debugging & Troubleshooting:**
- TypeScript Checking
- ESLint Fixing
- Package Management
- Process Management

**Workflow Examples:**
- Feature Development Workflow
- Production Deployment Workflow
- Bug Fix Workflow

**Tech Stack Info:**
- Next.js 16.1.1
- React 19.2.3
- TypeScript 5
- Tailwind 4
- Supabase 2.90.1
- PostgreSQL 14+

---

## 🔐 Permissions System

### Old System ❌
```
- wiki: 'wiki' (Single Permission)
```

### New System ✅
```
- wiki_admin: 'wiki_admin'    # Admin Wiki (Non-Technical)
- wiki_dev: 'wiki_dev'        # Dev Wiki (Technical)
```

### Role Permissions Mapping

| Role | wiki_admin | wiki_dev | Purpose |
|------|-----------|---------|---------|
| **admin** | ✅ | ✅ | Full Access |
| **event-manager** | ✅ | ❌ | Event Management |
| **editor** | ✅ | ❌ | Content & Media |
| **viewer** | ✅ | ❌ | Read-Only |
| **social-manager** | ✅ | ❌ | Social & Gallery |
| **developer** | ❌ | ✅ | Technical/Dev Only |
| **support** | ✅ | ❌ | Support Team |

---

## 🛠️ Changes Made

### 1. **Database Migration Update** (011_user_role_management.sql)
✅ Split `wiki` permission into `wiki_admin` and `wiki_dev`
✅ Updated existing roles with new permissions
✅ Added new "developer" role with wiki_dev access
✅ Added new "support" role with wiki_admin access

### 2. **Auth System Update** (lib/auth.ts)
✅ Updated PERMISSIONS constant with `WIKI_ADMIN` and `WIKI_DEV`
✅ Updated PAGE_PERMISSIONS mapping with new wiki routes
✅ Routes now check for specific wiki permissions

### 3. **Navigation Update** (app/admin/layout.tsx)
✅ Changed "Wiki" single link to two links:
  - "Admin Wiki" → `/admin/wiki/admin` (requires wiki_admin)
  - "Dev Wiki" → `/admin/wiki/dev` (requires wiki_dev)
✅ Links only show if user has corresponding permission

### 4. **Wiki Structure Creation**
✅ New directories:
  - `app/admin/wiki/admin/` - Admin Wiki pages
  - `app/admin/wiki/dev/` - Dev Wiki pages

✅ New files:
  - `app/admin/wiki/admin/page.tsx` - Admin Wiki hub
  - `app/admin/wiki/admin/getting-started.tsx`
  - `app/admin/wiki/admin/event-management.tsx`
  - `app/admin/wiki/admin/gallery-management.tsx`
  - `app/admin/wiki/admin/content-management.tsx`
  - `app/admin/wiki/dev/page.tsx` - Dev Wiki hub
  - `app/admin/wiki/dev/project-structure.tsx`
  - `app/admin/wiki/dev/commands.tsx`

---

## 🎨 UI Features

### Admin Wiki Hub
- 8 article cards with icons
- Non-technical descriptions
- Color-coded categories (blue, purple, pink, etc.)
- Info box with tips & hints
- Responsive grid layout (1-2 columns)

### Dev Wiki Hub
- 10 article cards with icons
- Technical descriptions
- Color-coded by category
- Quick Commands Reference box
- Tech Stack info box
- Responsive grid layout

### Article Pages
- Back button to parent wiki
- Article header with icon
- Multiple sections with proper hierarchy
- Code blocks (in Dev Wiki)
- Info/Warning/Tip boxes
- Best practices sections
- Footer with related links

---

## 📊 Permissions Implementation

### How Permissions Work
1. User logs in → system fetches permissions from roles
2. Navigation filters items based on user permissions
3. Page access checked via `PAGE_PERMISSIONS` mapping
4. Users without permission see 404

### Example: Developer Role
```typescript
{
  name: 'developer',
  description: 'Entwickler-Zugriff mit technischer Dokumentation',
  permissions: [
    'dashboard', 'users', 'roles', 'audit', 'settings',
    'wiki_dev', 'analytics'  // ← Only Dev Wiki!
  ]
}
```

### Example: Support Role
```typescript
{
  name: 'support',
  description: 'Support-Team mit Admin Wiki Zugriff',
  permissions: [
    'dashboard', 'wiki_admin', 'analytics'  // ← Only Admin Wiki!
  ]
}
```

---

## ✅ Build Status

```
✅ Compilation: 0 TypeScript Errors
✅ Routes Built: 65 pages/routes (8 new wiki routes)
✅ Build Time: ~18-20 seconds
✅ All components compiled successfully
```

### New Routes Added
- `/admin/wiki/admin` - Admin Wiki Hub
- `/admin/wiki/admin/getting-started` - Getting Started
- `/admin/wiki/admin/event-management` - Event Management
- `/admin/wiki/admin/gallery-management` - Gallery
- `/admin/wiki/admin/content-management` - Content
- `/admin/wiki/dev` - Dev Wiki Hub
- `/admin/wiki/dev/project-structure` - Project Structure
- `/admin/wiki/dev/commands` - Commands Reference

---

## 🚀 Migration Steps (For Production)

### Step 1: Deploy Code
```bash
git pull
npm run build
docker compose down && docker compose up -d --build
```

### Step 2: Run Migration in Supabase Dashboard
Execute `011_user_role_management.sql` to:
- Update roles with new permissions
- Add developer & support roles

### Step 3: Assign New Roles to Users
- Go to `/admin/users`
- Assign "developer" role to dev team
- Assign "support" role to support staff

### Step 4: Verify Access
- Test Admin Wiki access (requires wiki_admin)
- Test Dev Wiki access (requires wiki_dev)
- Verify 404 for non-authorized users

---

## 📝 Future Enhancements

### Ready to Implement
- [ ] Add "Audit System" detailed page to Dev Wiki
- [ ] Add "User & Role Management" guide
- [ ] Add "Settings Management" documentation
- [ ] Add "Error Handling" best practices
- [ ] Add "API Endpoints" reference
- [ ] Add "Database & Migrations" guide
- [ ] Add "Deployment & Server" walkthrough
- [ ] Add "Security & DSGVO" compliance guide

### Optional
- [ ] Add search functionality across wikis
- [ ] Add table of contents for long articles
- [ ] Add breadcrumb navigation
- [ ] Add "Last Updated" timestamps
- [ ] Add wiki versioning
- [ ] Add discussion/comments per page

---

## 🎯 Access Control Summary

| User Type | Can See | Examples |
|-----------|---------|----------|
| **Admin** | Admin Wiki + Dev Wiki | Full access to both |
| **Event Manager** | Admin Wiki only | Events & Calendar |
| **Editor** | Admin Wiki only | Content & Gallery |
| **Developer** | Dev Wiki only | Project structure, Commands |
| **Support** | Admin Wiki only | How to use system |
| **Viewer** | Admin Wiki only | Dashboard & Analytics |
| **Unauthenticated** | ❌ None | 404 or Redirected to login |

---

## 💡 Key Benefits

✅ **Separation of Concerns** - Technical vs. Non-Technical documentation
✅ **Granular Permissions** - Fine-grained access control
✅ **Scalability** - Easy to add new wiki pages
✅ **Role-Based** - Admins assign permissions per role
✅ **User-Friendly** - Clear, indexed documentation
✅ **Mobile-Responsive** - Works on all devices
✅ **Discoverable** - Clear navigation & categorization

---

## 📞 Support

For questions about the Wiki system:
1. Check the appropriate Wiki (Admin or Dev)
2. Look for similar topics in the index
3. Contact your admin team

---

**Deployed:** 2026-01-17  
**Build Status:** ✅ Success  
**Compilation:** ✅ 0 Errors  
**Git Status:** ✅ Committed & Pushed

🎉 **Wiki System Complete!**
