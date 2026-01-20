'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback, useMemo } from 'react';


import { Locale, locales, defaultLocale, messages, getNestedValue } from './i18n-shared';

// Context
interface I18nContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string) => string;
}

const I18nContext = createContext<I18nContextType | null>(null);

// Get locale from cookie
function getLocaleFromCookie(): Locale {
  if (typeof window === 'undefined') return defaultLocale;
  
  const match = document.cookie.match(/NEXT_LOCALE=([^;]+)/);
  const locale = match?.[1] as Locale | undefined;
  
  if (locale && locales.includes(locale)) {
    return locale;
  }
  
  return defaultLocale;
}

// Set locale cookie
function setLocaleCookie(locale: Locale) {
  document.cookie = `NEXT_LOCALE=${locale};path=/;max-age=31536000`;
}

// Provider
export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(defaultLocale);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const savedLocale = getLocaleFromCookie();
    setLocaleState(savedLocale);
    setMounted(true);
  }, []);

  const setLocale = useCallback((newLocale: Locale) => {
    if (locales.includes(newLocale)) {
      setLocaleState(newLocale);
      setLocaleCookie(newLocale);
    }
  }, []);

  const t = useCallback((key: string): string => {
    return getNestedValue(messages[locale], key);
  }, [locale]);

  // Memoize context value to prevent unnecessary re-renders
  const value = useMemo(() => ({
    locale,
    setLocale,
    t,
  }), [locale, setLocale, t]);

  return (
    <I18nContext.Provider value={value}>
      {children}
    </I18nContext.Provider>
  );
}

// Hook to use translations
export function useTranslations() {
  const context = useContext(I18nContext);
  
  if (!context) {
    // Fallback for when context is not available (SSG)
    return (key: string) => getNestedValue(messages[defaultLocale], key);
  }
  
  return context.t;
}

// Hook to use locale
export function useLocale() {
  const context = useContext(I18nContext);
  return context?.locale ?? defaultLocale;
}

// Hook to change locale
export function useChangeLocale() {
  const context = useContext(I18nContext);
  return context?.setLocale ?? (() => {});
}


