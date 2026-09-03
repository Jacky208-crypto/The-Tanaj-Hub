import { createContext, useContext, useState, useEffect, useCallback } from 'react';

const ThemeContext = createContext(null);
const STORAGE_KEY = 'tanaj-theme';

export const THEMES = ['light', 'dark-navy', 'dark-charcoal', 'sepia'];

export const THEME_LABEL_KEYS = {
  light: 'theme.light',
  'dark-navy': 'theme.darkNavy',
  'dark-charcoal': 'theme.darkCharcoal',
  sepia: 'theme.sepia',
};

// Whether each theme should be treated as "dark" for icon purposes.
export const THEME_IS_DARK = {
  light: false,
  'dark-navy': true,
  'dark-charcoal': true,
  sepia: false,
};

function getInitialTheme() {
  if (typeof window === 'undefined') return 'light';
  const stored = window.localStorage.getItem(STORAGE_KEY);
  if (THEMES.includes(stored)) return stored;
  // No saved preference yet — respect the OS/browser preference for light vs dark.
  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return 'dark-navy';
  }
  return 'light';
}

export function ThemeProvider({ children }) {
  const [theme, setThemeState] = useState(getInitialTheme);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, theme);
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const setTheme = useCallback((next) => {
    if (THEMES.includes(next)) setThemeState(next);
  }, []);

  const toggleTheme = useCallback(() => {
    setThemeState((current) => (THEME_IS_DARK[current] ? 'light' : 'dark-navy'));
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme, isDark: THEME_IS_DARK[theme] }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within a ThemeProvider');
  return ctx;
}
