'use client';

import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import {
  SUPPORTED_LANGUAGES,
  I18N_DICTIONARY,
  type LanguageCode,
  type LangUI,
} from '@/lib/languages';
import {
  NAV_I18N,
  DASHBOARD_I18N,
  QUEUE_I18N,
  type NavStrings,
  type DashboardStrings,
  type QueueStrings,
} from '@/lib/dashboard-i18n';

export interface FullTranslation extends LangUI {
  nav: NavStrings;
  dashboard: DashboardStrings;
  queue: QueueStrings;
}

interface LanguageContextType {
  lang: LanguageCode;
  setLang: (lang: LanguageCode) => void;
  t: FullTranslation;
}

export function getFullTranslation(lang: LanguageCode): FullTranslation {
  const base = I18N_DICTIONARY[lang] || I18N_DICTIONARY['hi-IN'];
  const nav = NAV_I18N[lang] || NAV_I18N['hi-IN'];
  const dashboard = DASHBOARD_I18N[lang] || DASHBOARD_I18N['hi-IN'];
  const queue = QUEUE_I18N[lang] || QUEUE_I18N['hi-IN'];

  return {
    ...base,
    nav,
    dashboard,
    queue,
  };
}

const defaultContext: LanguageContextType = {
  lang: 'hi-IN',
  setLang: () => {},
  t: getFullTranslation('hi-IN'),
};

const LanguageContext = createContext<LanguageContextType>(defaultContext);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<LanguageCode>('hi-IN');

  useEffect(() => {
    try {
      const saved = localStorage.getItem('votermitra_lang') as LanguageCode;
      if (saved && I18N_DICTIONARY[saved]) {
        setLangState(saved);
      }
    } catch {
      // Ignore
    }

    const handleStorage = (e: StorageEvent) => {
      if (e.key === 'votermitra_lang' && e.newValue && I18N_DICTIONARY[e.newValue as LanguageCode]) {
        setLangState(e.newValue as LanguageCode);
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const setLang = (newLang: LanguageCode) => {
    setLangState(newLang);
    try {
      localStorage.setItem('votermitra_lang', newLang);
      document.cookie = `votermitra_lang=${newLang}; path=/; max-age=31536000; SameSite=Lax`;
    } catch {
      // Ignore
    }
  };

  const t = getFullTranslation(lang);

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
