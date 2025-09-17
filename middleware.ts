import createMiddleware from 'next-intl/middleware';
import {locales} from './src/i18n';

export default createMiddleware({
  // A list of all locales that are supported
  locales,

  // Used when no locale matches
  defaultLocale: 'zh-CN',

  // Enable locale detection
  localeDetection: true,

  // Paths to exclude from locale handling
  pathnames: {
    '/': '/',
    '/brands': '/brands',
    '/brands/[slug]': '/brands/[slug]',
    '/products': '/products',
    '/solutions': '/solutions',
    '/about': '/about',
    '/contact': '/contact'
  }
});

export const config = {
  // Match only internationalized pathnames
  matcher: [
    // Enable a redirect to a matching locale at the root
    '/',

    // Set a cookie to remember the previous locale for
    // all requests that have a locale prefix - updated for reduced locale set
    '/(zh-CN|en)/:path*',

    // Enable redirects that add missing locales, exclude static assets and studio
    // (e.g. `/pathnames` -> `/zh-CN/pathnames`)
    '/((?!_next|_vercel|studio|admin|api|.*\\..*).*)'
  ]
};