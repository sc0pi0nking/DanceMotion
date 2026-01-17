# DanceMotion Backup Scripts

Automatische Backup- und Restore-Scripts für die Supabase PostgreSQL Datenbank.

## 📁 Dateien

- `backup.sh` — Erstellt tägliche Backups
- `restore-latest.sh` — Restored das neueste Backup
- `README.md` — Diese Datei

---

## 🚀 Setup auf dem Server

### 1. Scripts auf Server kopieren

```bash
# Lokal (auf deinem PC)
scp scripts/backup.sh dev@192.168.178.116:/opt/dancemotion/backups/
scp scripts/restore-latest.sh dev@192.168.178.116:/opt/dancemotion/backups/
```

### 2. Executable machen

```bash
ssh dev@192.168.178.116 "chmod +x /opt/dancemotion/backups/*.sh"
```

### 3. (Optional) Testen

```bash
ssh dev@192.168.178.116 "/opt/dancemotion/backups/backup.sh"
```

---

## 📦 Backup erstellen

**Lokal (von deinem PC):**
```bash
ssh dev@192.168.178.116 "/opt/dancemotion/backups/backup.sh"
```

**Output:**
```
📦 Starting backup...
   Host: db.sbbrjdfcxvbbcswnbyki.supabase.co
   Database: postgres
   File: /opt/dancemotion/backups/backup_2026-01-17_14-30-45.sql

✅ Backup successful!
   File size: 2.5M
   Location: /opt/dancemotion/backups/backup_2026-01-17_14-30-45.sql

📋 Recent backups:
   /opt/dancemotion/backups/backup_2026-01-17_14-30-45.sql (2.5M)
   /opt/dancemotion/backups/backup_2026-01-16_23-15-20.sql (2.4M)
   /opt/dancemotion/backups/backup_2026-01-15_18-00-10.sql (2.3M)
```

---

## 🔄 Restore durchführen

**Lokal (von deinem PC):**
```bash
ssh dev@192.168.178.116 "/opt/dancemotion/backups/restore-latest.sh"
```

**Interactive Confirmation:**
```
🔄 Restore from Latest Backup
════════════════════════════════════════
   Backup file: /opt/dancemotion/backups/backup_2026-01-17_14-30-45.sql
   Size: 2.5M
   Date: Jan 17 14:30
   Target: db.sbbrjdfcxvbbcswnbyki.supabase.co

⚠️  WARNING: This will OVERWRITE your entire database!
   All current data will be replaced with the backup.

Type 'yes' to continue: yes

🔄 Restoring database...
✅ Restore successful!
   Database has been restored to: backup_2026-01-17_14-30-45.sql
```

---

## ⏰ Automatische tägliche Backups (Cronjob)

Füge einen Cronjob hinzu, damit jeden Tag um 2 Uhr ein Backup erstellt wird:

```bash
# SSH zum Server
ssh dev@192.168.178.116

# Cronjob öffnen
crontab -e

# Diese Zeile hinzufügen:
0 2 * * * /opt/dancemotion/backups/backup.sh >> /opt/dancemotion/backups/cron.log 2>&1
```

Dann wird jeden Tag um 02:00 Uhr automatisch ein Backup erstellt und in `cron.log` geloggt.

---

## 📊 Backup-Verwaltung

**Alle Backups anschauen:**
```bash
ssh dev@192.168.178.116 "ls -lh /opt/dancemotion/backups/"
```

**Letztes Backup herunterladen:**
```bash
# Lokal
scp dev@192.168.178.116:/opt/dancemotion/backups/backup_*.sql .
```

**Ein bestimmtes Backup restore-fähig machen:**
```bash
ssh dev@192.168.178.116 "cp /opt/dancemotion/backups/backup_2026-01-15_18-00-10.sql /opt/dancemotion/backups/backup_latest.sql"
```

---

## ⚙️ Credentials

Die Scripts enthalten die Supabase Credentials:
- **Host:** db.sbbrjdfcxvbbcswnbyki.supabase.co
- **User:** postgres
- **Database:** postgres
- **Password:** (verschlüsselt in den Scripts)

⚠️ **Security Note:** Die Scripts auf dem Server speichern das Password. Das ist OK, weil nur autorisierte Personen auf den Server Zugriff haben. Falls sensibel: verwende `.pgpass` statt plaintext Password.

---

## 🐛 Troubleshooting

### "Permission denied"
→ Scripts nicht executable: `chmod +x backup.sh restore-latest.sh`

### "Connection refused"
→ Host/Password falsch oder Supabase nicht erreichbar

### "pg_dump: command not found"
→ PostgreSQL Client ist nicht auf dem Server installiert
```bash
sudo apt-get install postgresql-client
```

### Backup ist zu groß
→ Alte Backups werden automatisch nach 30 Tagen gelöscht

---

## 📝 Backup-Retention Policy

- **Daily Backups:** Automatisch erstellt um 02:00 Uhr
- **Retention:** 30 Tage (alte Backups werden gelöscht)
- **Manual Backups:** Können jederzeit mit `backup.sh` erstellt werden

---

**Weitere Infos:** Siehe [PRE_PUBLIC_LAUNCH_ANALYSIS.md](../PRE_PUBLIC_LAUNCH_ANALYSIS.md)
