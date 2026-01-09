import { supabase } from './supabase'

export interface ContentItem {
  key: string
  value: any
  section?: string
  description?: string
}

/**
 * Load content from database with fallback to default value
 */
export async function loadContent(key: string, defaultValue: string): Promise<string> {
  try {
    const { data, error } = await supabase
      .from('content')
      .select('value')
      .eq('key', key)
      .single()

    if (error || !data) {
      return defaultValue
    }

    // Handle both JSONB {text: "..."} and plain string values
    if (typeof data.value === 'string') {
      return data.value
    }
    if (data.value?.text) {
      return data.value.text
    }
    
    return defaultValue
  } catch (error) {
    console.error('Failed to load content:', error)
    return defaultValue
  }
}

/**
 * Load multiple content items at once
 */
export async function loadContentBatch(keys: string[]): Promise<Record<string, string>> {
  try {
    const { data, error } = await supabase
      .from('content')
      .select('key, value')
      .in('key', keys)

    if (error || !data) {
      return {}
    }

    const result: Record<string, string> = {}
    data.forEach((item) => {
      const value = typeof item.value === 'string' 
        ? item.value 
        : item.value?.text || ''
      result[item.key] = value
    })

    return result
  } catch (error) {
    console.error('Failed to load content batch:', error)
    return {}
  }
}
