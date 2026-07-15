import Navbar from '@/components/navbar';
import AnnouncementBar from '@/components/announcement-bar';
import Footer from '@/components/footer';
import MobileBottomNav from '@/components/mobile-bottom-nav';
import SmoothScrollProvider from '@/components/smooth-scroll-provider';
import CustomCursor from '@/components/custom-cursor';
import { getProducts } from '@/lib/product-actions';

export default async function StoreLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const products = await getProducts();
    const activeProducts = products.filter((p) => p.status === 'active');

    return (
        <SmoothScrollProvider>
            <CustomCursor />
            {/* Skip to main content — accessibility */}
            <a
                href="#main-content"
                className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[99999] focus:rounded-lg focus:bg-gold focus:px-4 focus:py-2 focus:text-[11px] focus:font-bold focus:uppercase focus:tracking-widest focus:text-black"
            >
                Skip to content
            </a>

            <div
                className="relative min-h-screen bg-background text-primary"
                style={{ overflowX: 'hidden', maxWidth: '100vw' }}
            >
                <AnnouncementBar />
                <Navbar products={activeProducts} />
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
    );
}

