import { products as staticProducts } from '@/data/products';
import { getProducts } from '@/lib/product-actions';
import { slugify } from '@/utils';

const baseUrl = 'https://nine77-store.vercel.app';

export default async function sitemap() {
    const dbProducts = await getProducts();
    const activeProducts = dbProducts.filter((p) => p.status === 'active');
    const sourceProducts = activeProducts.length > 0 ? activeProducts : staticProducts;

    const productUrls = sourceProducts.map((product) => {
        const slug = 'slug' in product ? product.slug : slugify(product.name);
        return {
            url: `${baseUrl}/product/${slug}`,
            lastModified: new Date().toISOString()
        };
    });

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
