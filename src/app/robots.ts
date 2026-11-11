import type { MetadataRoute } from 'next';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://bloomora.in';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: ['/', '/shop', '/custom-orders', '/reviews', '/our-story', '/contact'],
        disallow: ['/admin', '/admin/', '/api/', '/checkout'],
      },
    ],
    sitemap: `${BASE_URL.replace(/\/$/, '')}/sitemap.xml`,
  };
}

