export default function FAQPage() {
    return (
        <section className="px-6 py-16 lg:px-8">
            <div className="mx-auto max-w-5xl">
                <p className="text-sm uppercase tracking-[0.35em] text-gold">FAQ</p>
                <h1 className="mt-4 text-4xl font-black uppercase tracking-[0.04em] text-white sm:text-5xl">Need help? We have answers.</h1>
                <div className="mt-10 space-y-6 rounded-[32px] border border-white/10 bg-white/5 p-8">
                    <div>
                        <h2 className="text-lg font-semibold uppercase tracking-[0.05em] text-white">How can I place an order?</h2>
                        <p className="mt-3 text-sm leading-7 text-white/70">Select the product, size, and quantity on the product page. Then use the WhatsApp order button to confirm your details.</p>
                    </div>
                    <div>
                        <h2 className="text-lg font-semibold uppercase tracking-[0.05em] text-white">What is the delivery time?</h2>
                        <p className="mt-3 text-sm leading-7 text-white/70">Standard delivery is 5-7 business days after order confirmation. Shipping is handled with premium care.</p>
                    </div>
                    <div>
                        <h2 className="text-lg font-semibold uppercase tracking-[0.05em] text-white">What sizes do you offer?</h2>
                        <p className="mt-3 text-sm leading-7 text-white/70">We offer S, M, L, and XL across the entire collection. Each item is available in its official signature colorway.</p>
                    </div>
                    <div>
                        <h2 className="text-lg font-semibold uppercase tracking-[0.05em] text-white">What is your return policy?</h2>
                        <p className="mt-3 text-sm leading-7 text-white/70">Returns are accepted for damaged or incorrect items within 7 days of receipt. Contact us through WhatsApp for support.</p>
                    </div>
                </div>
            </div>
        </section>
    );
}
