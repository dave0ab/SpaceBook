'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Import translations
import esMessages from '../messages/es.json';
import enMessages from '../messages/en.json';

// Types
export type Locale = 'es' | 'en';

const messages: Record<Locale, Record<string, any>> = {
  es: esMessages,
  en: enMessages,
};

// Default locale
export const defaultLocale: Locale = 'es';
export const locales: Locale[] = ['es', 'en'];

// Context
interface I18nContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string) => string;
}

const I18nContext = createContext<I18nContextType | null>(null);

// Get nested value from object using dot notation
function getNestedValue(obj: any, path: string): string {
  const keys = path.split('.');
  let value = obj;
  
  for (const key of keys) {
    if (value && typeof value === 'object' && key in value) {
      value = value[key];
    } else {
      return path; // Return key if not found
    }
  }
  
  return typeof value === 'string' ? value : path;
}

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

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);
    setLocaleCookie(newLocale);
  };

  const t = (key: string): string => {
    return getNestedValue(messages[locale], key);
  };

  // Always render with current locale (no hydration mismatch since we use useEffect)
  const value = {
    locale,
    setLocale,
    t,
  };

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


