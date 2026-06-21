'use client';

import { useMemo, useState } from 'react';
import { buildWhatsAppUrl } from '@/lib/whatsapp';
import { formatPrice } from '@/utils';
import type { Product } from '@/types/product';
import ImagePlaceholder from '@/components/image-placeholder';
import RelatedProducts from '@/components/related-products';

interface ProductDetailProps {
    product: Product;
    relatedProducts: Product[];
}

export default function ProductDetail({
    product,
    relatedProducts,
}: ProductDetailProps) {
    const [quantity, setQuantity] = useState(1);
    const [size, setSize] = useState<'S' | 'M' | 'L' | 'XL'>('M');

    const orderUrl = useMemo(
        () =>
            buildWhatsAppUrl({
                productName: product.name,
                price: product.price,
                size,
                quantity,
            }),
        [product.name, product.price, size, quantity]
    );

    return (
        <>
            <section className="px-6 py-16 lg:px-8">
                <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
                    <div>
                        <ImagePlaceholder />
                    </div>

                    <div className="space-y-8">
                        <div className="rounded-[28px] border border-white/10 bg-white/5 p-10">
                            <p className="text-sm uppercase tracking-[0.35em] text-gold">
                                {product.category}
                            </p>

                            <h1 className="mt-4 text-4xl font-black uppercase tracking-[0.04em] text-white sm:text-5xl">
                                {product.name}
                            </h1>

                            <p className="mt-6 max-w-xl text-sm leading-8 text-white/70">
                                {product.description}
                            </p>

                            <div className="mt-8">
                                <p className="text-3xl font-black text-gold">
                                    {formatPrice(product.price)}
                                </p>
                            </div>
                        </div>

                        <div className="grid gap-6 rounded-[28px] border border-white/10 bg-white/5 p-8">
                            <div>
                                <p className="text-sm uppercase tracking-[0.35em] text-white/70">
                                    Size
                                </p>

                                <div className="mt-4 flex flex-wrap gap-3">
                                    {product.sizes.map((option) => (
                                        <button
                                            key={option}
                                            type="button"
                                            onClick={() => setSize(option)}
                                            className={`rounded-2xl border px-5 py-3 text-sm uppercase tracking-[0.2em] transition ${size === option
                                                ? 'border-gold bg-gold/10 text-gold'
                                                : 'border-white/10 bg-white/5 text-white/80'
                                                }`}
                                        >
                                            {option}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <p className="text-sm uppercase tracking-[0.35em] text-white/70">
                                    Quantity
                                </p>

                                <div className="mt-4 flex items-center gap-3 rounded-3xl border border-white/10 bg-black/60 p-3">
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setQuantity((prev) => Math.max(1, prev - 1))
                                        }
                                        className="rounded-full border border-white/10 px-4 py-2 text-white transition hover:border-gold hover:text-gold"
                                    >
                                        -
                                    </button>

                                    <span className="text-lg font-semibold text-white">
                                        {quantity}
                                    </span>

                                    <button
                                        type="button"
                                        onClick={() => setQuantity((prev) => prev + 1)}
                                        className="rounded-full border border-white/10 px-4 py-2 text-white transition hover:border-gold hover:text-gold"
                                    >
                                        +
                                    </button>
                                </div>
                            </div>

                            <a
                                href={orderUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="w-full rounded-full bg-gold px-6 py-4 text-center text-sm font-semibold uppercase tracking-[0.22em] text-black transition hover:bg-gold-dark"
                            >
                                Order via WhatsApp
                            </a>
                        </div>
                    </div>
                </div>
            </section>

            <RelatedProducts products={relatedProducts} />
        </>
    );
}