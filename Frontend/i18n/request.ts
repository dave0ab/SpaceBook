import { getRequestConfig } from 'next-intl/server';
import { defaultLocale } from './config';

export default getRequestConfig(async () => {
  // For static export, always use default locale at build time
  // Client-side I18nProvider handles locale switching via cookies
  const locale = defaultLocale;

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default
  };
});


