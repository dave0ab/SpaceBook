import { cookies } from 'next/headers';
import { Locale, locales, defaultLocale, messages, getNestedValue } from './i18n-shared';

export async function getTranslations() {
    const cookieStore = await cookies();
    const localeFromCookie = cookieStore.get('NEXT_LOCALE')?.value as Locale;
    const locale = (localeFromCookie && locales.includes(localeFromCookie)) ? localeFromCookie : defaultLocale;

    return (key: string): string => {
        return getNestedValue(messages[locale], key);
    };
}

export async function getServerLocale(): Promise<Locale> {
    const cookieStore = await cookies();
    const localeFromCookie = cookieStore.get('NEXT_LOCALE')?.value as Locale;
    return (localeFromCookie && locales.includes(localeFromCookie)) ? localeFromCookie : defaultLocale;
}
