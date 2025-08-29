import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/admin/',
          '/api/',
          '/*?*', // Disallow URLs with query parameters to prevent duplicate content
        ],
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: [
          '/admin/',
          '/api/',
        ],
      },
    ],
    sitemap: 'https://www.litong-electronics.com/zh/sitemap.xml',
    host: 'https://www.litong-electronics.com'
  };
}