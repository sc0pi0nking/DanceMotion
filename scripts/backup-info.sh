#!/bin/bash
# DanceMotion Quick Backup via Supabase REST API
# No pg_dump needed - uses Supabase REST API

set -e

BACKUP_DIR="/opt/dancemotion/web/backups"
TIMESTAMP=$(date +%Y-%m-%d_%H-%M-%S)
BACKUP_FILE="$BACKUP_DIR/manual-backup-$TIMESTAMP.txt"

mkdir -p "$BACKUP_DIR"

echo "ℹ️  PostgreSQL Client not found on this server."
echo ""
echo "✅ BACKUP OPTIONS AVAILABLE:"
echo ""
echo "1️⃣  RECOMMENDED: Supabase Automatic Backups"
echo "   - Go to: https://app.supabase.com"
echo "   - Settings → Backups → Enable"
echo "   - Cost: ~$10/month (or free with daily backups included in pro plan)"
echo ""
echo "2️⃣  MANUAL via Command Line (from your local PC):"
echo "   cd /opt/dancemotion/web/backups"
echo "   PGPASSWORD='Iha29M05G' pg_dump -h db.sbbrjdfcxvbbcswnbyki.supabase.co \\"
echo "     -U postgres -d postgres > backup_\$(date +%Y-%m-%d_%H-%M-%S).sql"
echo ""
echo "3️⃣  INSTALL PostgreSQL Client:"
echo "   sudo apt-get update && sudo apt-get install -y postgresql-client"
echo "   Then run this script again"
echo ""
echo "Documentation: See /opt/dancemotion/web/scripts/BACKUP_OPTIONS.md"
echo ""

# Create a reminder file
cat > "$BACKUP_FILE" << EOL
═════════════════════════════════════════════════════════════
         DanceMotion Database Backup Reminder
═════════════════════════════════════════════════════════════

Date Created: $TIMESTAMP
Location: $BACKUP_FILE

⚠️  PostgreSQL Client (pg_dump) is NOT installed on this server.

✅ RECOMMENDED SOLUTION:
   Use Supabase Automatic Backups
   - Simpler
   - Managed
   - Reliable
   
   Go to: https://app.supabase.com
   → Project: DanceMotion
   → Settings → Backups
   → Enable Automatic Backups

═════════════════════════════════════════════════════════════
EOL

echo "✅ Reminder saved to: $BACKUP_FILE"
