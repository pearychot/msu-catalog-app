'use client';

import { useLanguage } from '../lib/LanguageContext';
import { translations } from '../lib/translations';

export default function SiteHeader({ productCount }) {
  const { lang, setLang } = useLanguage();
  const t = translations[lang];

  return (
    <header className="site-header">
      <div className="site-header-left">
        <img src="/msu-logo.png" alt="M.S. Union" className="site-logo" />
        <div>
          <h1>M.S. Union — {t.siteTagline}</h1>
        </div>
      </div>
      <div className="site-header-right">
        <span className="tagline">{t.productsCount(productCount)}</span>
        <div className="lang-toggle">
          <button className={lang === 'en' ? 'active' : ''} onClick={() => setLang('en')}>
            EN
          </button>
          <button className={lang === 'th' ? 'active' : ''} onClick={() => setLang('th')}>
            ไทย
          </button>
        </div>
      </div>
    </header>
  );
}
