import type { Metadata } from 'next';
import HomeClient from './home-client';
import { getProducts } from '@/lib/product-actions';
import { getHomepageSettings } from '@/lib/homepage-actions';
import { getCampaigns } from '@/lib/campaign-actions';

export const metadata: Metadata = {
    title: 'NINE77 | Premium Streetwear Kathmandu',
    description:
        'Premium streetwear engineered for those who refuse to blend in. Custom fits, luxury materials, museum-grade craftsmanship. Kathmandu, Nepal.',
    openGraph: {
        title: 'NINE77 | Premium Streetwear Kathmandu',
        description: 'Luxury streetwear Drop. Built different.',
        images: [
            {
                url: '/about-image.jpg',
                alt: 'NINE77 Streetwear Nepal',
            },
        ],
    },
};

export default async function HomePage() {
    const [products, settings, campaigns] = await Promise.all([
        getProducts(),
        getHomepageSettings(),
        getCampaigns(),
    ]);
    const activeProducts = products.filter((p) => p.status === 'active');

    return (
        <HomeClient
            initialProducts={activeProducts}
            initialSettings={settings}
            initialCampaigns={campaigns}
        />
    );
}
