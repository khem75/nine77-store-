'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';

const instagramPosts = [
    '/instagram/insta-1.jpg',
    '/instagram/insta-2.jpg',
    '/instagram/insta-3.jpg',
    '/instagram/insta-4.jpg',
];

export default function InstagramGallery() {
    return (
        <section className="border-t border-white/10 px-6 py-16 lg:px-8">
            <div className="mx-auto max-w-7xl">
                <div className="mb-12 text-center">
                    <p className="text-sm uppercase tracking-[0.35em] text-gold">
                        Follow Us
                    </p>

                    <h2 className="mt-4 text-4xl font-black uppercase text-white sm:text-5xl">
                        Latest From NINE77
                    </h2>

                    <p className="mt-4 text-white/70">
                        Premium streetwear. Built different. Made to stand out.
                    </p>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {instagramPosts.map((image, index) => (
                        <motion.a
                            key={index}
                            href="https://www.instagram.com/nine.77___/"
                            target="_blank"
                            rel="noreferrer"
                            whileHover={{ y: -5 }}
                            className="group overflow-hidden rounded-[24px] border border-white/10"
                        >
                            <div className="relative aspect-square overflow-hidden">
                                <Image
                                    src={image}
                                    alt={`Instagram Post ${index + 1}`}
                                    fill
                                    className="object-cover transition duration-500 group-hover:scale-110"
                                />
                            </div>
                        </motion.a>
                    ))}
                </div>

                <div className="mt-10 text-center">
                    <Link
                        href="https://www.instagram.com/nine.77___/"
                        target="_blank"
                        className="inline-flex rounded-full bg-gold px-8 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-black transition hover:bg-gold-dark"
                    >
                        Follow @nine.77___
                    </Link>
                </div>
            </div>
        </section>
    );
}