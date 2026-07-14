import type { Metadata, Viewport } from 'next';
import './globals.css';
import { Inter } from 'next/font/google';
import { Analytics } from '@vercel/analytics/next';

import Navbar from '@/components/navbar';
import AnnouncementBar from '@/components/announcement-bar';
import Footer from '@/components/footer';
import MobileBottomNav from '@/components/mobile-bottom-nav';
import SmoothScrollProvider from '@/components/smooth-scroll-provider';

const inter = Inter({
    subsets: ['latin'],
    display: 'swap',
    variable: '--font-sans',
    weight: ['300', '400', '500', '600', '700', '800', '900'],
});

export const viewport: Viewport = {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 5,          // Allow pinch-zoom for accessibility
    userScalable: true,       // Never block user scaling — accessibility requirement
    themeColor: '#080808',
    colorScheme: 'dark',
};

export const metadata: Metadata = {
    title: {
        default: 'NINE77 | Premium Streetwear',
        template: '%s | NINE77',
    },
    description:
        'NINE77 — Next-generation luxury streetwear. Premium garments crafted for the bold. Shop exclusive drops in Kathmandu, Nepal.',
    metadataBase: new URL('https://nine77-store.vercel.app'),
    keywords: [
        'NINE77',
        'streetwear',
        'luxury fashion',
        'Nepal fashion',
        'premium clothing',
        'Kathmandu streetwear',
        'premium streetwear Nepal',
        'NINE77 shop',
    ],
    authors: [{ name: 'Khem R. Joshi', url: 'https://khemjoshi.tech/' }],
    creator: 'NINE77',
    publisher: 'NINE77',
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            'max-video-preview': -1,
            'max-image-preview': 'large',
            'max-snippet': -1,
        },
    },
    openGraph: {
        title: 'NINE77 | Premium Streetwear',
        description: 'Premium luxury streetwear built for the bold.',
        type: 'website',
        siteName: 'NINE77',
        locale: 'en_US',
        images: [
            {
                url: '/og-image.png',
                width: 1200,
                height: 630,
                alt: 'NINE77 Premium Streetwear',
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'NINE77 | Premium Streetwear',
        description: 'Premium luxury streetwear built for the bold.',
        images: ['/og-image.png'],
    },
    alternates: {
        canonical: 'https://nine77-store.vercel.app',
    },
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html
            lang="en"
            className={`${inter.variable}`}
            suppressHydrationWarning
        >
            <body
                className="bg-background font-sans text-white antialiased"
                suppressHydrationWarning
            >
                <SmoothScrollProvider>
                    {/* Skip to main content — accessibility */}
                    <a
                        href="#main-content"
                        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[99999] focus:rounded-lg focus:bg-gold focus:px-4 focus:py-2 focus:text-[11px] focus:font-bold focus:uppercase focus:tracking-widest focus:text-black"
                    >
                        Skip to content
                    </a>

                    <div
                        className="relative min-h-screen bg-background text-white"
                        style={{ overflowX: 'hidden', maxWidth: '100vw' }}
                    >
                        <AnnouncementBar />
                        <Navbar />
                        <main
                            id="main-content"
                            className="relative pb-mobile-nav md:pb-0"
                            tabIndex={-1}
                        >
                            {children}
                        </main>
                        <Footer />
                        <MobileBottomNav />
                    </div>
                </SmoothScrollProvider>

                <Analytics />
            </body>
        </html>
    );
}