import type { Metadata } from 'next';
import ShopClient from './shop-client';

export const metadata: Metadata = {
    title: 'Shop Catalog',
    description:
        'Explore the exclusive NINE77 streetwear catalog. Tops, pants, outerwear, and accessories designed for those who refuse to blend in. Kathmandu, Nepal.',
    openGraph: {
        title: 'Shop Catalog | NINE77',
        description: 'Explore premium luxury streetwear drops built for the bold.',
    },
};

export default function ShopPage() {
    return <ShopClient />;
}
