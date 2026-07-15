import type { MetadataRoute } from 'next';

export default function Robots(): MetadataRoute.Robots {
    return {
        rules: [
            {
                userAgent: '*',
                allow: '/',
                disallow: ['/admin/', '/admin/:path*'],
            }
        ],
        sitemap: 'https://nine77-store.vercel.app/sitemap.xml',
    };
}
