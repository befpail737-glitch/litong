import { getRequestConfig } from 'next-intl/server';
import { notFound } from 'next/navigation';

export const locales = ['zh', 'en', 'ja', 'ko', 'ru', 'vi', 'fr', 'de', 'it', 'tr', 'ar'] as const;
export type Locale = (typeof locales)[number];

export default getRequestConfig(async ({ requestLocale }) => {
  // Get the locale from the request, fallback to 'zh' for static generation
  let locale: string;
  try {
    locale = await requestLocale || 'zh';
  } catch (error) {
    // Fallback for static generation when middleware doesn't run
    locale = 'zh';
  }
  
  // Validate that the incoming `locale` parameter is valid
  if (!locales.includes(locale as Locale)) {
    locale = 'zh'; // Fallback to default locale instead of notFound
  }
 
  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default
  };
});