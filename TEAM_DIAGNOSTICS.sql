-- Diagnostics: Finde alle Team-Mitglieder und ihre Anzahl
SELECT 
  'Anzahl Team-Mitglieder' AS info,
  COUNT(*) AS count
FROM public.team_members;

-- Zeige alle Mitglieder
SELECT id, name, role, published, order_index FROM public.team_members ORDER BY order_index;

-- Zeige RLS Policies
SELECT schemaname, tablename, policyname, permissive, roles, qual, with_check
FROM pg_policies
WHERE tablename = 'team_members';

-- Ist RLS aktiviert?
SELECT tablename, rowsecurity
FROM pg_tables
WHERE tablename = 'team_members';
