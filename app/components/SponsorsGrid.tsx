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
      <div className="text-center py-20">
        <p className="text-gray-500 dark:text-gray-400 text-lg">
          Noch keine Sponsoren vorhanden.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Filter Tabs */}
      {sponsors.length > 3 && (
        <div className="flex flex-wrap gap-2 justify-center">
          {categories.map((cat) => (
            <button
              key={cat.value || 'all'}
              onClick={() => setSelectedCategory(cat.value)}
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                selectedCategory === cat.value
                  ? 'bg-gradient-to-r from-teal-500 to-cyan-500 text-white shadow-lg shadow-teal-500/30'
                  : 'bg-slate-800/50 text-gray-300 hover:bg-slate-700/50 border border-slate-700/50'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      )}

      {/* Sponsors Grid */}
      {filteredSponsors.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400">
            Keine Sponsoren in dieser Kategorie.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSponsors.map((sponsor) => (
            <div
              key={sponsor.id}
              className="group bg-white dark:bg-slate-800/50 rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-slate-200 dark:border-slate-700/50"
            >
              {/* Logo Area */}
              <div 
                className="relative h-40 overflow-hidden flex items-center justify-center"
                style={{ 
                  backgroundColor: "var(--panel, #1e293b)", 
                  backgroundImage: "linear-gradient(135deg, rgba(46,196,198,0.1), rgba(46,196,198,0.05))" 
                }}
              >
                {sponsor.logo_url ? (
                  <img
                    src={sponsor.logo_url}
                    alt={sponsor.name}
                    className="max-h-28 max-w-[80%] object-contain group-hover:scale-110 transition-transform duration-300"
                  />
                ) : (
                  <div className="text-5xl font-bold text-teal-400/30">
                    {sponsor.name.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="flex items-start justify-between gap-2 mb-3">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-teal-500 transition-colors">
                    {sponsor.name}
                  </h3>
                  <span className="flex-shrink-0 text-xs px-2 py-1 rounded-full bg-teal-500/10 text-teal-400 border border-teal-500/20">
                    {getCategoryLabel(sponsor.category)}
                  </span>
                </div>

                {sponsor.description && (
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                    {sponsor.description}
                  </p>
                )}

                {sponsor.website_url && (
                  <a
                    href={sponsor.website_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm font-medium text-teal-500 hover:text-teal-400 transition-colors"
                  >
                    Website besuchen
                    <ExternalLink className="w-4 h-4" />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
