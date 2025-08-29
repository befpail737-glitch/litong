import { MetadataRoute } from 'next';

export async function GET(): Promise<Response> {
  const baseUrl = 'https://www.litong-electronics.com';
  const languages = ['zh', 'en', 'ja', 'ko', 'ru', 'vi', 'fr', 'de', 'it', 'tr', 'ar'];
  
  // Static pages
  const staticPages = [
    '',
    '/brands',
    '/products', 
    '/about',
    '/contact',
    '/solutions',
    '/news',
    '/technical-support'
  ];

  // Sample brand pages
  const brandPages = [
    '/brands/stmicroelectronics',
    '/brands/texas-instruments',
    '/brands/maxim-integrated',
    '/brands/infineon',
    '/brands/analog-devices',
    '/brands/espressif'
  ];

  // Sample product category pages
  const productPages = [
    '/products/microcontrollers',
    '/products/power-management',
    '/products/analog-mixed-signal',
    '/products/rf-wireless',
    '/products/sensors',
    '/products/interface-ics'
  ];

  // Sample solution pages
  const solutionPages = [
    '/solutions/industrial-automation',
    '/solutions/smart-home',
    '/solutions/electric-vehicle'
  ];

  const allPages = [
    ...staticPages,
    ...brandPages,
    ...productPages,
    ...solutionPages
  ];

  let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">`;

  // Generate URLs for all languages and pages
  for (const page of allPages) {
    for (const lang of languages) {
      const url = `${baseUrl}/${lang}${page}`;
      const lastmod = new Date().toISOString().split('T')[0];
      
      let priority = '0.8';
      let changefreq = 'monthly';
      
      // Set higher priority for important pages
      if (page === '') {
        priority = '1.0';
        changefreq = 'weekly';
      } else if (page === '/products' || page === '/brands') {
        priority = '0.9';
        changefreq = 'weekly';
      } else if (page.includes('/products/') || page.includes('/brands/')) {
        priority = '0.7';
        changefreq = 'weekly';
      }

      sitemap += `
  <url>
    <loc>${url}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>`;
      
      // Add alternate language links
      for (const altLang of languages) {
        if (altLang !== lang) {
          sitemap += `
    <xhtml:link rel="alternate" hreflang="${altLang}" href="${baseUrl}/${altLang}${page}"/>`;
        }
      }
      
      sitemap += `
  </url>`;
    }
  }

  sitemap += `
</urlset>`;

  return new Response(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=86400', // Cache for 24 hours
    },
  });
}