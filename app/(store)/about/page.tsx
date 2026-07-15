import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';

export const metadata: Metadata = {
    title: 'About',
    description:
        'NINE77 fuses premium materials with modern streetwear direction. The story behind the brand — built for those who refuse to blend in.',
};

const pillars = [
    {
        label: 'Material',
        heading: 'Premium Fabrics',
        body: 'Every piece begins with careful material selection — heavyweight cottons, luxury linens, and technical weaves chosen for weight, drape, and lasting structure.',
    },
    {
        label: 'Craft',
        heading: 'Museum-Grade Construction',
        body: 'We obsess over stitch count, seam placement, and silhouette geometry. Each garment is built with the precision of a couture atelier, not a mass production line.',
    },
    {
        label: 'Vision',
        heading: 'Quiet Luxury',
        body: 'NINE77 speaks without shouting. Minimal branding, architectural proportions, and editorial restraint that positions each piece as a statement, not a logo.',
    },
    {
        label: 'Culture',
        heading: 'Built for the Bold',
        body: 'For those who move with intention. NINE77 is for a generation that values quality over quantity and is unwilling to compromise on how they show up.',
    },
];

export default function AboutPage() {
    return (
        <>
            {/* Hero Section */}
            <section className="relative min-h-[65vh] flex items-end bg-background pt-[92px] overflow-hidden border-b border-border">
                {/* Background image */}
                <div className="absolute inset-0 z-0">
                    <Image
                        src="/about-image.jpg"
                        alt="NINE77 campaign editorial"
                        fill
                        priority
                        sizes="100vw"
                        className="object-cover object-top opacity-20"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
                </div>

                <div className="relative z-10 mx-auto max-w-[1440px] px-6 lg:px-12 pb-16 md:pb-24 w-full">
                    <p className="text-[10px] uppercase tracking-[0.48em] text-gold font-bold mb-4">
                        The Brand
                    </p>
                    <h1 className="text-[clamp(2.8rem,7vw,6rem)] font-black uppercase leading-[0.88] tracking-tight text-primary max-w-3xl">
                        Built<br />
                        <span className="text-gold">Different.</span>
                    </h1>
                    <p className="mt-6 max-w-lg text-[14px] leading-relaxed text-secondary font-light">
                        NINE77 is a luxury streetwear label engineered for those who refuse to blend in.
                        Rooted in architectural silhouettes and museum-grade craftsmanship.
                    </p>
                </div>
            </section>

            {/* Philosophy Section */}
            <section className="py-20 md:py-32 border-b border-border bg-background px-6 lg:px-12">
                <div className="mx-auto max-w-[1440px]">
                    <div className="grid gap-12 md:grid-cols-2 md:gap-20 items-start">
                        {/* Left: Text */}
                        <div>
                            <p className="text-[10px] uppercase tracking-[0.45em] text-gold font-bold mb-4">
                                Our Philosophy
                            </p>
                            <h2 className="text-3xl md:text-5xl font-black uppercase leading-[0.9] tracking-tight text-primary mb-8">
                                Luxury is a feeling,<br />not just a label.
                            </h2>
                            <div className="space-y-5">
                                <p className="text-[14px] leading-[1.8] text-secondary font-light">
                                    We started NINE77 with one belief: that premium garments shouldn&apos;t require a heritage brand name. They require obsession over every detail — the weight of the fabric, the architecture of the cut, the longevity of the finish.
                                </p>
                                <p className="text-[14px] leading-[1.8] text-secondary font-light">
                                    Fusing luxury material selectives with contemporary streetwear proportions, each piece balances quiet sophistication with bold visual attitude. Built to speak without shouting.
                                </p>
                            </div>
                        </div>

                        {/* Right: Image */}
                        <div className="relative aspect-[4/5] rounded-[24px] overflow-hidden border border-border bg-background-2">
                            <Image
                                src="/about-image.jpg"
                                alt="NINE77 editorial campaign shoot"
                                fill
                                sizes="(max-width: 768px) 100vw, 50vw"
                                className="object-cover object-top"
                                loading="lazy"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                        </div>
                    </div>
                </div>
            </section>

            {/* Brand Pillars */}
            <section className="py-20 md:py-32 border-b border-border bg-background px-6 lg:px-12">
                <div className="mx-auto max-w-[1440px]">
                    <div className="mb-14">
                        <p className="text-[10px] uppercase tracking-[0.45em] text-gold font-bold mb-3">
                            What We Stand For
                        </p>
                        <h2 className="text-3xl md:text-5xl font-black uppercase leading-[0.9] tracking-tight text-primary">
                            The Four Pillars
                        </h2>
                    </div>

                    <div className="grid gap-px bg-border border border-border rounded-[24px] overflow-hidden md:grid-cols-2">
                        {pillars.map((pillar, idx) => (
                            <div
                                key={pillar.label}
                                className="bg-white p-8 md:p-10 space-y-3 hover:bg-background-2 transition-colors duration-300"
                            >
                                <p className="text-[9px] uppercase tracking-[0.4em] text-gold font-bold">
                                    {String(idx + 1).padStart(2, '0')} — {pillar.label}
                                </p>
                                <h3 className="text-xl font-black uppercase tracking-tight text-primary">
                                    {pillar.heading}
                                </h3>
                                <p className="text-[13px] leading-relaxed text-secondary font-light">
                                    {pillar.body}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 md:py-28 bg-background px-6 lg:px-12">
                <div className="mx-auto max-w-2xl text-center">
                    <p className="text-[10px] uppercase tracking-[0.45em] text-gold font-bold mb-4">
                        Ready?
                    </p>
                    <h2 className="text-3xl md:text-5xl font-black uppercase leading-[0.9] tracking-tight text-primary mb-6">
                        Shop the Collection
                    </h2>
                    <p className="text-sm text-secondary mb-10 leading-relaxed font-light">
                        Explore the full NINE77 catalog. Premium streetwear, exclusive drops, WhatsApp checkout.
                    </p>
                    <Link
                        href="/shop"
                        className="inline-flex h-12 items-center justify-center gap-3 rounded-full bg-gold px-8 text-[11px] font-bold uppercase tracking-[0.25em] text-white transition-all duration-300 hover:bg-gold-light hover:shadow-[0_8px_30px_rgba(183,134,74,0.22)] hover:-translate-y-0.5 active:scale-[0.98]"
                    >
                        Browse Collection
                    </Link>
                </div>
            </section>
        </>
    );
}
