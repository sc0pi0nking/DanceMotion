'use client';

import Link from 'next/link';
import { ArrowLeft, Folder, FileText, Code } from 'lucide-react';

export default function ProjectStructurePage() {
  return (
    <div className="p-6 max-w-4xl mx-auto" style={{ backgroundColor: 'var(--bg)', color: 'var(--fg)' }}>
      <Link href="/admin/wiki/dev" className="flex items-center gap-2 text-blue-500 hover:text-blue-400 mb-6">
        <ArrowLeft size={20} />
        Zurück zum Dev Wiki
      </Link>

      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 rounded-lg bg-amber-500/10">
            <Folder size={32} className="text-amber-500" />
          </div>
          <h1 className="text-4xl font-bold">Projektstruktur</h1>
        </div>
        <p className="text-slate-400 text-lg">
          Übersicht über die Verzeichnisstruktur und Dateiorganisation
        </p>
      </div>

      <div className="space-y-8">
        {/* Root Structure */}
        <section className="p-6 rounded-lg border" style={{ backgroundColor: 'var(--panel)', borderColor: 'var(--border)' }}>
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <Folder size={24} className="text-orange-500" />
            Root-Verzeichnis Überblick
          </h2>
          <div className="p-4 bg-slate-900 rounded-lg font-mono text-sm text-slate-300 overflow-x-auto">
            <pre>{`DanceMotion/
├── app/                         # Next.js App Directory (alle Pages/APIs)
├── lib/                         # Utility Functions & Helpers
├── public/                      # Static Assets (Images, Icons)
├── supabase/                    # Database Config & Migrations
├── scripts/                     # Automation Scripts
├── components/ (in app/)        # React Components
├── package.json                 # Dependencies
├── next.config.ts              # Next.js Configuration
├── tailwind.config.ts          # Tailwind CSS Config
├── tsconfig.json               # TypeScript Config
└── docker/compose files        # Container Config`}</pre>
          </div>
        </section>

        {/* App Directory */}
        <section className="p-6 rounded-lg border" style={{ backgroundColor: 'var(--panel)', borderColor: 'var(--border)' }}>
          <h2 className="text-2xl font-bold mb-4">📂 app/ - Next.js App Directory</h2>
          <div className="space-y-4 text-slate-300">
            <div className="p-4 bg-slate-900 rounded-lg font-mono text-sm overflow-x-auto">
              <pre>{`app/
├── page.tsx                     # Homepage (/)
├── layout.tsx                   # Root Layout
├── globals.css                  # Global Styles
├── error.tsx                    # Error Boundary
├── not-found.tsx               # 404 Page
│
├── admin/                       # Admin Routes (Protected)
│   ├── layout.tsx              # Admin Layout + Sidebar
│   ├── page.tsx                # Admin Dashboard
│   ├── users/page.tsx          # User Management
│   ├── roles/page.tsx          # Role Management
│   ├── audit/page.tsx          # Audit Logs
│   ├── settings/page.tsx       # System Settings
│   ├── wiki/                   # Documentation
│   │   ├── admin/              # Admin Wiki (Non-tech)
│   │   └── dev/                # Dev Wiki (Technical)
│   ├── events/page.tsx         # Event Management
│   ├── gallery/page.tsx        # Gallery Management
│   ├── documents/page.tsx      # Document Management
│   ├── faqs/page.tsx           # FAQ Management
│   ├── team/page.tsx           # Team Management
│   └── content/page.tsx        # Content Editing
│
├── api/                        # API Routes (Next.js Route Handlers)
│   ├── admin/                  # Protected APIs
│   │   ├── users/              # User CRUD, Password Reset
│   │   ├── roles/              # Role CRUD
│   │   ├── audit/              # Audit Log Retrieval & Export
│   │   ├── analytics/          # Analytics Dashboard
│   │   ├── events/             # Event Management
│   │   ├── gallery/            # Gallery Management
│   │   ├── documents/          # Document Management
│   │   ├── faqs/               # FAQ Management
│   │   ├── team/               # Team Management
│   │   ├── content/            # Content Management
│   │   └── auth/               # Login, Logout, Session
│   │
│   ├── analytics/track         # Anonymous Analytics Tracking
│   ├── event-requests/         # Event Request Submissions
│   ├── documents/              # Public Document Access
│   ├── faqs/                   # Public FAQ Retrieval
│   ├── gallery/                # Public Gallery Retrieval
│   ├── team/                   # Public Team Data
│   └── social-links/           # Social Media Links
│
├── components/                 # Reusable React Components
│   ├── Header.tsx              # Top Navigation
│   ├── Footer.tsx              # Footer Component
│   ├── HeroScene.tsx           # Hero Section
│   ├── EventTimeline.tsx       # Event Display
│   ├── GalleryView.tsx         # Gallery Display
│   ├── ThemeToggle.tsx         # Dark/Light Mode
│   ├── CookieBanner.tsx        # DSGVO Cookie Consent
│   ├── AnalyticsTracker.tsx    # Analytics Component
│   ├── Button.tsx              # Button Components
│   └── [more components...]
│
├── public-pages/               # Public Website Pages
│   ├── galerie/page.tsx        # (/galerie)
│   ├── termine/page.tsx        # (/termine)
│   ├── team/page.tsx           # (/team)
│   ├── faq/page.tsx            # (/faq)
│   ├── formulare/page.tsx      # (/formulare - Docs)
│   ├── datenschutz/page.tsx    # (/datenschutz - Privacy)
│   ├── impressum/page.tsx      # (/impressum - Legal)
│   └── eventstudio/page.tsx    # (/eventstudio)
│
└── gruppen/                    # Group Pages
    ├── little-joys/
    ├── smileys/
    └── emotion/`}</pre>
            </div>
          </div>
        </section>

        {/* Lib Directory */}
        <section className="p-6 rounded-lg border" style={{ backgroundColor: 'var(--panel)', borderColor: 'var(--border)' }}>
          <h2 className="text-2xl font-bold mb-4">📚 lib/ - Utilities & Helpers</h2>
          <div className="space-y-3 text-slate-300">
            <div className="p-3 bg-slate-800 rounded">
              <strong>auth.ts</strong> - Authentication, Permissions, Permission Checking
            </div>
            <div className="p-3 bg-slate-800 rounded">
              <strong>audit-logger.ts</strong> - Audit Logging Helpers
            </div>
            <div className="p-3 bg-slate-800 rounded">
              <strong>supabase.ts</strong> - Supabase Client Instances
            </div>
            <div className="p-3 bg-slate-800 rounded">
              <strong>events.ts</strong> - Event-related Functions
            </div>
            <div className="p-3 bg-slate-800 rounded">
              <strong>content-db.ts</strong> - Content Database Operations
            </div>
            <div className="p-3 bg-slate-800 rounded">
              <strong>site-data.ts</strong> - Static Website Data
            </div>
            <div className="p-3 bg-slate-800 rounded">
              <strong>utils.ts</strong> - General Utilities
            </div>
          </div>
        </section>

        {/* Supabase Directory */}
        <section className="p-6 rounded-lg border" style={{ backgroundColor: 'var(--panel)', borderColor: 'var(--border)' }}>
          <h2 className="text-2xl font-bold mb-4">🗄️ supabase/ - Database</h2>
          <div className="p-4 bg-slate-900 rounded-lg font-mono text-sm text-slate-300 overflow-x-auto">
            <pre>{`supabase/
├── seed-content.sql            # Initial Database Seed
└── migrations/
    ├── 001_create_tables.sql           # Base Schema
    ├── 002_create_documents.sql        # Document System
    ├── 003_event_requests_and_roles.sql # Events & Roles
    ├── 004_dsgvo_auto_delete.sql       # 90-Day Auto-Delete
    ├── 005_create_test_users.sql       # Test Data
    ├── 006_faq_system.sql              # FAQ Tables
    ├── 007_team_system.sql             # Team Tables
    ├── 008_add_document_versioning.sql # Document Versions
    ├── 011_user_role_management.sql    # Permissions & Audit
    └── 012_analytics_system.sql        # Analytics Tables`}</pre>
          </div>
        </section>

        {/* File Naming Conventions */}
        <section className="p-6 rounded-lg border" style={{ backgroundColor: 'var(--panel)', borderColor: 'var(--border)' }}>
          <h2 className="text-2xl font-bold mb-4">📝 Naming Conventions</h2>
          <div className="space-y-2 text-slate-300">
            <div className="p-3 bg-slate-800 rounded">
              <strong>.tsx</strong> - React Components (Client or Server)
            </div>
            <div className="p-3 bg-slate-800 rounded">
              <strong>.ts</strong> - Pure TypeScript (No React)
            </div>
            <div className="p-3 bg-slate-800 rounded">
              <strong>page.tsx</strong> - Next.js Route (becomes a URL)
            </div>
            <div className="p-3 bg-slate-800 rounded">
              <strong>layout.tsx</strong> - Next.js Layout (wraps pages)
            </div>
            <div className="p-3 bg-slate-800 rounded">
              <strong>route.ts</strong> - API Route Handler (GET, POST, etc)
            </div>
            <div className="p-3 bg-slate-800 rounded">
              <strong>[id].tsx</strong> - Dynamic Route Parameter
            </div>
          </div>
        </section>

        {/* Routing Examples */}
        <section className="p-6 rounded-lg border" style={{ backgroundColor: 'var(--panel)', borderColor: 'var(--border)' }}>
          <h2 className="text-2xl font-bold mb-4">🗺️ URL Routing Examples</h2>
          <div className="space-y-2 text-slate-300 text-sm">
            <div className="p-2 bg-slate-800 rounded">
              <strong>app/page.tsx</strong> → <code>GET /</code>
            </div>
            <div className="p-2 bg-slate-800 rounded">
              <strong>app/galerie/page.tsx</strong> → <code>GET /galerie</code>
            </div>
            <div className="p-2 bg-slate-800 rounded">
              <strong>app/admin/page.tsx</strong> → <code>GET /admin</code> (Protected)
            </div>
            <div className="p-2 bg-slate-800 rounded">
              <strong>app/admin/users/page.tsx</strong> → <code>GET /admin/users</code>
            </div>
            <div className="p-2 bg-slate-800 rounded">
              <strong>app/api/admin/users/route.ts</strong> → <code>GET/POST /api/admin/users</code>
            </div>
            <div className="p-2 bg-slate-800 rounded">
              <strong>app/api/admin/users/[id]/route.ts</strong> → <code>GET/PUT/DELETE /api/admin/users/123</code>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
