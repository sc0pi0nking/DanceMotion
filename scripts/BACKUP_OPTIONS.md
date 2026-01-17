# 📦 DanceMotion Backup Lösungen

## Option 1: Automatische Backups via Supabase (EMPFOHLEN)

**Das ist am einfachsten!**

1. Öffne: https://app.supabase.com
2. Gehe zu: **Settings → Backups**
3. Aktiviere: **Database Backups**
4. Wähle: Daily oder Weekly
5. Kostenfrei: Ja (bei Pro Plan ~$10/Monat)

Dann werden automatisch täglich/wöchentlich Backups gemacht.

---

## Option 2: Manuelle Shell-Befehle (einfach)

### Voraussetzungen:
- PostgreSQL Client installiert: `apt-get install postgresql-client`

### Backup erstellen:
```bash
cd /opt/dancemotion/web/backups

# Backup mit Timestamp
PGPASSWORD='Iha29M05G' pg_dump -h db.sbbrjdfcxvbbcswnbyki.supabase.co \
  -U postgres \
  -d postgres \
  > backup_$(date +%Y-%m-%d_%H-%M-%S).sql

# Ergebnis überprüfen
ls -lh backup_*.sql
```

### Restore durchführen:
```bash
# Neuestes Backup finden
LATEST=$(ls -t backup_*.sql | head -1)

# Restore (⚠️ Überschreibt komplette DB!)
PGPASSWORD='Iha29M05G' psql -h db.sbbrjdfcxvbbcswnbyki.supabase.co \
  -U postgres \
  -d postgres \
  < "$LATEST"
```

---

## Option 3: Cronjob für automatische Backups

```bash
# SSH zum Server
ssh dev@192.168.178.116

# Crontab öffnen
crontab -e

# Diese Zeile hinzufügen (jeden Tag um 2 Uhr):
0 2 * * * cd /opt/dancemotion/web/backups && PGPASSWORD='Iha29M05G' pg_dump -h db.sbbrjdfcxvbbcswnbyki.supabase.co -U postgres -d postgres > backup_$(date +\%Y-\%m-\%d_\%H-\%M-\%S).sql 2>> backup.log

# Alte Backups nach 30 Tagen löschen:
0 3 * * * find /opt/dancemotion/web/backups -name 'backup_*.sql' -mtime +30 -delete
```

---

## Option 4: Docker-basierte Backups (über SSH)

```bash
# Lokal von deinem PC:
ssh dev@192.168.178.116 << 'EOF'
cd /opt/dancemotion/web/backups

# Backup mit Docker
docker run --rm \
  --network host \
  -e PGPASSWORD='Iha29M05G' \
  postgres:15-alpine \
  pg_dump -h db.sbbrjdfcxvbbcswnbyki.supabase.co \
    -U postgres -d postgres -w \
  > backup_$(date +%Y-%m-%d_%H-%M-%S).sql

ls -lh backup_*.sql
EOF
```

---

## 🎯 EMPFEHLUNG

### Für Production (BEST):
**Option 1** = Supabase Automatic Backups
- ✅ Einfach
- ✅ Zuverlässig
- ✅ Managed
- ✅ ~$10/Monat

### Für zusätzliche Redundanz:
**Option 2 oder 3** = Manuelle/Cronjob Backups
- ✅ Kostenlos
- ✅ Volle Kontrolle
- ✅ Auf eigenem Server gespeichert

### Kombiniert (SICHERSTE):
**Option 1 + Option 3**
- Supabase macht automatische Backups
- Server macht zusätzliche tägliche lokale Backups
- Maximale Redundanz & Sicherheit

---

## 📋 Backup-Verzeichnis überprüfen

```bash
ssh dev@192.168.178.116 "ls -lh /opt/dancemotion/web/backups/"
```

## 💾 Backup herunterladen

```bash
# Lokal auf deinen PC
scp dev@192.168.178.116:/opt/dancemotion/web/backups/backup_*.sql .
```

## ⚙️ Cronjob-Status überprüfen

```bash
ssh dev@192.168.178.116 "crontab -l"
```

---

**Status:** ✅ Alle Optionen verfügbar!
