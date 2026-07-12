/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        './app/**/*.{js,ts,jsx,tsx}',
        './components/**/*.{js,ts,jsx,tsx}'
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
                display: ['var(--font-sans)', 'system-ui', 'sans-serif'],
                mono: ['var(--font-sans)', 'monospace'],
            },
            colors: {
                background: '#070707',
                'background-2': '#0F0F10',
                surface: '#111111',
                card: '#161616',
                gold: '#D4AF37',
                'gold-light': '#E8C95A',
                'gold-dark': '#B8960A',
                muted: '#A5A5A5',
                border: 'rgba(255,255,255,0.08)',
                'border-subtle': 'rgba(255,255,255,0.05)',
            },
            boxShadow: {
                glow: '0 0 40px rgba(212,175,55,0.15)',
                'glow-sm': '0 0 20px rgba(212,175,55,0.1)',
                soft: '0 0 50px rgba(255,255,255,0.02)',
                card: '0 8px 30px rgba(0,0,0,0.5)',
            },
            backgroundImage: {
                'gold-gradient': 'linear-gradient(135deg, #D4AF37 0%, #E8C95A 50%, #B8960A 100%)',
            },
            animation: {
                shimmer: 'shimmer 2.8s infinite',
                'fade-in': 'fadeIn 0.5s ease both',
                'reveal-up': 'revealUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) both',
            },
            keyframes: {
                shimmer: {
                    '0%': { backgroundPosition: '-200% 0' },
                    '100%': { backgroundPosition: '200% 0' }
                },
                revealUp: {
                    from: { opacity: '0', transform: 'translateY(24px)' },
                    to: { opacity: '1', transform: 'translateY(0)' },
                },
                fadeIn: {
                    from: { opacity: '0' },
                    to: { opacity: '1' },
                },
            },
            letterSpacing: {
                'ultra': '0.4em',
                'editorial': '0.25em',
                'wide-xl': '0.15em',
            },
            transitionTimingFunction: {
                'luxury': 'cubic-bezier(0.16, 1, 0.3, 1)',
            },
        }
    },
    plugins: []
};
