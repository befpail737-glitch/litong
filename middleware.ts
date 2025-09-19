import createMiddleware from 'next-intl/middleware';
import { NextRequest, NextResponse } from 'next/server';
import {locales} from './src/i18n';

const intlMiddleware = createMiddleware({
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

export default async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check for technical support article redirects
  // Pattern: /[locale]/brands/[slug]/articles/[id]
  const articleMatch = pathname.match(/^\/([^\/]+)\/brands\/([^\/]+)\/articles\/([^\/]+)\/?$/);

  if (articleMatch) {
    const [, locale, brandSlug, articleId] = articleMatch;

    try {
      // Check if this article is a technical support article
      const baseUrl = process.env.NODE_ENV === 'production'
        ? 'https://elec-distributor.com'
        : `http://${request.headers.get('host') || 'localhost:3000'}`;

      // Use internal API to check article category
      const checkUrl = `${baseUrl}/api/check-article-category?articleId=${encodeURIComponent(articleId)}`;
      const response = await fetch(checkUrl);

      if (response.ok) {
        const data = await response.json();

        if (data.category === 'technical-support') {
          // Redirect to support URL with 301 permanent redirect
          const supportUrl = `/${locale}/brands/${brandSlug}/support/${articleId}`;
          console.log(`🔄 [Middleware] Redirecting technical support article: ${pathname} → ${supportUrl}`);

          return NextResponse.redirect(new URL(supportUrl, request.url), 301);
        }
      }
    } catch (error) {
      console.error('❌ [Middleware] Error checking article category:', error);
      // Continue with normal processing if check fails
    }
  }

  // Apply internationalization middleware
  return intlMiddleware(request);
}

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