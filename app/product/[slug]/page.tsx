import { products } from '@/data/products';
import type { Product } from '@/types/product';
import ProductDetail from '@/components/product-detail';

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> | undefined }) {
    const resolvedParams = params ? await params : undefined;
    const product = resolvedParams ? products.find((item) => item.slug === resolvedParams.slug) : undefined;
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

    return <ProductDetail product={product} relatedProducts={relatedProducts} />;
}
