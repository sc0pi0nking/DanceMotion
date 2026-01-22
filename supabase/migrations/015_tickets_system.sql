-- Create tickets table for anonymous support requests
-- Completely anonymous - no user/email tracking for DSGVO compliance

CREATE TABLE IF NOT EXISTS tickets (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('bug', 'incomplete', 'suggestion', 'question', 'other')),
  priority TEXT DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high')),
  status TEXT DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'resolved', 'closed')),
  admin_notes JSONB DEFAULT '[]'::jsonb, -- Array of {note, created_by, created_at}
  resolved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indices for performance
CREATE INDEX IF NOT EXISTS idx_tickets_status ON tickets(status);
CREATE INDEX IF NOT EXISTS idx_tickets_category ON tickets(category);
CREATE INDEX IF NOT EXISTS idx_tickets_priority ON tickets(priority);
CREATE INDEX IF NOT EXISTS idx_tickets_created_at ON tickets(created_at DESC);

-- Enable RLS
ALTER TABLE tickets ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Anyone can INSERT (anonymous)
CREATE POLICY "Allow anyone to create tickets" ON tickets
  FOR INSERT
  WITH CHECK (true);

-- RLS Policy: Only admins can SELECT/UPDATE/DELETE
CREATE POLICY "Allow admins to manage tickets" ON tickets
  FOR SELECT
  USING (auth.jwt() ->> 'role' = 'authenticated');

CREATE POLICY "Allow admins to update tickets" ON tickets
  FOR UPDATE
  USING (auth.jwt() ->> 'role' = 'authenticated');

CREATE POLICY "Allow admins to delete tickets" ON tickets
  FOR DELETE
  USING (auth.jwt() ->> 'role' = 'authenticated');
