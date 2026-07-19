import type { Metadata } from 'next';
import ShopClient from './shop-client';
import { getProducts } from '@/lib/product-actions';

export const metadata: Metadata = {
    title: 'Shop Catalog',
    description:
        'Explore the exclusive NINE77 streetwear catalog. Tops, pants, outerwear, and accessories designed for those who refuse to blend in. Mahendranagar, Nepal.',
    openGraph: {
        title: 'Shop Catalog | NINE77',
        description: 'Explore premium luxury streetwear drops built for the bold.',
    },
};

export default async function ShopPage() {
    const products = await getProducts();
    const activeProducts = products.filter((p) => p.status === 'active');

    return <ShopClient initialProducts={activeProducts} />;
}
