-- System Settings Migration
-- Stores global admin settings in the content table with section='settings'

-- Insert default system settings (only if they don't exist)
-- Values are stored as JSONB with format {"v": value}

-- Website Settings
INSERT INTO content (key, section, description, value)
VALUES ('setting_site_title', 'settings', 'Website-Titel', '{"v": "DanceMotion Eschweiler"}'::jsonb)
ON CONFLICT (key) DO NOTHING;

INSERT INTO content (key, section, description, value)
VALUES ('setting_site_description', 'settings', 'Website-Beschreibung (Meta)', '{"v": "Offene Tanzgemeinschaft in Eschweiler"}'::jsonb)
ON CONFLICT (key) DO NOTHING;

-- Design Settings
INSERT INTO content (key, section, description, value)
VALUES ('setting_default_theme', 'settings', 'Standard-Theme (dark/light/system)', '{"v": "dark"}'::jsonb)
ON CONFLICT (key) DO NOTHING;

INSERT INTO content (key, section, description, value)
VALUES ('setting_accent_color', 'settings', 'Akzentfarbe (Hex)', '{"v": "#2ec4c6"}'::jsonb)
ON CONFLICT (key) DO NOTHING;

-- Security Settings
INSERT INTO content (key, section, description, value)
VALUES ('setting_session_timeout_minutes', 'settings', 'Session-Timeout in Minuten', '{"v": 60}'::jsonb)
ON CONFLICT (key) DO NOTHING;

INSERT INTO content (key, section, description, value)
VALUES ('setting_min_password_length', 'settings', 'Minimale Passwortlänge', '{"v": 8}'::jsonb)
ON CONFLICT (key) DO NOTHING;

INSERT INTO content (key, section, description, value)
VALUES ('setting_require_special_chars', 'settings', 'Sonderzeichen im Passwort erforderlich', '{"v": true}'::jsonb)
ON CONFLICT (key) DO NOTHING;

INSERT INTO content (key, section, description, value)
VALUES ('setting_max_login_attempts', 'settings', 'Maximale Login-Versuche vor Sperre', '{"v": 5}'::jsonb)
ON CONFLICT (key) DO NOTHING;

INSERT INTO content (key, section, description, value)
VALUES ('setting_lockout_duration_minutes', 'settings', 'Sperrdauer in Minuten nach zu vielen Versuchen', '{"v": 15}'::jsonb)
ON CONFLICT (key) DO NOTHING;

-- Event Settings
INSERT INTO content (key, section, description, value)
VALUES ('setting_default_event_duration', 'settings', 'Standard Event-Dauer in Minuten', '{"v": 90}'::jsonb)
ON CONFLICT (key) DO NOTHING;

INSERT INTO content (key, section, description, value)
VALUES ('setting_show_past_events_days', 'settings', 'Vergangene Events anzeigen (Tage)', '{"v": 7}'::jsonb)
ON CONFLICT (key) DO NOTHING;

INSERT INTO content (key, section, description, value)
VALUES ('setting_enable_event_reminders', 'settings', 'Event-Erinnerungen aktivieren', '{"v": true}'::jsonb)
ON CONFLICT (key) DO NOTHING;

-- Audit Settings
INSERT INTO content (key, section, description, value)
VALUES ('setting_audit_retention_days', 'settings', 'Audit-Log Aufbewahrungsdauer in Tagen (DSGVO)', '{"v": 90}'::jsonb)
ON CONFLICT (key) DO NOTHING;

INSERT INTO content (key, section, description, value)
VALUES ('setting_enable_audit_logging', 'settings', 'Audit-Logging aktivieren', '{"v": true}'::jsonb)
ON CONFLICT (key) DO NOTHING;

-- Create index for faster settings lookup
CREATE INDEX IF NOT EXISTS idx_content_settings ON content(key) WHERE section = 'settings';

-- Verify settings were inserted
SELECT key, description, value FROM content WHERE section = 'settings' ORDER BY key;
