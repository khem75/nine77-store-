'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

const faqs = [
    { question: 'How can I place an order?', answer: 'You can place an order by browsing the collection and selecting the product, size, and quantity on the product page. Then tap the order button to begin your WhatsApp order.' },
    { question: 'What is the delivery time?', answer: 'Standard delivery is 5-7 business days. Orders are processed within 24 hours and shipped with premium handling.' },
    { question: 'What sizes do you offer?', answer: 'We offer S, M, L, and XL across the entire collection. Each style is designed for elevated streetwear proportions.' },
    { question: 'What is your return policy?', answer: 'We accept returns for damaged or incorrect items within 7 days of delivery. Contact us through WhatsApp for assistance.' }
];

export default function FAQAccordion() {
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    return (
        <section className="border-t border-white/10 px-6 py-16 lg:px-8">
            <div className="mx-auto max-w-5xl">
                <div className="mb-10">
                    <p className="text-sm uppercase tracking-[0.35em] text-gold">FAQ</p>
                    <h2 className="mt-4 text-4xl font-black uppercase tracking-[0.04em] text-white sm:text-5xl">Frequently asked questions.</h2>
                </div>
                <div className="space-y-4">
                    {faqs.map((faq, index) => {
                        const isOpen = openIndex === index;
                        return (
                            <div key={faq.question} className="overflow-hidden rounded-[28px] border border-white/10 bg-white/5">
                                <button
                                    type="button"
                                    onClick={() => setOpenIndex(isOpen ? null : index)}
                                    className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
                                >
                                    <span className="text-left text-lg font-semibold uppercase tracking-[0.04em] text-white">{faq.question}</span>
                                    <span className="text-sm uppercase tracking-[0.25em] text-gold">{isOpen ? 'Close' : 'Open'}</span>
                                </button>
                                <AnimatePresence initial={false}>
                                    {isOpen ? (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.35 }}
                                            className="px-6 pb-6 text-sm leading-7 text-white/70"
                                        >
                                            <p>{faq.answer}</p>
                                        </motion.div>
                                    ) : null}
                                </AnimatePresence>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
