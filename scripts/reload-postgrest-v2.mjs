// Einmal: PostgREST Schema-Cache neu laden, damit neue Tabellen exponiert werden
import pg from 'pg';

const client = new pg.Client({
  connectionString: process.env.SUPABASE_DB_URL,
  ssl: { rejectUnauthorized: false },
  connectionTimeoutMillis: 30000,
});

await client.connect();
// DDL-Touch loest Supabase's pgrst_ddl_watch Event-Trigger aus (zuverlaessiger
// als reines NOTIFY) und laedt den PostgREST Schema-Cache neu.
await client.query(`COMMENT ON TABLE public.trial_bookings IS 'Probestunden-Buchungen (DSGVO Auto-Delete)'`);
await client.query(`COMMENT ON TABLE public.posts IS 'Blog/News Beitraege'`);
await client.query(`COMMENT ON TABLE public.performance_metrics IS 'Web-Vitals / Performance-Messwerte'`);
await client.query(`COMMENT ON TABLE public.site_settings IS 'System-Einstellungen (Admin)'`);
await client.query("NOTIFY pgrst, 'reload schema'");
console.log('DDL-Touch + reload-schema ausgefuehrt.');
await client.end();
