import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { translations } from '../i18n/translations';

const LanguageContext = createContext(null);
const STORAGE_KEY = 'tanaj-language';

export const LANGUAGES = ['english', 'spanish', 'hebrew'];
export const LANGUAGE_LABELS = { english: 'English', spanish: 'Español', hebrew: 'עברית' };
export const LANGUAGE_CODES = { english: 'EN', spanish: 'ES', hebrew: 'HE' };

function getInitialLanguage() {
  if (typeof window === 'undefined') return 'english';
  const stored = window.localStorage.getItem(STORAGE_KEY);
  return LANGUAGES.includes(stored) ? stored : 'english';
}

function resolve(dict, path) {
  return path.split('.').reduce((acc, key) => (acc == null ? acc : acc[key]), dict);
}

export function LanguageProvider({ children }) {
  const [language, setLanguageState] = useState(getInitialLanguage);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, language);
    document.documentElement.lang = language === 'hebrew' ? 'he' : language === 'spanish' ? 'es' : 'en';
  }, [language]);

  const setLanguage = useCallback((lang) => {
    if (LANGUAGES.includes(lang)) setLanguageState(lang);
  }, []);

  const t = useCallback((key, params) => {
    let value = resolve(translations[language], key);
    if (value === undefined) value = resolve(translations.english, key);
    if (typeof value === 'function') return value(params || {});
    return value ?? key;
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used within a LanguageProvider');
  return ctx;
}
