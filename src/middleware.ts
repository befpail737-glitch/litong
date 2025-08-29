import createMiddleware from 'next-intl/middleware';
import { locales } from './i18n';

export default createMiddleware({
  locales,
  defaultLocale: 'zh',
  localePrefix: 'always',
  // Add this to help with static export
  alternateLinks: false
});

export const config = {
  matcher: [
    // Match all pathnames except for
    // - /api routes
    // - /_next/static (static files)
    // - /_next/image (image optimization files)
    // - /favicon.ico (favicon file)
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};