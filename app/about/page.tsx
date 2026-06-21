export default function AboutPage() {
    return (
        <section className="px-6 py-16 lg:px-8">
            <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
                <div>
                    <p className="text-sm uppercase tracking-[0.35em] text-gold">About</p>
                    <h1 className="mt-4 text-4xl font-black uppercase tracking-[0.04em] text-white sm:text-5xl">The story behind NINE77.</h1>
                    <p className="mt-6 max-w-2xl text-sm leading-8 text-white/70">
                        NINE77 fuses premium materials with modern streetwear direction. We build pieces that reflect refined attitude, elevated minimalism and lasting craftsmanship.
                    </p>
                    <div className="mt-10 grid gap-6 sm:grid-cols-2">
                        <div className="rounded-[28px] border border-white/10 bg-white/5 p-8">
                            <h2 className="text-xl font-semibold uppercase tracking-[0.08em] text-white">Premium materials</h2>
                            <p className="mt-4 text-sm leading-7 text-white/70">Every piece is designed with careful fabric selection and a luxury-focused finish.</p>
                        </div>
                        <div className="rounded-[28px] border border-white/10 bg-white/5 p-8">
                            <h2 className="text-xl font-semibold uppercase tracking-[0.08em] text-white">Quiet luxury</h2>
                            <p className="mt-4 text-sm leading-7 text-white/70">Modern streetwear with subtle premium styling for an exclusive accent.</p>
                        </div>
                    </div>
                </div>
                <div className="rounded-[32px] border border-white/10 bg-white/5 p-8">
                    <div className="rounded-[28px] border border-white/10 bg-black/50 p-12 text-center">
                        <p className="text-sm uppercase tracking-[0.35em] text-gold">Editorial visual</p>
                        <p className="mt-6 text-2xl font-black uppercase tracking-[0.08em] text-white">Luxury is a feeling, not just a label.</p>
                    </div>
                </div>
            </div>
        </section>
    );
}
