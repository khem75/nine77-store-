'use client';

import Image from 'next/image';
import { useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { buildWhatsAppUrl } from '@/lib/whatsapp';
import { formatPrice } from '@/utils';
import type { Product } from '@/types/product';
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
    const [currentImage, setCurrentImage] = useState(0);

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

    const nextImage = () => {
        setCurrentImage((prev) =>
            prev === product.images.length - 1 ? 0 : prev + 1
        );
    };

    const prevImage = () => {
        setCurrentImage((prev) =>
            prev === 0 ? product.images.length - 1 : prev - 1
        );
    };

    return (
        <>
            <section className="px-6 py-16 lg:px-8">
                <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">

                    {/* Product Gallery */}
                    <div className="space-y-4">
                        <div className="relative overflow-hidden rounded-[32px] border border-white/10 bg-black">
                            <div className="relative aspect-[4/5] w-full">
                                <Image
                                    src={product.images[currentImage]}
                                    alt={product.name}
                                    fill
                                    priority
                                    className="object-cover"
                                />
                            </div>

                            {product.images.length > 1 && (
                                <>
                                    <button
                                        onClick={prevImage}
                                        className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-black/70 p-3 text-white backdrop-blur"
                                    >
                                        <ChevronLeft size={20} />
                                    </button>

                                    <button
                                        onClick={nextImage}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-black/70 p-3 text-white backdrop-blur"
                                    >
                                        <ChevronRight size={20} />
                                    </button>
                                </>
                            )}
                        </div>

                        {product.images.length > 1 && (
                            <div className="flex items-center justify-center gap-4">
                                <button
                                    onClick={prevImage}
                                    className="text-white/60 hover:text-gold"
                                >
                                    <ChevronLeft size={20} />
                                </button>

                                <span className="text-sm uppercase tracking-[0.25em] text-white">
                                    {currentImage + 1} / {product.images.length}
                                </span>

                                <button
                                    onClick={nextImage}
                                    className="text-white/60 hover:text-gold"
                                >
                                    <ChevronRight size={20} />
                                </button>
                            </div>
                        )}

                        <div className="grid grid-cols-2 gap-4">
                            {product.images.map((image, index) => (
                                <button
                                    key={index}
                                    onClick={() => setCurrentImage(index)}
                                    className={`relative overflow-hidden rounded-2xl border ${currentImage === index
                                        ? 'border-gold'
                                        : 'border-white/10'
                                        }`}
                                >
                                    <div className="relative aspect-[4/5]">
                                        <Image
                                            src={image}
                                            alt={`${product.name} ${index + 1}`}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Product Info */}
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