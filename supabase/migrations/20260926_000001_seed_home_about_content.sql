-- =====================================================
-- Migration: Startseite "Über uns" Freitext-Block
-- Seedet Überschrift + Textkörper als editierbare Content-Keys,
-- damit der Block sofort im Admin-Bereich "Inhalte" (Sektion "home")
-- erscheint. Inline-Bearbeitung nutzt dieselben Keys.
-- Bearbeitung erfordert die Berechtigung "Inhalte" (PERMISSIONS.CONTENT).
-- =====================================================

INSERT INTO content (key, section, description, value)
VALUES
  (
    'home.about.title',
    'home',
    'Überschrift des "Über uns"-Blocks auf der Startseite',
    jsonb_build_object('text', 'Unser Verein')
  ),
  (
    'home.about.text',
    'home',
    'Fließtext des "Über uns"-Blocks (Entstehung des Vereins etc.)',
    jsonb_build_object(
      'text',
      E'DanceMotion Eschweiler entstand aus der Leidenschaft für Tanz und Gemeinschaft. Was als kleine Gruppe begann, ist über die Jahre zu einem lebendigen Verein mit mehreren Tanzgruppen für jedes Alter gewachsen.\n\nBei uns stehen die Freude an der Bewegung, der Zusammenhalt und das gemeinsame Erleben im Mittelpunkt – von den ersten Schritten bis zum großen Auftritt auf der Bühne.'
    )
  )
ON CONFLICT (key) DO UPDATE SET
  section = EXCLUDED.section,
  description = EXCLUDED.description,
  updated_at = NOW();
