'use client';

import React, { useEffect, useState } from 'react';
import { ExternalLink, Instagram, Facebook } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface Sponsor {
  id: string;
  name: string;
  description?: string;
  logo_url?: string;
  website_url?: string;
  category: string;
  is_active: boolean;
  social_links?: {
    instagram?: string;
    facebook?: string;
    tiktok?: string;
    youtube?: string;
  };
}

export default function SponsorsGrid() {
  const [sponsors, setSponsors] = useState<Sponsor[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const categories = [
    { value: null, label: 'Alle' },
    { value: 'venue', label: 'Veranstaltungsorte' },
    { value: 'equipment', label: 'Ausrüstung' },
    { value: 'media', label: 'Medien' },
    { value: 'partner', label: 'Partner' },
    { value: 'general', label: 'Sonstige' },
  ];

  useEffect(() => {
    fetchSponsors();
  }, []);

  const fetchSponsors = async () => {
    try {
      const { data, error } = await supabase
        .from('sponsors')
        .select('*')
        .eq('is_active', true)
        .order('sort_order', { ascending: true })
        .order('created_at', { ascending: false });

      if (error) throw error;
      setSponsors(data || []);
    } catch (error) {
      console.error('Error fetching sponsors:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredSponsors = selectedCategory
    ? sponsors.filter((s) => s.category === selectedCategory)
    : sponsors;

  const sponsorCountLabel = `${filteredSponsors.length} ${filteredSponsors.length === 1 ? 'Eintrag' : 'Einträge'}`;

  const getCategoryLabel = (category: string) => {
    const cat = categories.find(c => c.value === category);
    return cat?.label || 'Sponsor';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-2 border-teal-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (sponsors.length === 0) {
    return (
      <div
        className="text-center py-12 md:py-16 rounded-2xl border"
        style={{ backgroundColor: 'var(--panel)', borderColor: 'var(--border)' }}
      >
        <p className="text-lg" style={{ color: 'var(--muted)' }}>
          Noch keine Sponsoren vorhanden.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Filter Tabs */}
      {sponsors.length > 3 && (
        <div className="space-y-3">
          <p className="text-sm text-center" style={{ color: 'var(--muted)' }}>
            Kategorie filtern
          </p>
          <div className="flex flex-wrap gap-2 justify-center">
          {categories.map((cat) => (
            <button
              key={cat.value || 'all'}
              onClick={() => setSelectedCategory(cat.value)}
              aria-pressed={selectedCategory === cat.value}
              aria-label={cat.value ? `Sponsoren nach Kategorie ${cat.label} filtern` : 'Alle Sponsoren anzeigen'}
              className="px-4 py-2 rounded-xl font-medium transition-all duration-200 hover:opacity-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
              style={{
                backgroundColor: selectedCategory === cat.value ? 'var(--accent)' : 'var(--panel)',
                color: selectedCategory === cat.value ? 'white' : 'var(--fg)',
                border: selectedCategory === cat.value ? '1px solid transparent' : '1px solid var(--border)',
                boxShadow:
                  selectedCategory === cat.value
                    ? '0 8px 18px rgba(46,196,198,0.24)'
                    : '0 2px 8px rgba(0,0,0,0.05)',
              }}
            >
              {cat.label}
            </button>
          ))}
          </div>
          <p className="text-xs text-center" style={{ color: 'var(--muted)' }}>
            {sponsorCountLabel}
          </p>
        </div>
      )}

      {/* Sponsors Grid */}
      {filteredSponsors.length === 0 ? (
        <div className="text-center py-12 rounded-2xl border" style={{ backgroundColor: 'var(--panel)', borderColor: 'var(--border)' }}>
          <p style={{ color: 'var(--muted)' }}>
            Keine Sponsoren in dieser Kategorie.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
          {filteredSponsors.map((sponsor) => (
            <article
              key={sponsor.id}
              className="group rounded-3xl overflow-hidden border transition-all duration-200 hover:-translate-y-1 focus-within:-translate-y-1"
              style={{
                backgroundColor: 'var(--panel)',
                borderColor: 'var(--border)',
                boxShadow: 'var(--card-shadow)',
              }}
            >
              {/* Logo Area */}
              <div
                className="relative h-44 md:h-48 overflow-hidden flex items-center justify-center px-4"
                style={{
                  backgroundColor: 'var(--panel, #1e293b)',
                  backgroundImage: 'linear-gradient(135deg, rgba(46,196,198,0.14), rgba(46,196,198,0.04))',
                }}
              >
                <div
                  className="pointer-events-none absolute inset-x-0 bottom-0 h-px"
                  style={{ backgroundColor: 'rgba(46,196,198,0.25)' }}
                />
                {sponsor.logo_url ? (
                  <img
                    src={sponsor.logo_url}
                    alt={sponsor.name}
                    loading="lazy"
                    decoding="async"
                    className="h-full w-full max-h-full max-w-full object-contain p-4 transition-transform duration-200 group-hover:scale-105"
                  />
                ) : (
                  <div
                    className="w-16 h-16 rounded-full flex items-center justify-center text-3xl font-bold"
                    style={{
                      color: 'var(--accent)',
                      backgroundColor: 'rgba(46,196,198,0.12)',
                      border: '1px solid rgba(46,196,198,0.25)',
                    }}
                  >
                    {sponsor.name.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="flex items-start justify-between gap-2 mb-3">
                  <h3
                    className="text-lg font-bold transition-colors"
                    style={{ color: 'var(--fg)' }}
                  >
                    {sponsor.name}
                  </h3>
                  <span
                    className="flex-shrink-0 text-xs px-2 py-1 rounded-full"
                    style={{
                      backgroundColor: 'rgba(46,196,198,0.1)',
                      color: 'var(--accent)',
                      border: '1px solid rgba(46,196,198,0.2)',
                    }}
                  >
                    {getCategoryLabel(sponsor.category)}
                  </span>
                </div>

                {sponsor.description && (
                  <p
                    className="text-sm mb-4"
                    style={{ color: 'var(--body-text, var(--muted))' }}
                  >
                    {sponsor.description}
                  </p>
                )}

                {/* Links Row */}
                <div className="flex items-center gap-3 flex-wrap">
                  {sponsor.website_url && (
                    <a
                      href={sponsor.website_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`Website von ${sponsor.name} besuchen (öffnet in neuem Tab)`}
                      className="inline-flex items-center gap-2 text-sm font-semibold transition-colors hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
                      style={{ color: 'var(--accent-dark, var(--accent))' }}
                    >
                      Website besuchen
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  )}

                  {/* Social Icons */}
                  {sponsor.social_links && Object.values(sponsor.social_links).some(Boolean) && (
                    <div className="flex items-center gap-2 ml-auto">
                      {sponsor.social_links.instagram && (
                        <a href={sponsor.social_links.instagram} target="_blank" rel="noopener noreferrer" aria-label={`${sponsor.name} auf Instagram`} className="transition-colors hover:opacity-80" style={{ color: 'var(--muted)' }}>
                          <Instagram className="w-5 h-5 hover:text-pink-400 transition-colors" />
                        </a>
                      )}
                      {sponsor.social_links.facebook && (
                        <a href={sponsor.social_links.facebook} target="_blank" rel="noopener noreferrer" aria-label={`${sponsor.name} auf Facebook`} className="transition-colors hover:opacity-80" style={{ color: 'var(--muted)' }}>
                          <Facebook className="w-5 h-5 hover:text-blue-400 transition-colors" />
                        </a>
                      )}
                      {sponsor.social_links.tiktok && (
                        <a href={sponsor.social_links.tiktok} target="_blank" rel="noopener noreferrer" aria-label={`${sponsor.name} auf TikTok`} className="transition-colors hover:opacity-80" style={{ color: 'var(--muted)' }}>
                          <svg className="w-5 h-5 hover:text-slate-100 transition-colors" viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 00-.79-.05A6.34 6.34 0 003.15 15.2a6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.34-6.34V8.73a8.19 8.19 0 004.76 1.52V6.8a4.84 4.84 0 01-1-.11z"/></svg>
                        </a>
                      )}
                      {sponsor.social_links.youtube && (
                        <a href={sponsor.social_links.youtube} target="_blank" rel="noopener noreferrer" aria-label={`${sponsor.name} auf YouTube`} className="transition-colors hover:opacity-80" style={{ color: 'var(--muted)' }}>
                          <svg className="w-5 h-5 hover:text-red-400 transition-colors" viewBox="0 0 24 24" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
                        </a>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
