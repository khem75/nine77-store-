import Link from 'next/link';
import { Instagram, MessageCircle, ShieldCheck, Truck } from 'lucide-react';

const footerColumns = [
    {
        title: 'Shop',
        links: [
            { label: 'All Products', href: '/shop' },
            { label: 'Tops', href: '/shop?category=Tops' },
            { label: 'Pants', href: '/shop?category=Pants' },
            { label: 'Outerwear', href: '/shop?category=Outerwear' }
        ]
    },
    {
        title: 'Company',
        links: [
            { label: 'About', href: '/about' },
            { label: 'FAQ', href: '/faq' },
            { label: 'Contact', href: 'https://wa.me/9779845465529' }
        ]
    },
    {
        title: 'Support',
        links: [
            { label: 'Shipping', href: '/faq' },
            { label: 'Returns', href: '/faq' },
            { label: 'Terms', href: '/faq' }
        ]
    }
];

export default function Footer() {
    return (
        <footer className="border-t border-white/10 bg-black/80 px-6 py-14 text-white/80 lg:px-8">
            <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1.2fr_0.9fr] lg:items-start">
                <div>
                    <span className="text-sm uppercase tracking-[0.35em] text-gold">NINE77</span>
                    <p className="mt-4 max-w-xl text-sm leading-7 text-white/70">
                        Luxury streetwear built with premium detail and uncompromising style. Crafted for bold expression and premium everyday wearing.
                    </p>
                    <div className="mt-8 flex flex-wrap items-center gap-4 text-sm uppercase tracking-[0.3em] text-white/70">
                        <span className="inline-flex items-center gap-2">
                            <ShieldCheck size={18} /> Quality
                        </span>
                        <span className="inline-flex items-center gap-2">
                            <Truck size={18} /> Shipping
                        </span>
                        <span className="inline-flex items-center gap-2">
                            <MessageCircle size={18} /> Support
                        </span>
                    </div>
                </div>
                <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                    {footerColumns.map((column) => (
                        <div key={column.title}>
                            <h3 className="text-sm font-semibold uppercase tracking-[0.3em] text-white">{column.title}</h3>
                            <ul className="mt-5 space-y-3 text-sm text-white/70">
                                {column.links.map((link) => (
                                    <li key={link.label}>
                                        <Link href={link.href} className="transition hover:text-gold">
                                            {link.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                    <div>
                        <h3 className="text-sm font-semibold uppercase tracking-[0.3em] text-white">Social</h3>
                        <div className="mt-5 flex gap-4 text-gold">
                            <Link href="https://instagram.com" aria-label="Instagram">
                                <Instagram size={20} />
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
            <div className="mt-12 border-t border-white/10 pt-6 text-center text-sm text-white/50">
                © {new Date().getFullYear()} NINE77. All rights reserved.
            </div>
        </footer>
    );
}
