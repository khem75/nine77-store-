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
    maximumScale: 1,
    userScalable: false,
    themeColor: '#080808',
};

export const metadata: Metadata = {
    title: 'NINE77 | Premium Streetwear',
    description:
        'NINE77 — Next-generation luxury streetwear. Premium garments crafted for the bold.',
    metadataBase: new URL('https://nine77-store.vercel.app'),
    keywords: ['NINE77', 'streetwear', 'luxury fashion', 'Nepal fashion', 'premium clothing'],
    openGraph: {
        title: 'NINE77 | Premium Streetwear',
        description: 'Premium luxury streetwear built for the bold.',
        type: 'website',
        siteName: 'NINE77',
        images: [
            {
                url: '/og-image.png',
                width: 1200,
                height: 630,
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'NINE77 | Premium Streetwear',
        description: 'Premium luxury streetwear built for the bold.',
    },
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en" className={`${inter.variable}`} suppressHydrationWarning>
            <body className="bg-background font-sans text-white antialiased" suppressHydrationWarning>
                <SmoothScrollProvider>
                    <div className="relative min-h-screen bg-background text-white" style={{ overflowX: 'hidden', maxWidth: '100vw' }}>
                        <AnnouncementBar />
                        <Navbar />
                        <main className="relative pb-mobile-nav md:pb-0">{children}</main>
                        <Footer />
                        <MobileBottomNav />
                    </div>
                </SmoothScrollProvider>

                <Analytics />
            </body>
        </html>
    );
}