import type { Metadata, Viewport } from 'next';
import './globals.css';
import { Inter } from 'next/font/google';
import { Analytics } from '@vercel/analytics/next';
import { Toaster } from 'sonner';

const inter = Inter({
    subsets: ['latin'],
    display: 'swap',
    variable: '--font-sans',
    weight: ['300', '400', '500', '600', '700', '800', '900'],
});

export const viewport: Viewport = {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 5,
    userScalable: true,
    themeColor: '#080808',
    colorScheme: 'dark',
};

export const metadata: Metadata = {
    title: {
        default: 'NINE77 | Premium Streetwear',
        template: '%s | NINE77',
    },
    description:
        'NINE77 — Next-generation luxury streetwear. Premium garments crafted for the bold. Shop exclusive drops in Mahendranagar, Nepal.',
    metadataBase: new URL('https://nine77-store.vercel.app'),
    keywords: [
        'NINE77',
        'streetwear',
        'luxury fashion',
        'Nepal fashion',
        'premium clothing',
        'Mahendranagar streetwear',
        'premium streetwear Nepal',
        'NINE77 shop',
    ],
    authors: [{ name: 'Khem R. Joshi', url: 'https://khemjoshi.com.np/' }],
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
            <body suppressHydrationWarning>
                {children}
                <Toaster
                    position="top-right"
                    expand={false}
                    richColors
                    toastOptions={{
                        style: {
                            fontFamily: 'var(--font-sans), system-ui, sans-serif',
                        },
                    }}
                />
                <Analytics />
            </body>
        </html>
    );
}