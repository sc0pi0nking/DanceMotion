'use client';

import { useState } from 'react';
import { ChevronDown, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface FAQItemProps {
  question: string;
  answer: string;
  isOpen: boolean;
  onToggle: () => void;
}

function FAQItem({ question, answer, isOpen, onToggle }: FAQItemProps) {
  return (
    <div style={{ borderBottom: "1px solid var(--border)" }}>
      <button
        onClick={onToggle}
        className="w-full py-5 px-6 flex items-center justify-between text-left transition-colors"
        style={{ backgroundColor: isOpen ? "rgba(46,196,198,0.05)" : "transparent" }}
      >
        <span className="font-semibold pr-4" style={{ color: "var(--fg)" }}>
          {question}
        </span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="flex-shrink-0"
        >
          <ChevronDown size={20} style={{ color: "var(--muted)" }} />
        </motion.div>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div 
              className="px-6 pb-5 whitespace-pre-wrap"
              style={{ color: "var(--body-text, var(--muted))" }}
            >
              {answer}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

interface FAQAccordionProps {
  faqs: Array<{
    id: string;
    question: string;
    answer: string;
    category: string;
  }>;
}

const CATEGORY_LABELS: Record<string, string> = {
  allgemein: 'Allgemein',
  kurse: 'Kurse',
  anmeldung: 'Anmeldung',
  events: 'Events',
  preise: 'Preise',
};

export default function FAQAccordion({ faqs }: FAQAccordionProps) {
  const [openId, setOpenId] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Kategorien extrahieren
  const categories = ['all', ...Array.from(new Set(faqs.map(f => f.category)))];

  // Filtern nach Kategorie und Suche
  const filteredFAQs = faqs.filter(faq => {
    const matchesCategory = activeCategory === 'all' || faq.category === activeCategory;
    const matchesSearch = searchQuery === '' || 
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Search */}
      <div className="relative">
        <Search 
          className="absolute left-4 top-1/2 -translate-y-1/2" 
          size={20} 
          style={{ color: "var(--muted)" }}
        />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="FAQs durchsuchen..."
          className="w-full pl-12 pr-4 py-3 rounded-lg transition-all"
          style={{ 
            backgroundColor: "var(--panel)", 
            border: "1px solid var(--border)",
            color: "var(--fg)"
          }}
        />
      </div>

      {/* Category Tabs */}
      <div className="flex flex-wrap gap-2">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className="px-4 py-2 rounded-lg font-medium transition-all"
            style={{
              backgroundColor: activeCategory === cat ? "var(--accent)" : "var(--panel)",
              color: activeCategory === cat ? "white" : "var(--fg)",
              border: activeCategory === cat ? "none" : "1px solid var(--border)"
            }}
          >
            {cat === 'all' ? 'Alle' : CATEGORY_LABELS[cat] || cat}
            <span className="ml-2 text-xs opacity-75">
              ({cat === 'all' ? faqs.length : faqs.filter(f => f.category === cat).length})
            </span>
          </button>
        ))}
      </div>

      {/* FAQ List */}
      {filteredFAQs.length > 0 ? (
        <div 
          className="rounded-lg shadow-lg overflow-hidden"
          style={{ backgroundColor: "var(--panel)", border: "1px solid var(--border)" }}
        >
          {filteredFAQs.map((faq) => (
            <FAQItem
              key={faq.id}
              question={faq.question}
              answer={faq.answer}
              isOpen={openId === faq.id}
              onToggle={() => setOpenId(openId === faq.id ? null : faq.id)}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12" style={{ color: "var(--muted)" }}>
          <p className="text-lg">Keine FAQs gefunden</p>
          <p className="text-sm mt-2">Versuchen Sie eine andere Suche oder Kategorie</p>
        </div>
      )}
    </div>
  );
}
