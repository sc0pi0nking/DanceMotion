'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
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

  if (loading) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Sponsoren werden geladen...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2 justify-center">
        {categories.map((cat) => (
          <button
            key={cat.value || 'all'}
            onClick={() => setSelectedCategory(cat.value)}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              selectedCategory === cat.value
                ? 'bg-accent text-accent-foreground'
                : 'bg-card border border-border text-foreground hover:border-accent'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Sponsors Grid */}
      {filteredSponsors.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            Keine Sponsoren in dieser Kategorie vorhanden.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSponsors.map((sponsor) => (
            <a
              key={sponsor.id}
              href={sponsor.website_url || '#'}
              target={sponsor.website_url ? '_blank' : undefined}
              rel={sponsor.website_url ? 'noopener noreferrer' : undefined}
              className={`group h-full ${sponsor.website_url ? 'cursor-pointer' : ''}`}
            >
              <div className={`h-full flex flex-col bg-card border border-border rounded-lg overflow-hidden transition-all ${
                sponsor.website_url
                  ? 'hover:border-accent hover:shadow-lg'
                  : ''
              }`}>
                {/* Logo Area */}
                <div className="relative h-40 bg-muted/30 flex items-center justify-center overflow-hidden">
                  {sponsor.logo_url ? (
                    <Image
                      src={sponsor.logo_url}
                      alt={sponsor.name}
                      fill
                      className="object-contain p-4 group-hover:scale-105 transition-transform"
                    />
                  ) : (
                    <div className="text-4xl text-muted-foreground font-bold">
                      {sponsor.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 p-6 flex flex-col">
                  <h3 className="text-lg font-semibold mb-2 group-hover:text-accent transition-colors">
                    {sponsor.name}
                  </h3>

                  <span className="inline-block w-fit text-xs bg-accent/20 text-accent px-2 py-1 rounded mb-3">
                    {sponsor.category === 'venue' && 'Veranstaltungsort'}
                    {sponsor.category === 'equipment' && 'Ausrüstung'}
                    {sponsor.category === 'media' && 'Medien'}
                    {sponsor.category === 'partner' && 'Partner'}
                    {sponsor.category === 'general' && 'Sponsor'}
                  </span>

                  {sponsor.description && (
                    <p className="text-sm text-muted-foreground flex-1">
                      {sponsor.description}
                    </p>
                  )}

                  {sponsor.website_url && (
                    <div className="mt-4 text-sm text-accent font-medium">
                      Website besuchen →
                    </div>
                  )}
                </div>
              </div>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
