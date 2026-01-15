'use client';

import { useState, useEffect, ReactNode } from 'react';
import { NextIntlClientProvider } from 'next-intl';
import { defaultLocale, locales, type Locale } from '../i18n/config';

// Import all messages at build time
import esMessages from '../messages/es.json';
import enMessages from '../messages/en.json';

const messagesMap: Record<Locale, any> = {
  es: esMessages,
  en: enMessages,
};

function getLocaleFromCookie(): Locale {
  if (typeof window === 'undefined') return defaultLocale;
  
  const match = document.cookie.match(/NEXT_LOCALE=([^;]+)/);
  const cookieLocale = match?.[1] as Locale | undefined;
  
  if (cookieLocale && locales.includes(cookieLocale)) {
    return cookieLocale;
  }
  
  return defaultLocale;
}

interface I18nProviderProps {
  children: ReactNode;
  initialMessages: any;
}

export function I18nProvider({ children, initialMessages }: I18nProviderProps) {
  const [locale, setLocale] = useState<Locale>(defaultLocale);
  const [messages, setMessages] = useState(initialMessages);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Get locale from cookie on client
    const cookieLocale = getLocaleFromCookie();
    setLocale(cookieLocale);
    setMessages(messagesMap[cookieLocale]);
    setMounted(true);

    // Listen for locale changes (when language switcher updates cookie)
    const handleStorageChange = () => {
      const newLocale = getLocaleFromCookie();
      if (newLocale !== locale) {
        setLocale(newLocale);
        setMessages(messagesMap[newLocale]);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Use initial messages during SSR/SSG to avoid hydration mismatch
  if (!mounted) {
    return (
      <NextIntlClientProvider locale={defaultLocale} messages={initialMessages}>
        {children}
      </NextIntlClientProvider>
    );
  }

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      {children}
    </NextIntlClientProvider>
  );
}

