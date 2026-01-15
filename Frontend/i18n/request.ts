import { getRequestConfig } from 'next-intl/server';
import { defaultLocale, locales, type Locale } from './config';

export default getRequestConfig(async ({ requestLocale }) => {
  // For static export, use the request locale or default
  // This will be handled client-side for locale switching
  let locale: Locale = defaultLocale;
  
  // If requestLocale is provided and valid, use it
  if (requestLocale && locales.includes(requestLocale as Locale)) {
    locale = requestLocale as Locale;
  }

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default
  };
});


