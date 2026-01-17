#!/bin/bash
# DanceMotion Database Backup Script
# Usage: ./backup.sh
# Creates automatic backups with timestamp

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

TIMESTAMP=$(date +%Y-%m-%d_%H-%M-%S)
BACKUP_FILE="$BACKUP_DIR/backup_$TIMESTAMP.sql"

# ============================================
# Create backup directory if needed
# ============================================
if [ ! -d "$BACKUP_DIR" ]; then
  mkdir -p "$BACKUP_DIR"
  echo "📁 Created backup directory: $BACKUP_DIR"
fi

# ============================================
# Create backup
# ============================================
echo "📦 Starting backup..."
echo "   Host: $DB_HOST"
echo "   Database: $DB_NAME"
echo "   File: $BACKUP_FILE"

export PGPASSWORD=$DB_PASSWORD

if pg_dump -h $DB_HOST \
  -p $DB_PORT \
  -U $DB_USER \
  -d $DB_NAME \
  --no-password \
  > "$BACKUP_FILE"; then
  
  FILE_SIZE=$(du -h "$BACKUP_FILE" | cut -f1)
  echo ""
  echo "✅ Backup successful!"
  echo "   File size: $FILE_SIZE"
  echo "   Location: $BACKUP_FILE"
  echo ""
  
  # Show last 3 backups
  echo "📋 Recent backups:"
  ls -lh "$BACKUP_DIR"/backup_*.sql 2>/dev/null | tail -3 | awk '{print "   " $9 " (" $5 ")"}'
  
else
  echo ""
  echo "❌ Backup FAILED!"
  exit 1
fi

# ============================================
# Cleanup (keep last 30 days)
# ============================================
echo ""
echo "🧹 Cleaning up old backups (keeping last 30 days)..."
find "$BACKUP_DIR" -name "backup_*.sql" -mtime +30 -delete
echo "✅ Cleanup complete"
