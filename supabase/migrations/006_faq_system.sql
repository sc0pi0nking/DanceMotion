-- =====================================================
-- Migration: FAQ System
-- Beschreibung: Häufig gestellte Fragen mit Kategorien
-- =====================================================

-- 1. FAQ Tabelle erstellen
CREATE TABLE IF NOT EXISTS public.faqs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'allgemein',
  order_index INTEGER NOT NULL DEFAULT 0,
  published BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. RLS aktivieren
ALTER TABLE public.faqs ENABLE ROW LEVEL SECURITY;

-- 3. Policies: Public kann nur veröffentlichte FAQs lesen
CREATE POLICY "Public can read published FAQs"
ON public.faqs FOR SELECT
USING (published = true);

-- 4. Policies: Admins können alles
CREATE POLICY "Admins can do everything with FAQs"
ON public.faqs FOR ALL
USING (true);

-- 5. Indizes für Performance
CREATE INDEX IF NOT EXISTS idx_faqs_category ON public.faqs(category);
CREATE INDEX IF NOT EXISTS idx_faqs_order ON public.faqs(order_index);
CREATE INDEX IF NOT EXISTS idx_faqs_published ON public.faqs(published);

-- 6. Updated_at Trigger
CREATE TRIGGER update_faqs_updated_at
BEFORE UPDATE ON public.faqs
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- 7. Beispiel-FAQs einfügen
INSERT INTO public.faqs (question, answer, category, order_index, published) VALUES
  (
    'Was kostet eine Tanzstunde bei DanceMotion?',
    'Die Preise variieren je nach Kurs und Altersgruppe. Bitte kontaktieren Sie uns für detaillierte Preisinformationen oder schauen Sie in unsere aktuellen Kursangebote.',
    'kurse',
    1,
    true
  ),
  (
    'Kann ich eine kostenlose Probestunde buchen?',
    'Ja! Wir bieten für alle Kurse eine kostenlose Probestunde an. Melden Sie sich einfach telefonisch oder per E-Mail bei uns an.',
    'kurse',
    2,
    true
  ),
  (
    'Welche Tanzstile bietet DanceMotion an?',
    'Wir unterrichten verschiedene Tanzstile: Ballett, Hip-Hop, Jazz Dance, Modern Dance, Kindertanz und vieles mehr. Schauen Sie sich unsere Gruppen an!',
    'kurse',
    3,
    true
  ),
  (
    'Ab welchem Alter können Kinder bei euch tanzen?',
    'Unsere jüngsten Tänzer starten bereits ab 3 Jahren in der Gruppe "Little Joys". Wir haben altersgerechte Gruppen für alle Altersklassen bis ins Erwachsenenalter.',
    'kurse',
    4,
    true
  ),
  (
    'Brauche ich Vorkenntnisse?',
    'Nein! Wir haben Kurse für Anfänger und Fortgeschrittene. Unsere Trainer holen jeden genau dort ab, wo er steht.',
    'kurse',
    5,
    true
  ),
  (
    'Wie kann ich mich für einen Kurs anmelden?',
    'Die Anmeldung erfolgt telefonisch unter 02403 555444 oder per E-Mail an info@dancemotion-eschweiler.de. Sie können uns auch über unser Event-Anfrageformular kontaktieren.',
    'anmeldung',
    1,
    true
  ),
  (
    'Gibt es Schnupperstunden?',
    'Ja, jeder kann eine kostenlose Schnupperstunde besuchen. Vereinbaren Sie einfach einen Termin mit uns.',
    'anmeldung',
    2,
    true
  ),
  (
    'Kann ich monatlich kündigen?',
    'Die Kündigungsfristen hängen vom gewählten Kursmodell ab. Details erfahren Sie bei der Anmeldung oder in unseren AGBs.',
    'anmeldung',
    3,
    true
  ),
  (
    'Bietet ihr auch Auftritte und Shows an?',
    'Ja! Wir organisieren regelmäßig Shows und Auftritte, bei denen unsere Tänzer ihr Können präsentieren. Wir buchen auch für externe Events.',
    'events',
    1,
    true
  ),
  (
    'Kann ich DanceMotion für meine Hochzeit/Firmenfeier buchen?',
    'Absolut! Wir bieten professionelle Tanzshows für Hochzeiten, Firmenfeiern, Geburtstage und andere Events. Nutzen Sie unser Event-Anfrageformular auf der Terminseite.',
    'events',
    2,
    true
  ),
  (
    'Wo findet das Training statt?',
    'Unser Studio befindet sich in Eschweiler. Die genaue Adresse finden Sie im Impressum.',
    'allgemein',
    1,
    true
  ),
  (
    'Habt ihr Parkplätze?',
    'Ja, es gibt ausreichend Parkmöglichkeiten direkt vor dem Studio.',
    'allgemein',
    2,
    true
  ),
  (
    'Wie erreiche ich euch?',
    'Sie erreichen uns telefonisch, per E-Mail oder über unser Kontaktformular. Die Kontaktdaten finden Sie im Impressum.',
    'allgemein',
    3,
    true
  )
ON CONFLICT DO NOTHING;

-- 8. Kommentare für Dokumentation
COMMENT ON TABLE public.faqs IS 'FAQ System: Häufig gestellte Fragen mit Kategorien';
COMMENT ON COLUMN public.faqs.category IS 'Kategorien: kurse, anmeldung, events, allgemein, etc.';
COMMENT ON COLUMN public.faqs.order_index IS 'Sortierung innerhalb der Kategorie (niedrigere Zahlen zuerst)';
COMMENT ON COLUMN public.faqs.published IS 'Nur veröffentlichte FAQs werden auf der öffentlichen Seite angezeigt';
