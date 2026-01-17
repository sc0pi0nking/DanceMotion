#!/bin/bash
# DanceMotion Database Restore Script
# Usage: ./restore-latest.sh
# Restores the most recent backup - WITH SAFETY CONFIRMATION

set -e

# ============================================
# Configuration
# ============================================
BACKUP_DIR="/opt/dancemotion/backups"
DB_HOST="db.sbbrjdfcxvbbcswnbyki.supabase.co"
DB_PORT="5432"
DB_USER="postgres"
DB_NAME="postgres"
DB_PASSWORD="Iha29M05G"

# ============================================
# Find latest backup
# ============================================
LATEST_BACKUP=$(ls -t "$BACKUP_DIR"/backup_*.sql 2>/dev/null | head -1)

if [ -z "$LATEST_BACKUP" ]; then
  echo "❌ No backup found in $BACKUP_DIR"
  exit 1
fi

FILE_SIZE=$(du -h "$LATEST_BACKUP" | cut -f1)
FILE_DATE=$(ls -l "$LATEST_BACKUP" | awk '{print $6, $7, $8}')

echo ""
echo "🔄 Restore from Latest Backup"
echo "════════════════════════════════════════"
echo "   Backup file: $LATEST_BACKUP"
echo "   Size: $FILE_SIZE"
echo "   Date: $FILE_DATE"
echo "   Target: $DB_HOST"
echo ""
echo "⚠️  WARNING: This will OVERWRITE your entire database!"
echo "   All current data will be replaced with the backup."
echo ""
read -p "Type 'yes' to continue: " confirm

if [ "$confirm" != "yes" ]; then
  echo "❌ Restore cancelled."
  exit 0
fi

echo ""
echo "🔄 Restoring database..."

export PGPASSWORD=$DB_PASSWORD

if psql -h $DB_HOST \
  -p $DB_PORT \
  -U $DB_USER \
  -d $DB_NAME \
  --no-password \
  < "$LATEST_BACKUP"; then
  
  echo ""
  echo "✅ Restore successful!"
  echo "   Database has been restored to: $(basename $LATEST_BACKUP)"
  echo ""
  
else
  echo ""
  echo "❌ Restore FAILED!"
  exit 1
fi
