// =====================================================
// DanceMotion 2.0 — Migrationen via Node + pg anwenden
// =====================================================
// Wird gebraucht, weil:
//   - sb_secret_ API-Keys kein DDL koennen
//   - der direkte DB-Host IPv6-only ist (Node nutzt OS-Resolver -> IPv6 ok)
//   - `supabase db push` an den DOPPELTEN Versionsnummern (008/009/010/017)
//     der Alt-Migrationen scheitert (schema_migrations_pkey)
//
// Dieses Skript fuehrt die .sql-Dateien aus supabase/migrations alphabetisch
// aus, jede in einer eigenen Transaktion (continue-on-error + Summary).
// Migrationen sind idempotent (IF NOT EXISTS / DROP POLICY IF EXISTS /
// CREATE OR REPLACE), erneutes Ausfuehren ist sicher.
//
// Aufruf:
//   $env:SUPABASE_DB_URL = "postgresql://postgres:<PW>@db.<ref>.supabase.co:5432/postgres"
//   node scripts/apply-migrations-v2.mjs           # alle Dateien
//   node scripts/apply-migrations-v2.mjs 008_emergency_team_fix.sql  # ab Datei X
//
// Abhaengigkeit: npm install pg --no-save  (oder als devDependency)
// =====================================================

import { readFileSync, readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import pg from 'pg';

const connStr = process.env.SUPABASE_DB_URL;
if (!connStr) {
  console.error('FEHLER: Umgebungsvariable SUPABASE_DB_URL ist nicht gesetzt.');
  console.error('Beispiel: postgresql://postgres:<PW>@db.<ref>.supabase.co:5432/postgres');
  process.exit(1);
}

const startFrom = process.argv[2] || null;
const onlyMode = process.argv[3] === 'only';

const migDir = join(dirname(fileURLToPath(import.meta.url)), '..', 'supabase', 'migrations');
let files = readdirSync(migDir).filter((f) => f.endsWith('.sql')).sort();
if (startFrom && onlyMode) {
  // Nur exakt diese eine Datei anwenden
  files = files.filter((f) => f === startFrom);
} else if (startFrom) {
  files = files.filter((f) => f >= startFrom);
}

const client = new pg.Client({
  connectionString: connStr,
  ssl: { rejectUnauthorized: false },
  // grosszuegiges Timeout fuer langsame Verbindungen
  connectionTimeoutMillis: 30000,
  statement_timeout: 120000,
});

console.log(`Verbinde mit der Datenbank ...`);
await client.connect();
console.log(`Wende ${files.length} Migration(en) an aus ${migDir}\n`);

const failed = [];
for (const f of files) {
  const sql = readFileSync(join(migDir, f), 'utf8');
  process.stdout.write(`--> ${f} ... `);
  try {
    await client.query('BEGIN');
    await client.query(sql);
    await client.query('COMMIT');
    console.log('OK');
  } catch (e) {
    try { await client.query('ROLLBACK'); } catch { /* ignore */ }
    console.log(`FEHLGESCHLAGEN: ${e.message}`);
    failed.push({ file: f, msg: e.message });
  }
}

await client.end();

console.log('');
if (failed.length === 0) {
  console.log('Alle Migrationen erfolgreich angewendet.');
  process.exit(0);
} else {
  console.log(`${failed.length} Migration(en) fehlgeschlagen:`);
  for (const x of failed) console.log(`  - ${x.file}: ${x.msg}`);
  process.exit(1);
}
