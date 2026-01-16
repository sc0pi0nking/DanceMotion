# 📧 Email-Integration - SMTP Setup Guide

## ✅ Was wurde implementiert

Das Kontaktformular versendet Emails **direkt über SMTP** - keine externen Services nötig!

- ✅ Kontaktformular API (`/api/contact`)
- ✅ Email-Komponente (Formular, Validierung, Loading States)
- ✅ SMTP via Nodemailer
- ✅ DSGVO: Keine Datenbank-Speicherung

---

## 🚀 Setup - 3 Schritte

### 1️⃣ SMTP-Daten von deinem Provider

Frag deinen Mail-Hoster nach:
- **SMTP Host** (z.B. `mail.dancemotion.org`)
- **SMTP Port** (meist `587` oder `465`)
- **Username** (z.B. `Impressum@dancemotion.org`)
- **Passwort**

**Standard-Werte:**
- Port 587 → `SMTP_SECURE=false`
- Port 465 → `SMTP_SECURE=true`

### 2️⃣ `.env.local` erstellen

```env
# SMTP Konfiguration
SMTP_HOST=mail.dancemotion.org
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=Impressum@dancemotion.org
SMTP_PASSWORD=dein_passwort

# Email-Adressen
CONTACT_FROM_EMAIL=Impressum@dancemotion.org
CONTACT_EMAIL=Impressum@dancemotion.org

# Supabase (von .env.example kopieren)
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
```

### 3️⃣ Testen

```bash
npm install
npm run dev
# http://localhost:3000/formulare
# Formular ausfüllen → Email sollte ankommen!
```

---

## 📧 So funktioniert's

```
User füllt Formular aus
        ↓
/api/contact wird aufgerufen
        ↓
Validierung + Sanitization
        ↓
Email via SMTP versendet
        ↓
Success Message im Browser
        ↓
✅ Fertig - keine DB-Speicherung!
```

---

## ⚙️ Email-Template anpassen

Bearbeite `lib/email.ts`:
- `generateContactEmailHTML()` - Aussehen der Email
- `generateContactEmailText()` - Plain-Text Version

---

## 🔒 Sicherheit

- ✅ Input-Validierung (Länge, Format)
- ✅ XSS-Schutz (HTML Escaping)
- ✅ TLS Encryption für Emails
- ✅ Keine Speicherung in DB

---

## 🆘 Probleme?

**Email kommt nicht an:**
- SMTP_HOST und Passwort nochmal überprüfen
- SMTP_PORT korrekt? (587 meist ok)
- Firewall blockiert?
- Browser Console für Fehler checken

**Validation Error:**
- Name/Email/Nachricht ausfüllen?
- Input nicht zu lang? (Max: Name 100, Email 255, Nachricht 5000 Zeichen)

---

**Status:** ✅ Ready to Go!
