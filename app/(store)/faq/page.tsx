import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'FAQ',
    description:
        'Frequently Asked Questions about NINE77 streetwear. Sizes, returns, delivery times in Kathmandu and Nepal, and how to order.',
    openGraph: {
        title: 'FAQ | NINE77',
        description: 'Have questions about sizing, delivery, or returns? We have answers.',
    },
};

export default function FAQPage() {
    return (
        <section className="px-6 py-32 lg:px-8 bg-background min-h-[70vh] flex items-center justify-center">
            <div className="mx-auto max-w-5xl w-full">
                <p className="text-[10px] uppercase tracking-[0.45em] text-gold font-bold">FAQ</p>
                <h1 className="mt-4 text-4xl font-black uppercase tracking-[0.04em] text-primary sm:text-5xl">
                    Need help?<br /> We have answers.
                </h1>
                <div className="mt-10 space-y-8 rounded-[32px] border border-border bg-white p-8 md:p-10 shadow-luxury">
                    <div>
                        <h2 className="text-lg font-bold uppercase tracking-[0.05em] text-primary">How can I place an order?</h2>
                        <p className="mt-3 text-sm leading-7 text-secondary font-light">Select the product, size, and quantity on the product page. Then use the WhatsApp order button to confirm your details.</p>
                    </div>
                    <div className="border-t border-border pt-6">
                        <h2 className="text-lg font-bold uppercase tracking-[0.05em] text-primary">What is the delivery time?</h2>
                        <p className="mt-3 text-sm leading-7 text-secondary font-light">Standard delivery is 5-7 business days after order confirmation. Shipping is handled with premium care.</p>
                    </div>
                    <div className="border-t border-border pt-6">
                        <h2 className="text-lg font-bold uppercase tracking-[0.05em] text-primary">What sizes do you offer?</h2>
                        <p className="mt-3 text-sm leading-7 text-secondary font-light">We offer S, M, L, and XL across the entire collection. Each item is available in its official signature colorway.</p>
                    </div>
                    <div className="border-t border-border pt-6">
                        <h2 className="text-lg font-bold uppercase tracking-[0.05em] text-primary">What is your return policy?</h2>
                        <p className="mt-3 text-sm leading-7 text-secondary font-light">Returns are accepted for damaged or incorrect items within 7 days of receipt. Contact us through WhatsApp for support.</p>
                    </div>
                </div>
            </div>
        </section>
    );
}
