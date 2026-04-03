-- =====================================================
-- SECURITY HARDENING: Public Alerts Visibility
-- Ensures public reads never include admin-only or inactive alerts
-- =====================================================

-- Replace weak public alert read policy
DROP POLICY IF EXISTS "Anyone can view active alerts" ON public.system_alerts;
DROP POLICY IF EXISTS "Public can view active non-admin alerts" ON public.system_alerts;

CREATE POLICY "Public can view active non-admin alerts"
ON public.system_alerts FOR SELECT
TO anon, authenticated
USING (
  visible_to_admins_only = false
  AND start_date <= NOW()
  AND end_date > NOW()
);

-- Keep management via service role/backend paths
