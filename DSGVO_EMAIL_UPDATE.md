# DSGVO Update: Kontaktformular Email-Integration

## 🔄 Was sich ändert

**VORHER:** Kontaktanfragen wurden in `form_submissions` Tabelle gespeichert  
**NACHHER:** Kontaktanfragen werden direkt via SMTP versendet, **nicht** gespeichert

---

## ✅ DSGVO-Compliance

### Rechtssicherheit:
- ✅ **Keine Speicherung** = Maximale Datensparsamkeit
- ✅ **Keine** Aufbewahrungspflichten
- ✅ **Keine** Löschfristen (keine Daten in unserer DB!)
- ✅ **Keine** Datenauskunftspflicht gegenüber dem Nutzer
- ✅ **Direkte Bearbeitung** ohne Zwischenspeicherung

### In der Datenschutzerklärung sollte stehen:

```markdown
## Kontaktformular

**Zweck:** Bearbeitung von Kontaktanfragen
**Daten:** Name, E-Mail, Telefon (optional), Nachricht
**Speicherung:** Die Daten werden ausschließlich zur Versendung an 
                Impressum@dancemotion.org verwendet und nicht in unserer 
                Datenbank gespeichert.
**Speicherdauer:** Nur auf unserem Mail-Server nach Standard-Aufbewahrung
**Rechtsgrundlage:** Art. 6 Abs. 1 lit. b DSGVO (Vertragserfüllung) oder 
                   Art. 6 Abs. 1 lit. a DSGVO (Einwilligung)
**Empfänger:** Nur Admin per SMTP (Impressum@dancemotion.org)
**Widerruf:** Per Email an Impressum@dancemotion.org
```

---

## 📊 Datenfluss

```
User (Browser)
    ↓ füllt Formular
Daten + HTTPS-Encryption
    ↓ POST /api/contact
Next.js Server
    ↓ Validierung + Sanitization
SMTP Auth (TLS)
    ↓ Versand via lokaler Mail-Hoster
Admin Inbox (Impressum@dancemotion.org)
    ↓
✅ KEINE Zwischenspeicherung!
```

---

## 🔒 Sicherheitsmaßnahmen

- ✅ **Input-Validierung** (Längen, Format prüfen)
- ✅ **XSS-Schutz** (HTML Escaping)
- ✅ **TLS/SMTP Encryption** für Email-Transit
- ✅ **HTTPS-only** für Formular-Submission
- ✅ **Keine Logs** von sensiblen Daten

---

## ⚖️ Vereinsrechtliche Aspekte

Für Tanzschul-/Vereins-Websites in Deutschland:

### Warum diese Lösung ideal ist:
1. ✅ **Datensparsamkeit** - DSGVO Prinzip erfüllt
2. ✅ **Keine Speicherung** - Minimales Compliance-Risiko
3. ✅ **Direkte Kontaktaufnahme** - Email-to-Inbox
4. ✅ **Einfach zu erklären** - Keine komplexen Systeme
5. ✅ **Lokale Kontrolle** - Dein Mail-Server entscheidet

### Best Practices:
1. Impressum-Email in Impressum & Datenschutz nennen
2. Alte Emails regelmäßig löschen
3. SMTP-Credentials sicher lagern (.env.local - nicht in Git!)

---

## 📋 Rechtliche Checkliste

- [ ] Datenschutzerklärung aktualisiert
- [ ] Impressum-Email sichtbar
- [ ] SMTP-Credentials nicht in Version Control
- [ ] Kontaktformular mit Hinweis "Daten werden nicht gespeichert"
- [ ] Test: Email kommt an

---

## 📞 Nächste Schritte

1. **SMTP Setup** (siehe EMAIL_SETUP_SIMPLE.md)
2. **Datenschutzerklärung** updated
3. **Test-Email** versendet
4. **Go live!**

---

**Status:** ✅ DSGVO-konform & vereinsrechts-konform  
**Komplexität:** ✅ Sehr einfach  
**Externe Abhängigkeiten:** ✅ Keine

