import Hero from '@/components/hero';
import Stats from '@/components/stats';
import Categories from '@/components/categories';
import WhyNine77 from '@/components/why-nine77';
import AboutSection from '@/components/about-section';
import InstagramGallery from '@/components/instagram-gallery';
import FAQAccordion from '@/components/faq-accordion';
import { products } from '@/data/products';
import ProductCard from '@/components/product-card';

const featuredProducts = products.filter((item) => item.newArrival || item.featured).slice(0, 4);
const bestSellers = products.filter((item) => item.featured).slice(0, 4);

export default function HomePage() {
    return (
        <>
            <Hero />
            <Stats />
            <Categories />
            <section id="arrivals" className="border-t border-white/10 px-6 py-16 lg:px-8">
                <div className="mx-auto max-w-7xl">
                    <div className="mb-10 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                        <div>
                            <p className="text-sm uppercase tracking-[0.35em] text-gold">New Arrivals</p>
                            <h2 className="mt-4 text-4xl font-black uppercase tracking-[0.04em] text-white sm:text-5xl">Latest luxury drops.</h2>
                        </div>
                    </div>
                    <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
                        {featuredProducts.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                </div>
            </section>
            <section className="border-t border-white/10 px-6 py-16 lg:px-8">
                <div className="mx-auto max-w-7xl">
                    <div className="mb-10 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                        <div>
                            <p className="text-sm uppercase tracking-[0.35em] text-gold">Best Sellers</p>
                            <h2 className="mt-4 text-4xl font-black uppercase tracking-[0.04em] text-white sm:text-5xl">Luxury essentials that define the edit.</h2>
                        </div>
                    </div>
                    <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
                        {bestSellers.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                </div>
            </section>
            <WhyNine77 />
            <AboutSection />
            <InstagramGallery />
            <FAQAccordion />
        </>
    );
}
