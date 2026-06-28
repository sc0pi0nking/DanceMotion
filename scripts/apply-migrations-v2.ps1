# =====================================================
# DanceMotion 2.0 — Migrationen auf das v2-Supabase-Projekt anwenden
# =====================================================
# Voraussetzungen:
#   - Docker Desktop laeuft (nutzt das postgres-Image fuer psql, kein lokales psql noetig)
#   - Umgebungsvariable SUPABASE_DB_URL gesetzt = Session-Pooler-URI inkl. Passwort
#     (Supabase Dashboard -> Connect -> "Session pooler" -> URI kopieren)
#
# Wichtig: Die sb_publishable_/sb_secret_ API-Keys koennen KEIN DDL ausfuehren.
#          Zum Anlegen der Tabellen wird die echte Postgres-Verbindung gebraucht.
#
# Aufruf (Windows PowerShell):
#   $env:SUPABASE_DB_URL = "postgresql://postgres.<ref>:<DB-PASSWORT>@aws-0-<region>.pooler.supabase.com:5432/postgres?sslmode=require"
#   powershell -ExecutionPolicy Bypass -File scripts\apply-migrations-v2.ps1
#
# Das Skript wendet ALLE Dateien aus supabase/migrations in alphabetischer
# Reihenfolge an (001..027 + 20260628_00000{1..5}). Jede Datei laeuft in einer
# eigenen Transaktion (--single-transaction); schlaegt eine fehl, wird sie
# uebersprungen und am Ende zusammengefasst. Migrationen sind idempotent
# (IF NOT EXISTS / DROP POLICY IF EXISTS / CREATE OR REPLACE), erneutes
# Ausfuehren ist sicher.
# =====================================================

param(
  [string]$DbUrl = $env:SUPABASE_DB_URL,
  [string]$Image = "postgres:16"
)

if ([string]::IsNullOrWhiteSpace($DbUrl)) {
  Write-Host "FEHLER: SUPABASE_DB_URL ist nicht gesetzt." -ForegroundColor Red
  Write-Host "Setze zuerst die Session-Pooler-URI (inkl. DB-Passwort) aus dem Supabase-Dashboard:" -ForegroundColor Yellow
  Write-Host '  $env:SUPABASE_DB_URL = "postgresql://postgres.<ref>:<PW>@aws-0-<region>.pooler.supabase.com:5432/postgres?sslmode=require"'
  exit 1
}

$migDir = (Resolve-Path "$PSScriptRoot/../supabase/migrations").Path
$migDirDocker = $migDir -replace '\\', '/'
$files = Get-ChildItem -Path $migDir -Filter *.sql | Sort-Object Name

Write-Host ("Wende {0} Migrationen an aus {1}" -f $files.Count, $migDir) -ForegroundColor Cyan
Write-Host ""

$failed = @()
foreach ($f in $files) {
  Write-Host ("--> {0}" -f $f.Name) -ForegroundColor Yellow
  docker run --rm `
    -e PGCLIENTENCODING=UTF8 `
    -v "${migDirDocker}:/mig:ro" `
    $Image `
    psql "$DbUrl" --single-transaction -v ON_ERROR_STOP=1 -f "/mig/$($f.Name)" 2>&1 | Write-Host
  if ($LASTEXITCODE -ne 0) {
    Write-Host ("    FEHLGESCHLAGEN: {0}" -f $f.Name) -ForegroundColor Red
    $failed += $f.Name
  }
  else {
    Write-Host "    OK" -ForegroundColor Green
  }
}

Write-Host ""
if ($failed.Count -eq 0) {
  Write-Host "Alle Migrationen erfolgreich angewendet." -ForegroundColor Green
  exit 0
}
else {
  Write-Host ("{0} Migration(en) fehlgeschlagen:" -f $failed.Count) -ForegroundColor Red
  $failed | ForEach-Object { Write-Host ("  - {0}" -f $_) -ForegroundColor Red }
  Write-Host "Bitte Ausgabe oben pruefen. Idempotente Migrationen koennen nach Korrektur erneut laufen." -ForegroundColor Yellow
  exit 1
}
