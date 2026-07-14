/** @type {import('next-sitemap').IConfig} */
import { products } from '@/data/products';

const baseUrl = 'https://nine77-store.vercel.app';

export default function sitemap() {
    const productUrls = products.map((product) => ({
        url: `${baseUrl}/product/${product.slug}`,
        lastModified: new Date().toISOString()
    }));

    return [
        {
            url: baseUrl,
            lastModified: new Date().toISOString()
        },
        {
            url: `${baseUrl}/shop`,
            lastModified: new Date().toISOString()
        },
        {
            url: `${baseUrl}/about`,
            lastModified: new Date().toISOString()
        },
        {
            url: `${baseUrl}/faq`,
            lastModified: new Date().toISOString()
        },
        ...productUrls
    ];
}
