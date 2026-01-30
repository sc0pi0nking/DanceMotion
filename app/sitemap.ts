import { MetadataRoute } from 'next';
import { supabaseServer } from '@/lib/supabase';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://dancemotion.org';

  // Base routes
  const baseRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/gruppen`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/termine`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/galerie`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/faq`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/team`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/sponsor`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/impressum`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/datenschutz`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
  ];

  try {
    // Fetch group routes
    const { data: groups } = await supabaseServer
      .from('event_groups')
      .select('slug, updated_at')
      .eq('is_active', true);

    const groupRoutes: MetadataRoute.Sitemap = (groups || []).map((group: any) => ({
      url: `${baseUrl}/gruppen/${group.slug}`,
      lastModified: new Date(group.updated_at),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }));

    // Fetch event routes (limit to 50 most recent)
    const { data: events } = await supabaseServer
      .from('events')
      .select('id, updated_at')
      .eq('is_active', true)
      .order('date', { ascending: false })
      .limit(50);

    const eventRoutes: MetadataRoute.Sitemap = (events || []).map((event: any) => ({
      url: `${baseUrl}/termine/${event.id}`,
      lastModified: new Date(event.updated_at),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    }));

    return [...baseRoutes, ...groupRoutes, ...eventRoutes];
  } catch (error) {
    console.error('Sitemap generation error:', error);
    return baseRoutes;
  }
}
