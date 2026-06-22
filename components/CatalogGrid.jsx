'use client';

import { useState, useMemo } from 'react';
import { getProductImageUrl } from '../lib/supabaseClient';
import { useLanguage } from '../lib/LanguageContext';
import { translations, translateCategory, materials } from '../lib/translations';

export default function CatalogGrid({ products, categories }) {
  const [activeCategory, setActiveCategory] = useState('all');
  const [glossaryOpen, setGlossaryOpen] = useState(false);
  const { lang } = useLanguage();
  const t = translations[lang];

  const filtered = useMemo(() => {
    if (activeCategory === 'all') return products;
    return products.filter((p) => p.category_id === activeCategory);
  }, [products, activeCategory]);

  return (
    <>
      <div className="filter-row">
        <button
          className={`filter-chip ${activeCategory === 'all' ? 'active' : ''}`}
          onClick={() => setActiveCategory('all')}
        >
          {t.filterAll}
        </button>
        {categories.map((cat) => (
          <button
            key={cat.id}
            className={`filter-chip ${activeCategory === cat.id ? 'active' : ''}`}
            onClick={() => setActiveCategory(cat.id)}
          >
            {translateCategory(cat.name, lang)}
          </button>
        ))}
      </div>

      <div className="glossary-bar">
        <button className="glossary-toggle" onClick={() => setGlossaryOpen((o) => !o)}>
          <em className="glossary-toggle-arrow">{glossaryOpen ? '▴' : '▾'}</em>
          {t.glossaryToggle}
        </button>
        {glossaryOpen && (
          <div className="glossary-panel">
            <dl>
              {materials.map(({ abbr, en, th: thDef }) => (
                <>
                  <dt key={abbr}>{abbr}</dt>
                  <dd key={abbr + '-def'}>{lang === 'th' ? thDef : en}</dd>
                </>
              ))}
            </dl>
          </div>
        )}
      </div>

      {filtered.length === 0 ? (
        <div className="empty-state">{t.emptyCategory}</div>
      ) : (
        <div className="grid">
          {filtered.map((p) => {
            const imagePath = p.product_images?.[0]?.storage_path;
            const imageUrl = getProductImageUrl(imagePath);
            return (
              <div className="card" key={p.id}>
                <div className="card-image">
                  {imageUrl ? (
                    <img src={imageUrl} alt={p.item_code} loading="lazy" />
                  ) : (
                    <span style={{ fontSize: 12, color: 'var(--accent)' }}>{t.noImage}</span>
                  )}
                </div>
                <div className="card-body">
                  <span className="card-code">{p.item_code}</span>
                  <span className="card-meta">
                    {[p.capacity, p.material].filter(Boolean).join(' · ')}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}
