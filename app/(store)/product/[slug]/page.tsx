import { products as staticProducts } from '@/data/products';
import ProductDetail from '@/components/product-detail';
import type { Metadata } from 'next';
import { getProductBySlug, getProducts } from '@/lib/product-actions';
import { slugify } from '@/utils';
import type { AdminProduct } from '@/types/admin';
import type { Product } from '@/types/product';

type Props = {
    params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const resolvedParams = await params;
    let product: AdminProduct | Product | null = await getProductBySlug(resolvedParams.slug);
    if (!product) {
        product = staticProducts.find((item) => item.slug === resolvedParams.slug) ?? null;
    }

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
    let product: AdminProduct | Product | null = await getProductBySlug(resolvedParams.slug);
    if (!product) {
        product = staticProducts.find((item) => item.slug === resolvedParams.slug) ?? null;
    }

    if (!product) {
        return (
            <section className="px-6 py-20 text-center text-white bg-[#070707] min-h-[60vh] flex flex-col items-center justify-center">
                <h1 className="text-3xl font-black uppercase tracking-[0.09em]">Product not found</h1>
                <a href="/shop" className="mt-8 inline-flex rounded-full bg-gold px-6 py-3 text-sm uppercase tracking-[0.18em] text-black hover:bg-gold-light transition-colors">
                    Return to shop
                </a>
            </section>
        );
    }

    const allProducts = await getProducts();
    const activeProducts = allProducts.filter((p) => p.status === 'active');
    let relatedProducts: Array<any> = activeProducts
        .filter((item) => item.category === product!.category && slugify(item.name) !== resolvedParams.slug)
        .slice(0, 4);

    if (relatedProducts.length === 0) {
        relatedProducts = staticProducts
            .filter((item) => item.category === product!.category && item.slug !== resolvedParams.slug)
            .slice(0, 4);
    }

    const slug = 'slug' in product ? product.slug : slugify(product.name);

    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: product.name,
        image: product.images.map((img) =>
            img.startsWith('/') ? `https://nine77-store.vercel.app${img}` : img
        ),
        description: product.description,
        offers: {
            '@type': 'Offer',
            price: product.price,
            priceCurrency: 'NPR',
            availability: 'https://schema.org/InStock',
            url: `https://nine77-store.vercel.app/product/${slug}`,
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
