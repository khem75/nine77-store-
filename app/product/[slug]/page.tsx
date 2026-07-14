import { products } from '@/data/products';
import type { Product } from '@/types/product';
import ProductDetail from '@/components/product-detail';
import type { Metadata } from 'next';

type Props = {
    params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const resolvedParams = await params;
    const product = products.find((item) => item.slug === resolvedParams.slug);

    if (!product) {
        return {
            title: 'Product Not Found',
        };
    }

    return {
        title: product.name,
        description: product.description,
        openGraph: {
            title: `${product.name} | NINE77`,
            description: product.description,
            images: [
                {
                    url: product.images[0] || '/luxury-streetwear-garment.png',
                    alt: product.name,
                },
            ],
        },
    };
}

export default async function ProductPage({ params }: Props) {
    const resolvedParams = await params;
    const product = products.find((item) => item.slug === resolvedParams.slug);

    if (!product) {
        return (
            <section className="px-6 py-20 text-center text-white">
                <h1 className="text-3xl font-black uppercase tracking-[0.09em]">Product not found</h1>
                <a href="/shop" className="mt-8 inline-flex rounded-full bg-gold px-6 py-3 text-sm uppercase tracking-[0.18em] text-black">
                    Return to shop
                </a>
            </section>
        );
    }

    const relatedProducts = products.filter((item) => item.category === product.category && item.slug !== product.slug).slice(0, 4);

    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: product.name,
        image: product.images.map(img => `https://nine77-store.vercel.app${img}`),
        description: product.description,
        offers: {
            '@type': 'Offer',
            price: product.price,
            priceCurrency: 'NPR',
            availability: 'https://schema.org/InStock',
            url: `https://nine77-store.vercel.app/product/${product.slug}`,
        },
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <ProductDetail product={product} relatedProducts={relatedProducts} />
        </>
    );
}
