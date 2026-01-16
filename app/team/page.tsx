'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Instagram, Facebook, Mail } from 'lucide-react';
import Image from 'next/image';
import { supabase } from '@/lib/supabase';

interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio?: string;
  image_url?: string;
  social_links?: {
    instagram?: string;
    facebook?: string;
    email?: string;
  };
}

export default function TeamPage() {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    try {
      console.log('📥 Loading team members...');
      const { data, error } = await supabase
        .from('team_members')
        .select('*')
        .eq('published', true)
        .order('order_index', { ascending: true });

      if (error) {
        console.error('❌ Error:', error);
        throw error;
      }
      
      console.log('✅ Loaded:', data?.length || 0, 'members');
      setMembers(data || []);
    } catch (error) {
      console.error('Failed to load team members:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500 dark:text-gray-400">Lädt Team...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-16">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Unser Team
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Lerne die Menschen kennen, die DanceMotion zu dem machen, was es ist – 
            Leidenschaft, Energie und Professionalität.
          </p>
        </motion.div>

        {/* Team Grid */}
        {members.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 dark:text-gray-400">Keine Team-Mitglieder vorhanden</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {members.map((member, index) => (
              <motion.div
                key={member.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="group"
              >
                <div className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
                {/* Image */}
                <div className="relative h-80 overflow-hidden" style={{ backgroundColor: "var(--panel)", backgroundImage: "linear-gradient(135deg, rgba(46,196,198,0.2), rgba(46,196,198,0.08))" }}>
                  {member.image_url ? (
                    <Image
                      src={member.image_url}
                      alt={member.name}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  ) : (
                    <div className="h-full flex items-center justify-center">
                      <div className="w-32 h-32 rounded-full flex items-center justify-center" style={{ backgroundColor: "rgba(46,196,198,0.2)" }}>
                        <span className="text-6xl font-bold" style={{ color: "var(--accent)" }}>
                          {member.name.charAt(0)}
                        </span>
                      </div>
                    </div>
                  )}
                  
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                    {member.name}
                  </h3>
                  <p className="text-blue-600 dark:text-blue-400 font-medium mb-3">
                    {member.role}
                  </p>
                  
                  {member.bio && (
                    <p className="text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
                      {member.bio}
                    </p>
                  )}

                  {/* Social Links */}
                  {member.social_links && Object.keys(member.social_links).length > 0 && (
                    <div className="flex gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                      {member.social_links.instagram && (
                        <a
                          href={`https://instagram.com/${member.social_links.instagram}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-3 bg-gradient-to-br from-purple-500 to-pink-500 text-white rounded-lg hover:shadow-lg transform hover:scale-110 transition-all duration-300"
                          title="Instagram"
                        >
                          <Instagram size={20} />
                        </a>
                      )}
                      {member.social_links.facebook && (
                        <a
                          href={`https://facebook.com/${member.social_links.facebook}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-3 bg-blue-600 text-white rounded-lg hover:shadow-lg transform hover:scale-110 transition-all duration-300"
                          title="Facebook"
                        >
                          <Facebook size={20} />
                        </a>
                      )}
                      {member.social_links.email && (
                        <a
                          href={`mailto:${member.social_links.email}`}
                          className="p-3 bg-gray-600 text-white rounded-lg hover:shadow-lg transform hover:scale-110 transition-all duration-300"
                          title="E-Mail"
                        >
                          <Mail size={20} />
                        </a>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
          </div>
        )}
      </div>
    </div>
  );
}
