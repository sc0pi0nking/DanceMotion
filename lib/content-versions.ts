import { supabaseServer } from '@/lib/supabase'

const MAX_VERSIONS_PER_KEY = 20

export interface ContentVersion {
  id: string
  content_key: string
  value: { text?: string } | null
  section: string | null
  updated_by: string | null
  created_at: string
}

/**
 * Schreibt den AKTUELLEN Content-Wert eines Keys als Snapshot in die Historie,
 * BEVOR er überschrieben wird. Danach werden alte Versionen über das Limit hinaus
 * entfernt. Fehler werden geschluckt (Versionierung darf ein Save nie blockieren).
 */
export async function snapshotContentVersion(key: string): Promise<void> {
  try {
    const { data: current, error } = await supabaseServer
      .from('content')
      .select('value, section, updated_by')
      .eq('key', key)
      .single()

    // Kein bestehender Eintrag -> nichts zu sichern (erster Save des Keys)
    if (error || !current) return

    await supabaseServer.from('content_versions').insert({
      content_key: key,
      value: current.value ?? null,
      section: current.section ?? null,
      updated_by: current.updated_by ?? null,
    })

    // Historie auf die neuesten N Einträge begrenzen
    const { data: keep } = await supabaseServer
      .from('content_versions')
      .select('id')
      .eq('content_key', key)
      .order('created_at', { ascending: false })
      .range(MAX_VERSIONS_PER_KEY, MAX_VERSIONS_PER_KEY + 1000)

    if (keep && keep.length > 0) {
      await supabaseServer
        .from('content_versions')
        .delete()
        .in('id', keep.map((v) => v.id))
    }
  } catch (err) {
    console.error(`snapshotContentVersion(${key}) failed:`, err)
  }
}

/**
 * Liefert die Versionshistorie eines Keys, neueste zuerst.
 */
export async function fetchContentVersions(key: string): Promise<ContentVersion[]> {
  const { data, error } = await supabaseServer
    .from('content_versions')
    .select('*')
    .eq('content_key', key)
    .order('created_at', { ascending: false })
    .limit(MAX_VERSIONS_PER_KEY)

  if (error) {
    console.error(`fetchContentVersions(${key}) failed:`, error)
    return []
  }

  return (data as ContentVersion[]) ?? []
}
