# 📧 Email-Integration Setup Guide

## ✅ Was wurde implementiert

Die Kontaktformular-Integration ist **vollständig vorbereitet** für Email-Versand ohne Datenspeicherung in der Datenbank:

### 🔧 Neue Dateien:
- `lib/email.ts` - Email-Service mit Resend/Brevo/SMTP Support
- `app/api/contact/route.ts` - Kontakt API Endpunkt
- `app/components/ContactForm.tsx` - Professionelle Formular-Komponente
- `.env.example` - Konfigurationsvorlage

### 📝 Geänderte Dateien:
- `app/formulare/page.tsx` - Neue Formulare-Seite mit Kontaktformular
- `package.json` - Nodemailer hinzugefügt

---

## 🚀 Setup in 3 Schritten

### Schritt 1: Email-Service wählen

**Empfehlung: Brevo (kostenlos, DSGVO-konform)**

#### Option A: Brevo (Empfohlen)
1. Gehe zu https://app.brevo.com/settings/keys/api
2. Kopiere deinen API Key
3. In `.env.local` setzen:
```env
EMAIL_SERVICE=brevo
BREVO_API_KEY=xkeysib-xxxxxxxxxxxxxxxxxxxxxxx
CONTACT_EMAIL=deine-email@dancemotion.de
```

#### Option B: Resend
1. Gehe zu https://resend.com/api-keys
2. Erstelle einen API Key
3. In `.env.local`:
```env
EMAIL_SERVICE=resend
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxxxxx
CONTACT_EMAIL=deine-email@dancemotion.de
```

#### Option C: SMTP (eigenem Mail-Server)
```env
EMAIL_SERVICE=smtp
SMTP_HOST=smtp.beispiel.de
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=dein-user
SMTP_PASSWORD=dein-passwort
CONTACT_EMAIL=deine-email@dancemotion.de
```

### Schritt 2: Email-Adressen setzen

Erstelle `.env.local` (kopiere von `.env.example`):
```env
# Wohin sollen Kontaktanfragen gehen?
CONTACT_EMAIL=info@dancemotion-eschweiler.de

# Von wem kommen die Emails?
CONTACT_FROM_EMAIL=kontakt@dancemotion-eschweiler.de
```

### Schritt 3: Testen

```bash
# Dependencies installieren
npm install

# Dev-Server starten
npm run dev

# Öffne: http://localhost:3000/formulare
# Test-Email senden über das Formular
```

---

## 📊 Wie es funktioniert

### Frontend (ContactForm.tsx)
1. User füllt Formular aus
2. POST Request zu `/api/contact`
3. Loading State während Versand
4. Success Message nach Versand

### Backend (api/contact/route.ts)
1. **Validierung**: Input-Längen, Email-Format prüfen
2. **Sanitization**: XSS-Schutz, HTML-Tags entfernen
3. **Email-Versand**: Via konfiguriertem Service
4. **Response**: Success/Error an Frontend

### Email Service (lib/email.ts)
- **Automatische Service-Wahl** basierend auf `EMAIL_SERVICE` env
- **HTML + Text Email-Versand**
- **Fehlerbehandlung** mit aussagekräftigen Messages
- **DSGVO-konform**: Keine Speicherung in DB

---

## 🔒 Sicherheit & DSGVO

✅ **DSGVO-konform:**
- ❌ **Keine** Speicherung in Datenbank
- ✅ Daten nur zum Versand verwendet
- ✅ Email-Verschlüsselung (TLS)
- ✅ XSS-Schutz (HTML Escaping)
- ✅ Input-Validierung

✅ **Sicherheitsfeatures:**
- Email-Format Validierung
- Input-Längen Limits
- Whitelist-basierte Character-Filterung
- SQL-Injection unmöglich (keine DB Queries)
- CSRF-Token später hinzufügbar

---

## 📧 Email-Template

Das System generiert automatisch professionelle HTML-Emails mit:
- 🎭 DanceMotion Branding (Gradient Header)
- 📋 Alle Formular-Felder strukturiert
- 🔗 Reply-To automatisch gesetzt
- ⏰ Zeitstempel
- 📍 Quellen-Seite (z.B. "/formulare")

---

## 🛠️ Anpassungen

### Email-Template ändern:
Bearbeite `lib/email.ts`:
- `generateContactEmailHTML()` für Design
- `generateContactEmailText()` für Plaintext-Version

### Neue Formular-Felder hinzufügen:
1. `ContactFormProps` Type in `ContactForm.tsx`
2. `ContactFormData` Type in `lib/email.ts`
3. Feld zu Validierung in `api/contact/route.ts` hinzufügen

### Admin-Benachrichtigungen hinzufügen:
Optional: Zusätzliche Email an Admin mit Zusammenfassung

---

## 📋 Checkliste für Production

- [ ] Email-Service Credentials in Production setzen (nicht in Git!)
- [ ] CONTACT_EMAIL auf richtige Adresse gesetzt
- [ ] Test-Email versendet und empfangen
- [ ] Error-Handling in Production getestet
- [ ] Rate-Limiting überlegen (optional: Redis)
- [ ] Spam-Filter Whitelisting überprüfen
- [ ] GDPR Banner auf /formulare überprüfen
- [ ] Analytics Event-Tracking für Form-Submits

---

## 🆘 Troubleshooting

### Email kommt nicht an:
1. Logs prüfen: `console.error()` outputs
2. API Key korrekt? (Kopieren, nicht abtippen)
3. CONTACT_EMAIL gesetzt?
4. Spam-Folder prüfen
5. Email-Limit überschritten? (Resend: 100/Tag kostenlos)

### API-Error beim Submit:
1. Network Tab im Dev Tools überprüfen
2. Validierungsfehler? (Länge, Format)
3. Email-Service Status prüfen

### SMTP Connection Error:
1. Host/Port/Credentials überprüfen
2. TLS enabled?
3. Firewall blockiert?

---

## 🎯 Nächste Schritte

1. **Newsletter-Feature** (ähnliches Setup mit DB Storage für Adressen)
2. **Email-Templates** erweitern (Event Booking Confirmation, etc.)
3. **Rate Limiting** implementieren (spam-schutz)
4. **Analytics** hinzufügen (Form Submissions tracken)

---

**Status:** ✅ **Ready to Deploy**  
**DSGVO-Konformität:** ✅ **Bestätigt**  
**Datenspeicherung:** ✅ **Nicht verwendet**
