-- Create system alerts table for time-limited notifications
CREATE TABLE IF NOT EXISTS system_alerts (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  alert_type TEXT NOT NULL CHECK (alert_type IN ('info', 'warning', 'error', 'success')),
  priority INT DEFAULT 0 CHECK (priority >= 0 AND priority <= 3),
  start_date TIMESTAMPTZ NOT NULL,
  end_date TIMESTAMPTZ NOT NULL,
  is_dismissible BOOLEAN DEFAULT true,
  visible_to_admins_only BOOLEAN DEFAULT false,
  created_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  CONSTRAINT valid_dates CHECK (start_date < end_date),
  CONSTRAINT reasonable_duration CHECK (end_date - start_date <= interval '90 days')
);

-- Track user dismissals of alerts
CREATE TABLE IF NOT EXISTS alert_dismissals (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  alert_id TEXT NOT NULL REFERENCES system_alerts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  dismissed_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ NOT NULL,
  
  UNIQUE(alert_id, user_id),
  CONSTRAINT dismissal_expiry CHECK (dismissed_at < expires_at)
);

-- Indices for performance
CREATE INDEX IF NOT EXISTS idx_alerts_start_end ON system_alerts(start_date, end_date);
CREATE INDEX IF NOT EXISTS idx_alerts_priority ON system_alerts(priority DESC);
CREATE INDEX IF NOT EXISTS idx_dismissals_user ON alert_dismissals(user_id, expires_at);
CREATE INDEX IF NOT EXISTS idx_dismissals_alert ON alert_dismissals(alert_id);

-- Enable RLS
ALTER TABLE system_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE alert_dismissals ENABLE ROW LEVEL SECURITY;

-- RLS Policies for alerts
DROP POLICY IF EXISTS "Anyone can view active alerts" ON system_alerts;
CREATE POLICY "Anyone can view active alerts" ON system_alerts
  FOR SELECT
  USING (end_date > NOW());

DROP POLICY IF EXISTS "Admins can manage alerts" ON system_alerts;
CREATE POLICY "Admins can manage alerts" ON system_alerts
  FOR INSERT
  WITH CHECK (auth.jwt() ->> 'role' = 'authenticated');

DROP POLICY IF EXISTS "Only alert creator or admin can update" ON system_alerts;
CREATE POLICY "Only alert creator or admin can update" ON system_alerts
  FOR UPDATE
  USING (auth.jwt() ->> 'sub' = created_by::text OR 
         auth.jwt() ->> 'role' = 'authenticated');

DROP POLICY IF EXISTS "Only alert creator or admin can delete" ON system_alerts;
CREATE POLICY "Only alert creator or admin can delete" ON system_alerts
  FOR DELETE
  USING (auth.jwt() ->> 'sub' = created_by::text OR 
         auth.jwt() ->> 'role' = 'authenticated');

-- RLS Policies for dismissals
DROP POLICY IF EXISTS "Users can view their own dismissals" ON alert_dismissals;
CREATE POLICY "Users can view their own dismissals" ON alert_dismissals
  FOR SELECT
  USING (auth.jwt() ->> 'sub' = user_id::text);

DROP POLICY IF EXISTS "Users can dismiss alerts" ON alert_dismissals;
CREATE POLICY "Users can dismiss alerts" ON alert_dismissals
  FOR INSERT
  WITH CHECK (auth.jwt() ->> 'sub' = user_id::text);

-- Note: The 'alerts_admin' permission needs to be assigned manually in the admin panel
-- Go to /admin/roles and add 'alerts_admin' permission to admin and event-manager roles
