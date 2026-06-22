import type { Metadata } from 'next';
import './globals.css';
import { Inter } from 'next/font/google';
import { Analytics } from '@vercel/analytics/next';

import Navbar from '@/components/navbar';
import AnnouncementBar from '@/components/announcement-bar';
import Footer from '@/components/footer';

const inter = Inter({
    subsets: ['latin'],
    display: 'swap',
});

export const metadata: Metadata = {
    title: 'NINE77 | Premium Streetwear',
    description: 'Premium luxury streetwear built for the bold.',
    metadataBase: new URL('https://nine77-store.vercel.app'),

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
        <html lang="en">
            <body
                className={`${inter.className} bg-background text-white antialiased`}
            >
                <div className="min-h-screen bg-background text-white">
                    <AnnouncementBar />
                    <Navbar />
                    <main>{children}</main>
                    <Footer />
                </div>

                <Analytics />
            </body>
        </html>
    );
}