#!/bin/bash
# DanceMotion Database Backup Script (Docker version)
# Usage: ./backup-docker.sh
# Creates automatic backups using Docker container

set -e

# ============================================
# Configuration
# ============================================
BACKUP_DIR="/opt/dancemotion/web/backups"
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
# Create backup using Docker
# ============================================
echo "📦 Starting backup (using Docker)..."
echo "   Host: $DB_HOST"
echo "   Database: $DB_NAME"
echo "   File: $BACKUP_FILE"

if docker run --rm \
  -e PGPASSWORD=$DB_PASSWORD \
  postgres:15-alpine \
  pg_dump -h $DB_HOST \
  -p $DB_PORT \
  -U $DB_USER \
  -d $DB_NAME \
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
