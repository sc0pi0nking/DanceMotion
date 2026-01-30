-- Advanced Analytics SQL Functions
-- These functions calculate detailed metrics for the enhanced analytics dashboard

-- Migration file: supabase/migrations/019_advanced_analytics_functions.sql

-- Function to get session engagement metrics
CREATE OR REPLACE FUNCTION get_session_metrics(p_start_date DATE)
RETURNS TABLE (
  session_hash TEXT,
  session_duration INTEGER,
  page_count INTEGER,
  visit_count INTEGER,
  conversion_event BOOLEAN
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    ah.session_hash,
    EXTRACT(EPOCH FROM (MAX(ah.created_at) - MIN(ah.created_at)))::INTEGER as session_duration,
    COUNT(*)::INTEGER as page_count,
    ROW_NUMBER() OVER (PARTITION BY ah.session_hash ORDER BY MIN(ah.created_at)) as visit_count,
    (COUNT(*) FILTER (WHERE ah.page_path LIKE '%contact%' OR ah.page_path LIKE '%form%')) > 0 as conversion_event
  FROM analytics_pageviews ah
  WHERE ah.created_at::DATE >= p_start_date
  GROUP BY ah.session_hash;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Function to get event popularity metrics
CREATE OR REPLACE FUNCTION get_event_popularity(p_start_date DATE)
RETURNS TABLE (
  id UUID,
  name TEXT,
  date TIMESTAMP,
  page_views INTEGER,
  unique_visitors INTEGER,
  ctr_clicks INTEGER,
  conversions INTEGER
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    e.id,
    e.title as name,
    e.start_time as date,
    COUNT(DISTINCT ap.page_path)::INTEGER as page_views,
    COUNT(DISTINCT ap.session_hash)::INTEGER as unique_visitors,
    COUNT(*) FILTER (WHERE ap.page_path LIKE '%button%' OR ap.event_type = 'click')::INTEGER as ctr_clicks,
    COUNT(*) FILTER (WHERE ap.page_path LIKE '%contact%' OR ap.page_path LIKE '%form%')::INTEGER as conversions
  FROM events e
  LEFT JOIN analytics_pageviews ap ON (
    ap.page_path LIKE CONCAT('%', e.id::TEXT, '%')
    OR ap.page_path LIKE CONCAT('%', SLUGIFY(e.title), '%')
  )
  WHERE e.start_time::DATE >= p_start_date
  GROUP BY e.id, e.title, e.start_time;
END;
$$ LANGUAGE plpgsql STABLE;

-- Function to get performance metrics from Web Vitals
CREATE OR REPLACE FUNCTION get_performance_metrics(p_start_date DATE)
RETURNS TABLE (
  page_load_time INTEGER,
  fcp INTEGER,
  lcp INTEGER,
  cls NUMERIC,
  device_type TEXT
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    (pm.data->>'pageLoadTime')::INTEGER as page_load_time,
    (pm.data->>'fcp')::INTEGER as fcp,
    (pm.data->>'lcp')::INTEGER as lcp,
    (pm.data->>'cls')::NUMERIC as cls,
    pm.device_type
  FROM performance_metrics pm
  WHERE pm.created_at::DATE >= p_start_date
    AND pm.data IS NOT NULL;
END;
$$ LANGUAGE plpgsql STABLE;

-- Function to get group engagement
CREATE OR REPLACE FUNCTION get_group_engagement(p_start_date DATE)
RETURNS TABLE (
  id UUID,
  name TEXT,
  page_views INTEGER,
  unique_visitors INTEGER,
  avg_time_on_page NUMERIC
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    g.id,
    g.name,
    COUNT(ap.id)::INTEGER as page_views,
    COUNT(DISTINCT ap.session_hash)::INTEGER as unique_visitors,
    ROUND(AVG(EXTRACT(EPOCH FROM (MAX(ap.created_at) - MIN(ap.created_at))))::NUMERIC, 0) as avg_time_on_page
  FROM groups g
  LEFT JOIN analytics_pageviews ap ON (
    ap.page_path LIKE CONCAT('%/gruppen/%', SLUGIFY(g.name), '%')
    OR ap.page_path LIKE CONCAT('%', g.id::TEXT, '%')
  )
  WHERE ap.created_at::DATE >= p_start_date OR ap.created_at IS NULL
  GROUP BY g.id, g.name;
END;
$$ LANGUAGE plpgsql STABLE;

-- Function to get traffic sources breakdown
CREATE OR REPLACE FUNCTION get_traffic_sources(p_start_date DATE)
RETURNS TABLE (
  source TEXT,
  count BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    COALESCE(
      CASE
        WHEN ap.referrer_url IS NULL OR ap.referrer_url = '' THEN 'Direct'
        WHEN ap.referrer_url LIKE '%google%' THEN 'Google'
        WHEN ap.referrer_url LIKE '%facebook%' THEN 'Facebook'
        WHEN ap.referrer_url LIKE '%instagram%' THEN 'Instagram'
        WHEN ap.referrer_url LIKE '%youtube%' THEN 'YouTube'
        WHEN ap.referrer_url LIKE '%whatsapp%' THEN 'WhatsApp'
        ELSE 'Other'
      END,
      'Direct'
    ) as source,
    COUNT(*)
  FROM analytics_pageviews ap
  WHERE ap.created_at::DATE >= p_start_date
  GROUP BY source
  ORDER BY count DESC;
END;
$$ LANGUAGE plpgsql STABLE;

-- Function to get user flow/path analysis
CREATE OR REPLACE FUNCTION get_user_flows(p_start_date DATE)
RETURNS TABLE (
  current_page TEXT,
  next_page TEXT,
  transition_count BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    ap1.page_path as current_page,
    ap2.page_path as next_page,
    COUNT(*)
  FROM analytics_pageviews ap1
  JOIN analytics_pageviews ap2 ON (
    ap1.session_hash = ap2.session_hash
    AND ap2.created_at > ap1.created_at
    AND ap2.created_at <= ap1.created_at + INTERVAL '30 minutes'
  )
  WHERE ap1.created_at::DATE >= p_start_date
    AND ap2.created_at::DATE >= p_start_date
  GROUP BY ap1.page_path, ap2.page_path
  ORDER BY transition_count DESC;
END;
$$ LANGUAGE plpgsql STABLE;

-- Helper function to slugify text (if not exists)
CREATE OR REPLACE FUNCTION SLUGIFY(input_text TEXT)
RETURNS TEXT AS $$
BEGIN
  RETURN LOWER(REGEXP_REPLACE(
    REGEXP_REPLACE(input_text, '[^a-zA-Z0-9\s-]', '', 'g'),
    '\s+', '-',
    'g'
  ));
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_analytics_pageviews_created_at 
  ON analytics_pageviews(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_analytics_pageviews_session 
  ON analytics_pageviews(session_hash);

CREATE INDEX IF NOT EXISTS idx_analytics_pageviews_page 
  ON analytics_pageviews(page_path);

CREATE INDEX IF NOT EXISTS idx_performance_metrics_created_at 
  ON performance_metrics(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_performance_metrics_device 
  ON performance_metrics(device_type);
