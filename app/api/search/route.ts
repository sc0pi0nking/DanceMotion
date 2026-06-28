import { supabase } from '@/lib/supabase'

export interface SearchResult {
  type: 'event' | 'post' | 'group' | 'faq'
  title: string
  subtitle: string
  href: string
}

// GET /api/search?q=... — seitenweite Suche über Events, Posts, Gruppen, FAQs
export async function GET(req: Request) {
  try {
    const url = new URL(req.url)
    const raw = (url.searchParams.get('q') || '').trim()

    // Eingabe entschärfen: ILIKE-Wildcards und PostgREST-or()-Trennzeichen entfernen
    const term = raw.replace(/[,()%_*]/g, ' ').trim()
    if (term.length < 2) {
      return Response.json({ results: [] })
    }

    const like = `%${term}%`
    const nowIso = new Date().toISOString()

    const [events, posts, groups, faqs] = await Promise.all([
      supabase
        .from('events')
        .select('id,title,date,city,category,href')
        .eq('is_published', true)
        .or(`title.ilike.${like},location.ilike.${like},city.ilike.${like},note.ilike.${like}`)
        .order('date', { ascending: false })
        .limit(5),
      supabase
        .from('posts')
        .select('id,slug,title')
        .not('published_at', 'is', null)
        .lte('published_at', nowIso)
        .or(`title.ilike.${like},content.ilike.${like}`)
        .order('published_at', { ascending: false })
        .limit(5),
      supabase
        .from('groups')
        .select('slug,name,short_desc')
        .eq('is_active', true)
        .or(`name.ilike.${like},short_desc.ilike.${like}`)
        .limit(5),
      supabase
        .from('faqs')
        .select('id,question,answer')
        .eq('published', true)
        .or(`question.ilike.${like},answer.ilike.${like}`)
        .limit(5),
    ])

    const results: SearchResult[] = []

    for (const e of events.data || []) {
      results.push({
        type: 'event',
        title: e.title,
        subtitle: [e.category, e.city, e.date].filter(Boolean).join(' · '),
        href: e.href || '/termine',
      })
    }
    for (const p of posts.data || []) {
      results.push({
        type: 'post',
        title: p.title,
        subtitle: 'News',
        href: `/news/${p.slug}`,
      })
    }
    for (const g of groups.data || []) {
      results.push({
        type: 'group',
        title: g.name,
        subtitle: g.short_desc || 'Tanzgruppe',
        href: `/gruppen/${g.slug}`,
      })
    }
    for (const f of faqs.data || []) {
      results.push({
        type: 'faq',
        title: f.question,
        subtitle: 'FAQ',
        href: '/faq',
      })
    }

    return Response.json({ results })
  } catch (error) {
    console.error('GET /api/search error:', error)
    return Response.json({ error: 'Suche fehlgeschlagen' }, { status: 500 })
  }
}
