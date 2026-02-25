# 🚨 SECURITY AUDIT: RLS Policies

**Datum:** 2026-02-25  
**Agent:** Security/Threat Modeler  
**Kritikalität:** HOCH bis KRITISCH

---

## 🔴 KRITISCHE FINDINGS

### 1. `admin_users` - **KRITISCH** 
| Policy | Problem |
|--------|---------|
| `USING (true)` | **Jeder kann Passwort-Hashes und Admin-Credentials lesen!** |
| `WITH CHECK (true)` | Jeder kann neue Admins erstellen |

**Risiko:** Vollständige Kompromittierung des Admin-Systems. Angreifer können:
- Passwort-Hashes extrahieren und offline cracken
- Neue Admin-Accounts erstellen
- Bestehende Admins deaktivieren

---

### 2. `event_requests` - **KRITISCH (DSGVO!)** 
| Policy | Problem |
|--------|---------|
| `USING (true)` für SELECT | **Alle persönlichen Daten (PII) öffentlich lesbar!** |

**Enthält PII:**
- Name, Email, Telefonnummer
- Event-Details, Nachrichten

**Risiko:** DSGVO-Verstoß, Bußgelder bis zu 4% des Jahresumsatzes

---

### 3. `admin_roles` - **KRITISCH**
| Policy | Problem |
|--------|---------|
| `FOR ALL USING (true)` | Jeder kann Rollen und Permissions ändern |

---

### 4. `admin_audit_log` - **HOCH**
| Policy | Problem |
|--------|---------|
| `USING (true)` | Audit-Logs für alle lesbar (Sicherheits-Info-Leak) |

---

### 5. `documents` - **HOCH**
| Policy | Problem |
|--------|---------|
| `WITH CHECK (true)` für INSERT/UPDATE/DELETE | Jeder kann Dokumente manipulieren |

---

### 6. `team_members` - **HOCH**
| Policy | Problem |
|--------|---------|
| `USING (true)` | Jeder kann Team-Daten ändern/löschen |

---

### 7. `events` - **HOCH**
| Policy | Problem |
|--------|---------|
| `WITH CHECK (true)` | Jeder kann Events erstellen/ändern/löschen |

---

### 8. `content` - **HOCH**
| Policy | Problem |
|--------|---------|
| `WITH CHECK (true)` | Website-Defacement möglich |

---

### 9. `gallery` - **MITTEL**
| Policy | Problem |
|--------|---------|
| `WITH CHECK (true)` | Jeder kann Galerie-Inhalte ändern |

---

### 10. `faqs` - **MITTEL**
| Policy | Problem |
|--------|---------|
| `FOR ALL USING (true)` | Jeder kann FAQs ändern |

---

### 11. `analytics_*` - **MITTEL**
| Policy | Problem |
|--------|---------|
| `USING (true)` | Analytics-Daten für alle lesbar |

---

### 12. `tickets` - **NIEDRIG**
| Policy | Problem |
|--------|---------|
| `auth.jwt() ->> 'role' = 'authenticated'` | Zu permissiv, jeder Auth-User kann lesen |

---

### 13. `sponsors` - **NIEDRIG**
| Policy | Problem |
|--------|---------|
| `TO authenticated` | Jeder Auth-User kann Sponsoren ändern |

---

### 14. `forms` / `form_submissions` - **HOCH (PII!)**
| Policy | Problem |
|--------|---------|
| `WITH CHECK (true)` | Forms können manipuliert werden |

---

## ✅ SQL-FIXES

Die vollständigen SQL-Fixes wurden erstellt in:

```
supabase/migrations/026_security_rls_hardening.sql
```

### Zusammenfassung der Änderungen:

| Tabelle | Vorher | Nachher |
|---------|--------|---------|
| `admin_users` | `USING (true)` | `TO service_role` |
| `event_requests` | `USING (true)` | INSERT: `anon,authenticated`, Rest: `service_role` |
| `admin_roles` | `USING (true)` | `TO service_role` |
| `admin_audit_log` | `USING (true)` | `TO service_role` |
| `documents` | `USING (true)` | SELECT aktiv: `anon`, Rest: `service_role` |
| `team_members` | `USING (true)` | SELECT published: `anon`, Rest: `service_role` |
| `events` | `USING (true)` | SELECT published: `anon`, Rest: `service_role` |
| `content` | `USING (true)` | SELECT: `anon`, Rest: `service_role` |
| `gallery` | `USING (true)` | SELECT published: `anon`, Rest: `service_role` |
| `faqs` | `USING (true)` | SELECT published: `anon`, Rest: `service_role` |
| `analytics_*` | `USING (true)` | INSERT: `anon`, SELECT: `service_role` |
| `tickets` | `authenticated` | INSERT: `anon`, Rest: `service_role` |
| `sponsors` | `authenticated` | SELECT aktiv: `anon`, Rest: `service_role` |
| `forms` | `USING (true)` | SELECT aktiv: `anon`, Rest: `service_role` |
| `form_submissions` | `USING (true)` | INSERT: `anon`, Rest: `service_role` |

---

## 📋 EMPFEHLUNGEN

### Sofortige Maßnahmen:

1. **Migration ausführen:**
   ```bash
   # In Supabase Dashboard → SQL Editor:
   # Inhalt von 026_security_rls_hardening.sql ausführen
   ```

2. **Backend prüfen:**
   - Alle Admin-API-Routes müssen `supabaseAdmin` (service_role) verwenden
   - NIEMALS `supabase` (anon_key) für Admin-Operationen

3. **Environment Variables:**
   ```
   SUPABASE_SERVICE_ROLE_KEY=... # Nur auf dem Server!
   NEXT_PUBLIC_SUPABASE_ANON_KEY=... # OK für Client
   ```

### Wichtig für das Backend:

Das Backend (`lib/supabase.ts`) muss zwei Clients haben:

```typescript
// Öffentlicher Client (anon_key) - für Frontend
export const supabase = createClient(...)

// Admin Client (service_role) - NUR SERVER-SIDE!
export const supabaseAdmin = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)
```

### API-Routes anpassen:

Alle Admin-Routes in `app/api/admin/*` müssen:
- `supabaseAdmin` verwenden
- Session-Token validieren
- NIEMALS den anon-Client verwenden

---

## ⚠️ WARNUNG

Nach dem Ausführen der Migration:

1. **Frontend-Änderungen nicht notwendig** - Public reads funktionieren weiterhin
2. **Admin-Panel testen** - Alle CRUD-Operationen
3. **API-Routes prüfen** - Müssen `service_role` Client verwenden

---

## 🔒 Sicherheitsprinzip

**Principle of Least Privilege:**
- Öffentlich: Nur SELECT auf veröffentlichte Inhalte
- INSERT für Anfragen (event_requests, tickets, form_submissions, analytics)
- Alle anderen Operationen: Nur über authentifiziertes Backend mit `service_role`
