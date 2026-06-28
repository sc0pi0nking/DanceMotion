-- =====================================================
-- Migration: Performance Metrics
-- Sprint 2 — fehlende Tabelle aus 1.0-Analytics (Migration 019)
-- =====================================================

-- 1. Tabelle
CREATE TABLE IF NOT EXISTS public.performance_metrics (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_hash TEXT NOT NULL,
  metric_name  TEXT NOT NULL,
  metric_value DOUBLE PRECISION NOT NULL,
  path         TEXT NOT NULL,
  created_at   TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Indizes
CREATE INDEX IF NOT EXISTS idx_perf_metrics_created_at ON public.performance_metrics(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_perf_metrics_name       ON public.performance_metrics(metric_name);
CREATE INDEX IF NOT EXISTS idx_perf_metrics_path       ON public.performance_metrics(path);

-- 3. RLS — anonym darf Web-Vitals senden, lesen nur Admins
ALTER TABLE public.performance_metrics ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can insert performance metrics" ON public.performance_metrics;
CREATE POLICY "Anyone can insert performance metrics" ON public.performance_metrics
  FOR INSERT
  WITH CHECK (true);

DROP POLICY IF EXISTS "Authenticated can read performance metrics" ON public.performance_metrics;
CREATE POLICY "Authenticated can read performance metrics" ON public.performance_metrics
  FOR SELECT
  USING (auth.jwt() ->> 'role' = 'authenticated');

-- 4. Kommentare
COMMENT ON TABLE  public.performance_metrics              IS 'Web-Vitals / Performance-Messwerte (anonymisiert via session_hash)';
COMMENT ON COLUMN public.performance_metrics.session_hash IS 'Anonymisierter Session-Identifier (kein Personenbezug)';
COMMENT ON COLUMN public.performance_metrics.metric_name  IS 'z. B. LCP, FID, CLS, TTFB, INP';
COMMENT ON COLUMN public.performance_metrics.metric_value IS 'Messwert (ms bzw. Score)';
COMMENT ON COLUMN public.performance_metrics.path         IS 'Pfad der gemessenen Seite';
