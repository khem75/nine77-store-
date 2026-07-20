'use client';

import { useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { Heart, MessageCircle } from 'lucide-react';
import { slugify } from '@/utils';
import type { AdminProduct } from '@/types/admin';
import type { Product } from '@/types/product';

const luxuryEase = [0.16, 1, 0.3, 1] as const;

interface ProductCardProps {
    product: AdminProduct | Product;
    index?: number;
    showPrice?: boolean;
}

export default function ProductCard({ product, index = 0, showPrice = true }: ProductCardProps) {
    const cardRef = useRef<HTMLDivElement>(null);
    const isInView = useInView(cardRef, { once: true, amount: 0.05 });
    const [hovered, setHovered] = useState(false);
    const [liked, setLiked] = useState(false);

    const [imgSrc, setImgSrc] = useState(product.images[0] || '/luxury-streetwear-garment.png');
    const [img2Src] = useState(product.images[1] || '');

    const slug = 'slug' in product ? product.slug : slugify(product.name);
    const isFeatured = 'featured' in product ? product.featured : false;

    return (
        <motion.div
            ref={cardRef}
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: index * 0.06, ease: luxuryEase }}
            className="w-full group"
        >
            <Link 
                href={`/product/${slug}`} 
                className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/40 rounded-2xl active:scale-[0.98] transition-transform"
                aria-label={`${product.name} — Rs. ${product.price.toLocaleString()}`}
            >
                <article
                    onMouseEnter={() => setHovered(true)}
                    onMouseLeave={() => setHovered(false)}
                    className="relative flex flex-col overflow-hidden rounded-2xl bg-card border border-border transition-all duration-500 ease-luxury hover:shadow-card-hover hover:-translate-y-1"
                >
                    {/* Image Container with 4:5 aspect ratio */}
                    <div className="relative w-full overflow-hidden bg-surface" style={{ paddingBottom: '133.3%' }}>

                        {/* Featured Badge */}
                        {isFeatured && (
                            <div className="absolute left-3 top-3 z-10">
                                <span className="rounded-full bg-gold text-white px-2.5 py-1 text-[8px] font-bold uppercase tracking-[0.15em] leading-none shadow-sm">
                                    Featured
                                </span>
                            </div>
                        )}

                        {/* Wishlist Heart Fade & Lift */}
                        <button
                            type="button"
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                setLiked(!liked);
                            }}
                            aria-label={liked ? "Remove from wishlist" : "Add to wishlist"}
                            className="absolute right-3 top-3 z-10 w-8 h-8 rounded-full bg-white/80 backdrop-blur-sm border border-border flex items-center justify-center transition-all duration-300 opacity-80 group-hover:opacity-100 scale-95 group-hover:scale-100 hover:bg-white hover:shadow-soft"
                        >
                            <Heart
                                size={14}
                                className={`transition-colors duration-300 ${liked ? 'text-red-500 fill-red-500' : 'text-secondary'}`}
                            />
                        </button>

                        {/* Product Image — Scale 1 -> 1.06 on hover */}
                        <Image
                            src={hovered && img2Src ? img2Src : imgSrc}
                            alt={product.name}
                            fill
                            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                            className="object-cover transition-transform duration-700 ease-luxury group-hover:scale-[1.06]"
                            onError={() => setImgSrc('/luxury-streetwear-garment.png')}
                        />
                    </div>

                    {/* Product Info — Price lift on hover */}
                    <div className="p-3.5 md:p-4 space-y-1.5 bg-card">
                        <h3 className="text-[12px] md:text-[13px] font-bold text-primary uppercase tracking-tight truncate group-hover:text-gold transition-colors duration-300">
                            {product.name}
                        </h3>

                        {showPrice && (
                            <div className="flex items-center justify-between">
                                <p className="text-[12px] md:text-[13px] font-semibold text-secondary transition-transform duration-300 group-hover:-translate-y-0.5">
                                    Rs. {product.price.toLocaleString()}
                                </p>

                                {/* Quick WhatsApp */}
                                <button
                                    type="button"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        window.open(
                                            `https://wa.me/9779810605409?text=${encodeURIComponent(`Hi NINE77, I'm interested in ${product.name} (Rs. ${product.price})`)}`,
                                            '_blank'
                                        );
                                    }}
                                    className="flex items-center gap-1 text-[9px] font-bold uppercase tracking-[0.12em] text-gold hover:text-gold-dark transition-colors duration-300"
                                    aria-label={`Order ${product.name} on WhatsApp`}
                                >
                                    <MessageCircle size={11} />
                                    WhatsApp Order
                                </button>
                            </div>
                        )}
                    </div>
                </article>
            </Link>
        </motion.div>
    );
}