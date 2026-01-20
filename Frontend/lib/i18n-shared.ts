import esMessages from '../messages/es.json';
import enMessages from '../messages/en.json';

// Types
export type Locale = 'es' | 'en';

export const messages: Record<Locale, Record<string, any>> = {
    es: esMessages,
    en: enMessages,
};

// Default locale
export const defaultLocale: Locale = 'es';
export const locales: Locale[] = ['es', 'en'];

// Get nested value from object using dot notation
export function getNestedValue(obj: any, path: string): string {
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
