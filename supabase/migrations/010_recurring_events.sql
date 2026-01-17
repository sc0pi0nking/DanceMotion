-- ============================================
-- Recurring Events System (Wiederkehrende Termine)
-- Allows creating events that repeat weekly, monthly, etc.
-- ============================================

-- Recurring event templates table
CREATE TABLE IF NOT EXISTS recurring_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  time TIME,
  location TEXT NOT NULL,
  city TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('Auftritt', 'Workshop', 'Training', 'Event')),
  groups TEXT[] DEFAULT '{}',
  note TEXT,
  href TEXT,
  
  -- Recurrence pattern
  recurrence_type TEXT NOT NULL CHECK (recurrence_type IN ('weekly', 'biweekly', 'monthly')),
  day_of_week INTEGER CHECK (day_of_week >= 0 AND day_of_week <= 6), -- 0=Sunday, 1=Monday, etc.
  day_of_month INTEGER CHECK (day_of_month >= 1 AND day_of_month <= 31), -- For monthly
  
  -- Date range for recurrence
  start_date DATE NOT NULL,
  end_date DATE, -- NULL = indefinite (will generate up to 1 year ahead)
  
  -- Exceptions (dates to skip)
  excluded_dates DATE[] DEFAULT '{}',
  
  -- Status
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID,
  updated_by UUID
);

-- Enable RLS
ALTER TABLE public.recurring_events ENABLE ROW LEVEL SECURITY;

-- Public read access for active recurring events
CREATE POLICY "recurring_events_public_read" ON public.recurring_events
  FOR SELECT USING (is_active = true);

-- Admin operations use service_role key which bypasses RLS
-- No additional policy needed for admin access

-- Updated_at trigger
CREATE OR REPLACE FUNCTION update_recurring_events_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_recurring_events_updated_at
  BEFORE UPDATE ON public.recurring_events
  FOR EACH ROW
  EXECUTE FUNCTION update_recurring_events_updated_at();

-- Add source column to events table to link back to recurring event
ALTER TABLE events 
ADD COLUMN IF NOT EXISTS recurring_event_id UUID REFERENCES recurring_events(id) ON DELETE SET NULL;

-- Index for faster lookups
CREATE INDEX IF NOT EXISTS idx_events_recurring ON events(recurring_event_id);
CREATE INDEX IF NOT EXISTS idx_recurring_events_active ON recurring_events(is_active) WHERE is_active = true;

-- Function to generate events from recurring templates
-- This should be called periodically (e.g., weekly) to generate upcoming events
CREATE OR REPLACE FUNCTION generate_recurring_events(days_ahead INTEGER DEFAULT 90)
RETURNS INTEGER AS $$
DECLARE
  rec RECORD;
  current_date_iter DATE;
  end_limit DATE;
  events_created INTEGER := 0;
  dow INTEGER;
BEGIN
  -- For each active recurring event template
  FOR rec IN 
    SELECT * FROM recurring_events WHERE is_active = true
  LOOP
    -- Calculate end limit
    end_limit := COALESCE(rec.end_date, CURRENT_DATE + days_ahead);
    IF end_limit > CURRENT_DATE + days_ahead THEN
      end_limit := CURRENT_DATE + days_ahead;
    END IF;
    
    -- Start from the later of start_date or today
    current_date_iter := GREATEST(rec.start_date, CURRENT_DATE);
    
    -- For weekly/biweekly: find next occurrence of the day_of_week
    IF rec.recurrence_type IN ('weekly', 'biweekly') AND rec.day_of_week IS NOT NULL THEN
      dow := EXTRACT(DOW FROM current_date_iter)::INTEGER;
      current_date_iter := current_date_iter + ((rec.day_of_week - dow + 7) % 7);
    END IF;
    
    -- Iterate and create events
    WHILE current_date_iter <= end_limit LOOP
      -- Skip if date is in excluded_dates
      IF NOT (current_date_iter = ANY(rec.excluded_dates)) THEN
        -- Check if event already exists for this date and recurring_event_id
        IF NOT EXISTS (
          SELECT 1 FROM events 
          WHERE recurring_event_id = rec.id 
          AND date = current_date_iter
        ) THEN
          -- Create the event
          INSERT INTO events (title, date, time, location, city, category, groups, note, href, recurring_event_id, is_published)
          VALUES (rec.title, current_date_iter, rec.time, rec.location, rec.city, rec.category, rec.groups, rec.note, rec.href, rec.id, true);
          
          events_created := events_created + 1;
        END IF;
      END IF;
      
      -- Advance to next occurrence
      IF rec.recurrence_type = 'weekly' THEN
        current_date_iter := current_date_iter + 7;
      ELSIF rec.recurrence_type = 'biweekly' THEN
        current_date_iter := current_date_iter + 14;
      ELSIF rec.recurrence_type = 'monthly' THEN
        current_date_iter := current_date_iter + INTERVAL '1 month';
      END IF;
    END LOOP;
  END LOOP;
  
  RETURN events_created;
END;
$$ LANGUAGE plpgsql;

-- Comment explaining usage
COMMENT ON FUNCTION generate_recurring_events IS 
  'Generates event instances from recurring_events templates. Call periodically (e.g., weekly via cron) or on-demand from admin panel. days_ahead controls how far in advance to generate (default 90 days).';
