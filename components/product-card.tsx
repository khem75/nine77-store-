'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import type { Product } from '@/types/product';
import { formatPrice } from '@/utils';

interface ProductCardProps {
    product: Product;
    index?: number;
    showPrice?: boolean;
    priority?: boolean;
}

export default function ProductCard({
    product,
    index = 0,
    showPrice = false,
    priority = false,
}: ProductCardProps) {
    const cardRef = useRef<HTMLDivElement>(null);
    const isInView = useInView(cardRef, { once: true, amount: 0.05 });
    const [hovered, setHovered] = useState(false);

    const [imgSrc, setImgSrc] = useState(product.images[0] || '/luxury-streetwear-garment.png');
    const [img2Src, setImg2Src] = useState(product.images[1] || '');
    const [fallback, setFallback] = useState(false);

    return (
        <motion.div
            ref={cardRef}
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: index * 0.04, ease: [0.16, 1, 0.3, 1] }}
            className="w-full"
        >
            <Link href={`/product/${product.slug}`} data-cursor="view" className="block group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/50 rounded-[20px]">
                <article
                    onMouseEnter={() => setHovered(true)}
                    onMouseLeave={() => setHovered(false)}
                    className="relative flex flex-col overflow-hidden rounded-[20px] border border-white/[0.06] bg-[#111111] transition-all duration-500 ease-luxury group-hover:border-white/15 group-hover:-translate-y-1.5 group-hover:shadow-[0_16px_36px_rgba(0,0,0,0.65),0_0_20px_rgba(212,175,55,0.03)]"
                >
                    {/* Image Container (aspect-[3/4] portrait) */}
                    <div
                        className="relative w-full overflow-hidden bg-[#090909]"
                        style={{ paddingBottom: '133.3%' }} // 3:4 aspect ratio
                    >
                        {/* Status Badge */}
                        {(product.newArrival || product.featured) && (
                            <div className="absolute left-4 top-4 z-10 flex flex-col gap-1.5 pointer-events-none">
                                {product.newArrival && (
                                    <span className="rounded-sm bg-gold text-black px-2 py-0.5 text-[8px] font-black uppercase tracking-[0.16em] leading-none shadow-md">
                                        New Drop
                                    </span>
                                )}
                                {!product.newArrival && product.featured && (
                                    <span className="rounded-sm bg-white/90 text-black px-2 py-0.5 text-[8px] font-black uppercase tracking-[0.16em] leading-none shadow-md">
                                        Featured
                                    </span>
                                )}
                            </div>
                        )}

                        <Image
                            src={imgSrc}
                            alt={product.name}
                            fill
                            priority={priority}
                            loading={priority ? 'eager' : 'lazy'}
                            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                            onError={() => { 
                                if (!fallback) { 
                                    setImgSrc('/luxury-streetwear-garment.png'); 
                                    setFallback(true); 
                                } 
                             }}
                            className={`object-contain object-center transition-all duration-700 ease-luxury ${
                                hovered && img2Src ? 'opacity-0 scale-[1.03]' : 'opacity-100 scale-100'
                            }`}
                        />
                        {img2Src && (
                            <Image
                                src={img2Src}
                                alt={`${product.name} — alternate`}
                                fill
                                loading="lazy"
                                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                                onError={() => setImg2Src('')}
                                className={`object-contain object-center transition-all duration-700 ease-luxury absolute inset-0 ${
                                    hovered ? 'opacity-100 scale-[1.03]' : 'opacity-0 scale-100'
                                }`}
                            />
                        )}
                        
                        {/* Subtle vignette on hover */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                    </div>

                    {/* Bottom Metadata Info */}
                    <div className="flex flex-col items-start gap-1 px-5 py-4.5 border-t border-white/[0.04] bg-[#111111] transition-colors duration-300 group-hover:bg-[#141414]">
                        <span className="text-[8px] font-bold uppercase tracking-[0.25em] text-white/30">
                            {product.category}
                        </span>
                        <h3 className="truncate w-full text-[11px] font-bold uppercase tracking-[0.16em] text-white/90 group-hover:text-white transition-colors duration-300 leading-none">
                            {product.name}
                        </h3>
                        {showPrice && (
                            <p className="text-[12px] font-semibold text-gold tracking-wide mt-1">
                                {formatPrice(product.price)}
                            </p>
                        )}
                    </div>
                </article>
            </Link>
        </motion.div>
    );
}