-- Seed Content Data for DanceMotion
-- This file populates the content table with initial data
-- Run this in Supabase SQL Editor after creating tables

-- Clear existing content (optional)
-- TRUNCATE TABLE content;

-- Homepage Content
INSERT INTO content (key, section, description, value) VALUES
  ('home.hero.title', 'Homepage', 'Hauptüberschrift auf der Startseite', '{"text": "Willkommen bei DanceMotion"}'),
  ('home.hero.subtitle', 'Homepage', 'Untertitel/Slogan auf der Startseite', '{"text": "Tanz, Bewegung und Lebensfreude in Eschweiler"}'),
  ('home.about.title', 'Homepage', 'Über uns - Überschrift', '{"text": "Über DanceMotion"}'),
  ('home.about.text', 'Homepage', 'Über uns - Beschreibung', '{"text": "DanceMotion ist deine Tanzschule in Eschweiler für alle Altersgruppen. Wir bieten professionellen Tanzunterricht in verschiedenen Stilen und regelmäßige Events und Auftritte."}'),
  ('home.cta.text', 'Homepage', 'Call-to-Action Text', '{"text": "Bereit zum Tanzen? Komm vorbei oder schreib uns!"}')
ON CONFLICT (key) DO NOTHING;

-- Group: Little Joys
INSERT INTO content (key, section, description, value) VALUES
  ('group.littlejoys.hero.title', 'Gruppen - Little Joys', 'Seitentitel', '{"text": "Little Joys"}'),
  ('group.littlejoys.hero.subtitle', 'Gruppen - Little Joys', 'Untertitel', '{"text": "Tanzen für die Kleinsten"}'),
  ('group.littlejoys.about.text', 'Gruppen - Little Joys', 'Beschreibungstext', '{"text": "Die Little Joys Gruppe ist speziell für unsere jüngsten Tänzer konzipiert. In spielerischer Atmosphäre entdecken Kinder ab 3 Jahren die Freude an Bewegung und Musik. Mit altersgerechten Choreographien und viel Spaß fördern wir Rhythmusgefühl, Koordination und Kreativität."}'),
  ('group.littlejoys.age', 'Gruppen - Little Joys', 'Altersgruppe', '{"text": "3-6 Jahre"}'),
  ('group.littlejoys.schedule', 'Gruppen - Little Joys', 'Trainingszeiten', '{"text": "Montags 16:00-17:00 Uhr\nMittwochs 16:00-17:00 Uhr"}')
ON CONFLICT (key) DO NOTHING;

-- Group: Smileys
INSERT INTO content (key, section, description, value) VALUES
  ('group.smileys.hero.title', 'Gruppen - Smileys', 'Seitentitel', '{"text": "Smileys"}'),
  ('group.smileys.hero.subtitle', 'Gruppen - Smileys', 'Untertitel', '{"text": "Fröhlich tanzen und bewegen"}'),
  ('group.smileys.about.text', 'Gruppen - Smileys', 'Beschreibungstext', '{"text": "Die Smileys sind eine energiegeladene Tanzgruppe für Kinder im Grundschulalter. Hier lernen die Kids verschiedene Tanzstile kennen, verbessern ihre Technik und haben dabei jede Menge Spaß. Mit motivierenden Choreographien zu aktueller Musik fördern wir Teamgeist und Selbstbewusstsein."}'),
  ('group.smileys.age', 'Gruppen - Smileys', 'Altersgruppe', '{"text": "6-10 Jahre"}'),
  ('group.smileys.schedule', 'Gruppen - Smileys', 'Trainingszeiten', '{"text": "Dienstags 17:00-18:30 Uhr\nDonnerstags 17:00-18:30 Uhr"}')
ON CONFLICT (key) DO NOTHING;

-- Group: Emotion
INSERT INTO content (key, section, description, value) VALUES
  ('group.emotion.hero.title', 'Gruppen - Emotion', 'Seitentitel', '{"text": "Emotion"}'),
  ('group.emotion.hero.subtitle', 'Gruppen - Emotion', 'Untertitel', '{"text": "Ausdrucksstarker Tanz"}'),
  ('group.emotion.about.text', 'Gruppen - Emotion', 'Beschreibungstext', '{"text": "Emotion ist unsere Gruppe für Jugendliche und junge Erwachsene, die Tanz als Ausdrucksform lieben. Wir arbeiten an anspruchsvollen Choreographien in verschiedenen Stilen - von Contemporary über Jazz bis Hip-Hop. Hier kannst du deine tänzerischen Fähigkeiten vertiefen und deine eigene Tanzpersönlichkeit entwickeln."}'),
  ('group.emotion.age', 'Gruppen - Emotion', 'Altersgruppe', '{"text": "12+ Jahre"}'),
  ('group.emotion.schedule', 'Gruppen - Emotion', 'Trainingszeiten', '{"text": "Mittwochs 18:30-20:00 Uhr\nFreitags 18:30-20:00 Uhr"}')
ON CONFLICT (key) DO NOTHING;

-- Footer & Contact
INSERT INTO content (key, section, description, value) VALUES
  ('footer.contact.address', 'Footer', 'Adresse', '{"text": "DanceMotion Eschweiler\nMusterstraße 123\n52249 Eschweiler"}'),
  ('footer.contact.email', 'Footer', 'E-Mail', '{"text": "info@dancemotion-eschweiler.de"}'),
  ('footer.contact.phone', 'Footer', 'Telefon', '{"text": "+49 2403 12345"}'),
  ('footer.social.instagram', 'Footer', 'Instagram Handle', '{"text": "@dancemotion.eschweiler"}'),
  ('footer.social.facebook', 'Footer', 'Facebook Link', '{"text": "https://facebook.com/dancemotioneschweiler"}')
ON CONFLICT (key) DO NOTHING;

-- Termine/Events Page
INSERT INTO content (key, section, description, value) VALUES
  ('events.hero.title', 'Termine', 'Seitentitel', '{"text": "Termine & Events"}'),
  ('events.hero.subtitle', 'Termine', 'Untertitel', '{"text": "Alle Auftritte, Workshops und Veranstaltungen"}'),
  ('events.intro.text', 'Termine', 'Einleitungstext', '{"text": "Hier findest du alle kommenden Auftritte unserer Tanzgruppen, geplante Workshops und besondere Events. Schau regelmäßig vorbei, um nichts zu verpassen!"}')
ON CONFLICT (key) DO NOTHING;

-- General/Misc
INSERT INTO content (key, section, description, value) VALUES
  ('general.booking.cta', 'Allgemein', 'Buchung Call-to-Action', '{"text": "Jetzt Probestunde vereinbaren!"}'),
  ('general.contact.cta', 'Allgemein', 'Kontakt Call-to-Action', '{"text": "Schreib uns eine Nachricht"}'),
  ('general.promo.text', 'Allgemein', 'Aktuelle Aktion/Promotion', '{"text": "🎉 Schnupperstunde kostenlos! Komm vorbei und lerne uns kennen."}')
ON CONFLICT (key) DO NOTHING;
