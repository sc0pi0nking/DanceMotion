-- =====================================================
-- Migration: Force Seed Team Members Data
-- Beschreibung: Stelle sicher dass Team-Mitglieder Daten existieren, update falls nötig
-- =====================================================

-- Lösche alte Daten um sicherzustellen dass neue eingefügt werden (bei leerer Tabelle)
DELETE FROM public.team_members WHERE name IN (
  'Sarah Müller', 'Michael Schmidt', 'Lisa Wagner', 'Tom Becker'
);

-- Füge Beispiel-Daten ein
INSERT INTO public.team_members (name, role, bio, order_index, social_links, published) VALUES
  (
    'Sarah Müller',
    'Trainerin Hip-Hop & Jazz',
    'Mit über 10 Jahren Tanzerfahrung bringt Sarah Energie und Leidenschaft in jede Stunde. Sie liebt es, ihre Schüler zu motivieren und gemeinsam mit ihnen zu wachsen.',
    1,
    '{"instagram": "sarah_dancemotion", "email": "sarah@dancemotion-eschweiler.de"}'::jsonb,
    true
  ),
  (
    'Michael Schmidt',
    'Geschäftsführung & Choreograph',
    'Michael ist der kreative Kopf hinter DanceMotion. Seine Choreographien begeistern regelmäßig bei Shows und Events.',
    2,
    '{"facebook": "michael.schmidt.dm", "email": "michael@dancemotion-eschweiler.de"}'::jsonb,
    true
  ),
  (
    'Lisa Wagner',
    'Trainerin Ballett & Modern Dance',
    'Lisa hat klassisches Ballett studiert und gibt ihre Leidenschaft für elegante Bewegungen mit viel Geduld an ihre Schüler weiter.',
    3,
    '{"instagram": "lisa_ballett", "email": "lisa@dancemotion-eschweiler.de"}'::jsonb,
    true
  ),
  (
    'Tom Becker',
    'Trainer Breakdance & Urban Styles',
    'Tom ist seit seiner Jugend in der Breakdance-Szene aktiv. Er bringt Street-Dance-Kultur authentisch ins Studio.',
    4,
    '{"instagram": "tom_breaker", "facebook": "tom.becker.dance"}'::jsonb,
    true
  );
