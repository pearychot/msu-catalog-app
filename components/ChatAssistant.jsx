'use client';

import { useState, useRef, useEffect } from 'react';
import { getProductImageUrl } from '../lib/supabaseClient';
import { translations } from '../lib/translations';
import { useLanguage } from '../lib/LanguageContext';

export default function ChatAssistant() {
  const { lang } = useLanguage();
  const t = translations[lang];

  const [messages, setMessages] = useState([
    { role: 'assistant', content: translations.en.greeting, products: [], mockup: null },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [logoDataUrl, setLogoDataUrl] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const endRef = useRef(null);
  const fileInputRef = useRef(null);
  const menuRef = useRef(null);
  const textareaRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  useEffect(() => {
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Reset textarea height when input is cleared after send.
  useEffect(() => {
    if (input === '' && textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  }, [input]);

  // When the site-wide language changes, swap the greeting text if the
  // conversation hasn't started yet (still just the initial message).
  useEffect(() => {
    setMessages((prev) => {
      if (prev.length === 1 && prev[0].role === 'assistant') {
        return [{ ...prev[0], content: translations[lang].greeting }];
      }
      return prev;
    });
  }, [lang]);

  function handleLogoUpload(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setLogoDataUrl(reader.result);
    reader.readAsDataURL(file);
    setMenuOpen(false);
  }

  async function handleSend() {
    const text = input.trim();
    if (!text || loading) return;

    const nextMessages = [...messages, { role: 'user', content: text, products: [], mockup: null }];
    setMessages(nextMessages);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: nextMessages.map((m) => ({ role: m.role, content: m.content })),
          logo_base64: logoDataUrl,
          language: lang,
        }),
      });
      const data = await res.json();
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: data.reply, products: data.products || [], mockup: data.mockup_base64 || null },
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: t.errorReply, products: [], mockup: null },
      ]);
    } finally {
      setLoading(false);
    }
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  return (
    <div className="chat-panel">
      <div className="chat-thread">
        {messages.map((m, i) => (
          <div key={i} className={`chat-message ${m.role}`}>
            <div className="chat-bubble">{m.content}</div>

            {m.mockup && (
              <div className="chat-mockup-result">
                <img src={m.mockup} alt={t.mockupAlt} />
              </div>
            )}

            {m.products.length > 0 && (
              <div className="chat-products">
                {m.products.map((p) => {
                  const imageUrl = getProductImageUrl(p.product_images?.[0]?.storage_path);
                  return (
                    <div className="chat-product-card" key={p.id}>
                      <div className="chat-product-image">
                        {imageUrl ? (
                          <img src={imageUrl} alt={p.item_code} />
                        ) : (
                          <span className="no-image">{t.noImage}</span>
                        )}
                      </div>
                      <div className="chat-product-body">
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
          </div>
        ))}
        {loading && (
          <div className="chat-message assistant">
            <div className="chat-bubble chat-loading">{t.thinking}</div>
          </div>
        )}
        <div ref={endRef} />
      </div>

      {logoDataUrl && (
        <div className="chat-attachment-chip">
          <img src={logoDataUrl} alt="" />
          <span>{t.logoAttached}</span>
          <button onClick={() => setLogoDataUrl(null)}>{t.removeAttachment}</button>
        </div>
      )}

      <div className="chat-input-row">
        <div className="chat-attach-wrapper" ref={menuRef}>
          <button
            className="chat-attach-btn"
            onClick={() => setMenuOpen((o) => !o)}
            aria-label={t.uploadLogo}
            type="button"
          >
            +
          </button>
          {menuOpen && (
            <div className="chat-attach-menu">
              <button onClick={() => fileInputRef.current?.click()}>{t.uploadLogo}</button>
            </div>
          )}
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleLogoUpload}
          style={{ display: 'none' }}
        />

        <textarea
          ref={textareaRef}
          className="chat-input"
          placeholder={t.placeholder}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          onInput={(e) => {
            e.target.style.height = 'auto';
            e.target.style.height = e.target.scrollHeight + 'px';
          }}
          rows={1}
        />
        <button className="chat-send" onClick={handleSend} disabled={loading}>
          {t.send}
        </button>
      </div>
    </div>
  );
}
