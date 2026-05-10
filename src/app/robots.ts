import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/dev/', '/my/', '/box/', '/record/', '/login'],
    },
    sitemap: 'https://www.watch-box.net/sitemap.xml',
  };
}
