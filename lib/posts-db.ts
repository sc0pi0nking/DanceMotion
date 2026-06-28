import { supabase } from './supabase'

export interface Post {
  id: string
  slug: string
  title: string
  content: string
  cover_image: string | null
  tags: string[]
  published_at: string | null
  created_by: string | null
  created_at: string
  updated_at: string
}

/**
 * Public list of published posts (RLS also enforces this for the anon client).
 */
export async function fetchPublishedPosts(): Promise<Post[]> {
  const nowIso = new Date().toISOString()
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .not('published_at', 'is', null)
    .lte('published_at', nowIso)
    .order('published_at', { ascending: false })

  if (error) {
    console.error('fetchPublishedPosts error:', error)
    return []
  }
  return (data as Post[]) || []
}

/**
 * A single published post by slug, or null.
 */
export async function fetchPostBySlug(slug: string): Promise<Post | null> {
  const nowIso = new Date().toISOString()
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .eq('slug', slug)
    .not('published_at', 'is', null)
    .lte('published_at', nowIso)
    .single()

  if (error) return null
  return data as Post
}
