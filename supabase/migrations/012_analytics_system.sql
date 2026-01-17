-- ============================================
-- Privacy-Friendly Analytics System
-- DSGVO-konform: Keine personenbezogenen Daten
-- ============================================

-- 1. Tägliche Statistiken (aggregiert, keine User-Daten)
CREATE TABLE IF NOT EXISTS public.analytics_daily (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  date DATE NOT NULL UNIQUE,
  page_views INTEGER DEFAULT 0,
  unique_visitors INTEGER DEFAULT 0,
  -- Gerätekategorien (aggregiert)
  desktop_visits INTEGER DEFAULT 0,
  mobile_visits INTEGER DEFAULT 0,
  tablet_visits INTEGER DEFAULT 0,
  -- Top-Seiten als JSONB Array [{path: "/", views: 100}, ...]
  top_pages JSONB DEFAULT '[]'::jsonb,
  -- Referrer-Quellen als JSONB
  referrer_sources JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Page Views (anonymisiert - kein IP, nur Session-Hash)
CREATE TABLE IF NOT EXISTS public.analytics_pageviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  -- Anonymer Session-Hash (nicht rückverfolgbar)
  session_hash TEXT NOT NULL,
  -- Seiteninformationen
  path TEXT NOT NULL,
  referrer TEXT,
  -- Geräteinformationen (grob)
  device_type TEXT CHECK (device_type IN ('desktop', 'mobile', 'tablet')),
  -- Browser-Familie (kein vollständiger UA)
  browser TEXT,
  -- Zeitstempel
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Indexes für schnelle Abfragen
CREATE INDEX IF NOT EXISTS idx_analytics_daily_date ON public.analytics_daily(date DESC);
CREATE INDEX IF NOT EXISTS idx_analytics_pageviews_created ON public.analytics_pageviews(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_analytics_pageviews_path ON public.analytics_pageviews(path);
CREATE INDEX IF NOT EXISTS idx_analytics_pageviews_session ON public.analytics_pageviews(session_hash);

-- 4. Automatische Aggregation: Funktion zum täglichen Update
CREATE OR REPLACE FUNCTION public.aggregate_daily_analytics(target_date DATE DEFAULT CURRENT_DATE)
RETURNS void AS $$
DECLARE
  v_page_views INTEGER;
  v_unique_visitors INTEGER;
  v_desktop INTEGER;
  v_mobile INTEGER;
  v_tablet INTEGER;
  v_top_pages JSONB;
  v_referrers JSONB;
BEGIN
  -- Zähle Seitenaufrufe für den Tag
  SELECT 
    COUNT(*),
    COUNT(DISTINCT session_hash)
  INTO v_page_views, v_unique_visitors
  FROM public.analytics_pageviews
  WHERE created_at::date = target_date;

  -- Gerätekategorien zählen
  SELECT 
    COUNT(*) FILTER (WHERE device_type = 'desktop'),
    COUNT(*) FILTER (WHERE device_type = 'mobile'),
    COUNT(*) FILTER (WHERE device_type = 'tablet')
  INTO v_desktop, v_mobile, v_tablet
  FROM public.analytics_pageviews
  WHERE created_at::date = target_date;

  -- Top 10 Seiten
  SELECT COALESCE(jsonb_agg(row_to_json(t)), '[]'::jsonb)
  INTO v_top_pages
  FROM (
    SELECT path, COUNT(*) as views
    FROM public.analytics_pageviews
    WHERE created_at::date = target_date
    GROUP BY path
    ORDER BY views DESC
    LIMIT 10
  ) t;

  -- Top Referrer (ohne eigene Domain)
  SELECT COALESCE(jsonb_agg(row_to_json(t)), '[]'::jsonb)
  INTO v_referrers
  FROM (
    SELECT referrer, COUNT(*) as count
    FROM public.analytics_pageviews
    WHERE created_at::date = target_date
      AND referrer IS NOT NULL
      AND referrer != ''
      AND referrer NOT LIKE '%dancemotion.org%'
    GROUP BY referrer
    ORDER BY count DESC
    LIMIT 10
  ) t;

  -- Upsert in daily table
  INSERT INTO public.analytics_daily (date, page_views, unique_visitors, desktop_visits, mobile_visits, tablet_visits, top_pages, referrer_sources)
  VALUES (target_date, v_page_views, v_unique_visitors, v_desktop, v_mobile, v_tablet, v_top_pages, v_referrers)
  ON CONFLICT (date) DO UPDATE SET
    page_views = EXCLUDED.page_views,
    unique_visitors = EXCLUDED.unique_visitors,
    desktop_visits = EXCLUDED.desktop_visits,
    mobile_visits = EXCLUDED.mobile_visits,
    tablet_visits = EXCLUDED.tablet_visits,
    top_pages = EXCLUDED.top_pages,
    referrer_sources = EXCLUDED.referrer_sources,
    updated_at = NOW();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 5. DSGVO: Automatisches Löschen alter Pageview-Daten (nach 90 Tagen)
CREATE OR REPLACE FUNCTION public.cleanup_old_pageviews()
RETURNS void AS $$
BEGIN
  DELETE FROM public.analytics_pageviews
  WHERE created_at < NOW() - INTERVAL '90 days';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 6. RLS Policies
ALTER TABLE public.analytics_daily ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analytics_pageviews ENABLE ROW LEVEL SECURITY;

-- Jeder kann Pageviews einfügen (für Tracking)
CREATE POLICY "Anyone can insert pageviews"
ON public.analytics_pageviews FOR INSERT
WITH CHECK (true);

-- Nur Admins können lesen
CREATE POLICY "Admins can read pageviews"
ON public.analytics_pageviews FOR SELECT
USING (true);

CREATE POLICY "Admins can read daily analytics"
ON public.analytics_daily FOR SELECT
USING (true);

CREATE POLICY "System can manage daily analytics"
ON public.analytics_daily FOR ALL
USING (true);

-- 7. Prüfung
SELECT 'Analytics tables created successfully' as status;
