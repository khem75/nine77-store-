'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const faqs = [
    { question: 'How can I place an order?', answer: 'You can place an order by browsing the collection and selecting the product, size, and quantity on the product page. Then tap the order button to begin your WhatsApp order.' },
    { question: 'What is the delivery time?', answer: 'Standard delivery is 3-5 business days across Nepal. Orders are processed within 24 hours and shipped with premium protective packaging.' },
    { question: 'What sizes do you offer?', answer: 'We offer S, M, L, and XL across the entire collection. Each style is designed for elevated streetwear proportions and modern visual drape.' },
    { question: 'What is your return policy?', answer: 'We accept returns for damaged or incorrect items within 7 days of delivery. Contact us through WhatsApp for instant assistance.' }
];

export default function FAQAccordion() {
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    return (
        <section className="border-t border-[#E8E3DC] bg-background px-5 py-16 md:py-24 md:px-12 lg:px-16">
            <div className="mx-auto max-w-4xl">
                <div className="mb-10 text-center md:text-left">
                    <p className="text-[9px] md:text-[10px] uppercase tracking-[0.4em] text-gold font-bold">Frequently Asked Questions</p>
                    <h2 className="mt-2 text-2xl md:text-4xl font-black uppercase tracking-tight text-primary">Everything You Need To Know</h2>
                </div>
                <div className="space-y-3">
                    {faqs.map((faq, index) => {
                        const isOpen = openIndex === index;
                        return (
                            <div key={faq.question} className="overflow-hidden rounded-[18px] border border-[#E8E3DC] bg-card shadow-card">
                                <button
                                    type="button"
                                    onClick={() => setOpenIndex(isOpen ? null : index)}
                                    className="flex w-full min-h-[52px] items-center justify-between gap-4 px-5 py-4 text-left cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/60"
                                >
                                    <span className="text-[13px] md:text-[14px] font-bold uppercase tracking-tight text-primary">{faq.question}</span>
                                    <motion.span
                                        animate={{ rotate: isOpen ? 180 : 0 }}
                                        transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                                        className="text-gold shrink-0"
                                    >
                                        <ChevronDown size={16} strokeWidth={1.75} />
                                    </motion.span>
                                </button>
                                <AnimatePresence initial={false}>
                                    {isOpen ? (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                                            className="px-5 pb-5 text-[12px] md:text-[13px] leading-relaxed text-secondary font-light border-t border-[#E8E3DC]/50 pt-3"
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
