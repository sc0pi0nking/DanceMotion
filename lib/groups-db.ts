import { supabase } from './supabase'

/** Tanzgruppe aus der DB (Tabelle `groups`, Sprint 2). Ersetzt hardcoded lib/site-data.ts. */
export interface Group {
  id: string
  slug: string
  name: string
  short_desc: string | null
  logo_url: string | null
  color: string
  sort_order: number
  is_active: boolean
  created_at: string
  updated_at: string
}

/** Alle aktiven Gruppen, sortiert nach sort_order. */
export async function fetchActiveGroups(): Promise<Group[]> {
  try {
    const { data, error } = await supabase
      .from('groups')
      .select('*')
      .eq('is_active', true)
      .order('sort_order', { ascending: true })

    if (error) {
      console.error('Error fetching groups:', error)
      return []
    }
    return data || []
  } catch (error) {
    console.error('Failed to fetch groups:', error)
    return []
  }
}

/** Eine aktive Gruppe per slug, oder null wenn nicht vorhanden. */
export async function fetchGroupBySlug(slug: string): Promise<Group | null> {
  try {
    const { data, error } = await supabase
      .from('groups')
      .select('*')
      .eq('slug', slug)
      .eq('is_active', true)
      .single()

    if (error || !data) {
      return null
    }
    return data
  } catch (error) {
    console.error('Failed to fetch group:', error)
    return null
  }
}
