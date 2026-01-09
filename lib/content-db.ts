import { supabase } from '@/lib/supabase'
import type { ContentItem } from '@/lib/supabase'

/**
 * Fetch single content item by key
 */
export async function fetchContent(key: string): Promise<string | null> {
  try {
    const { data, error } = await supabase
      .from('content')
      .select('value')
      .eq('key', key)
      .single()

    if (error) {
      console.warn(`Content not found: ${key}`)
      return null
    }

    return data?.value?.text || null
  } catch (error) {
    console.error(`Failed to fetch content ${key}:`, error)
    return null
  }
}

/**
 * Fetch all content items by section
 */
export async function fetchContentBySection(section: string): Promise<ContentItem[]> {
  try {
    const { data, error } = await supabase
      .from('content')
      .select('*')
      .eq('section', section)
      .order('key')

    if (error) {
      console.error(`Error fetching content for section ${section}:`, error)
      return []
    }

    return data || []
  } catch (error) {
    console.error(`Failed to fetch content section ${section}:`, error)
    return []
  }
}

/**
 * Fetch all content items
 */
export async function fetchAllContent(): Promise<ContentItem[]> {
  try {
    const { data, error } = await supabase
      .from('content')
      .select('*')
      .order('section')
      .order('key')

    if (error) {
      console.error('Error fetching all content:', error)
      return []
    }

    return data || []
  } catch (error) {
    console.error('Failed to fetch all content:', error)
    return []
  }
}
