// Einmal: PostgREST Schema-Cache neu laden, damit neue Tabellen exponiert werden
import pg from 'pg';

const client = new pg.Client({
  connectionString: process.env.SUPABASE_DB_URL,
  ssl: { rejectUnauthorized: false },
  connectionTimeoutMillis: 30000,
});

await client.connect();
await client.query("NOTIFY pgrst, 'reload schema'");
console.log('PostgREST reload-schema Signal gesendet.');
await client.end();
