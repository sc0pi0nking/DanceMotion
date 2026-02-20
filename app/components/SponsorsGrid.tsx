'use client';

import React, { useEffect, useState } from 'react';
import { ExternalLink } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface Sponsor {
  id: string;
  name: string;
  description?: string;
  logo_url?: string;
  website_url?: string;
  category: string;
  is_active: boolean;
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
                className="relative h-36 md:h-40 overflow-hidden flex items-center justify-center px-6"
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
                    className="max-h-24 md:max-h-28 max-w-[85%] object-contain transition-transform duration-200 group-hover:scale-105"
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
                    className="text-sm mb-4 line-clamp-2"
                    style={{ color: 'var(--body-text, var(--muted))' }}
                  >
                    {sponsor.description}
                  </p>
                )}

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
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
