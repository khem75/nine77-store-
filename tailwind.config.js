/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        './app/**/*.{js,ts,jsx,tsx}',
        './components/**/*.{js,ts,jsx,tsx}',
        './app/(admin)/**/*.{js,ts,jsx,tsx}',
        './app/(store)/**/*.{js,ts,jsx,tsx}',
        './components/admin/**/*.{js,ts,jsx,tsx}'
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
                display: ['var(--font-sans)', 'system-ui', 'sans-serif'],
                mono: ['var(--font-sans)', 'monospace'],
            },
            colors: {
                /* ── Luxury Master Palette ── */
                background: '#F5F3EF',
                'background-2': '#EEE9E2',
                surface: '#EEE9E2',
                card: '#FFFFFF',

                /* ── Text ── */
                primary: '#111111',
                secondary: '#6B6B6B',
                muted: '#8A8A8A',

                /* ── Accent ── */
                gold: '#8B6A3E',
                'gold-light': '#A5804F',
                'gold-dark': '#6E522E',

                /* ── Borders ── */
                border: 'rgba(0, 0, 0, 0.08)',
                'border-subtle': 'rgba(0, 0, 0, 0.04)',

                /* ── Dark Sections ── */
                'hero-dark': '#0C0A08',
                'dark-surface': '#141210',
                'dark-card': '#1A1816',
            },
            spacing: {
                'mobile-nav': 'calc(100px + env(safe-area-inset-bottom))',
                'mobile-nav-sm': 'calc(80px + env(safe-area-inset-bottom))',
                'safe-bottom': 'env(safe-area-inset-bottom)',
            },
            boxShadow: {
                'luxury': '0 8px 32px rgba(0,0,0,0.06)',
                'luxury-lg': '0 16px 48px rgba(0,0,0,0.08)',
                'luxury-xl': '0 24px 64px rgba(0,0,0,0.1)',
                'card': '0 2px 16px rgba(0,0,0,0.04)',
                'card-hover': '0 16px 40px rgba(0,0,0,0.08)',
                'glow': '0 0 40px rgba(183,134,74,0.12)',
                'glow-sm': '0 0 20px rgba(183,134,74,0.08)',
                'glow-lg': '0 0 60px rgba(183,134,74,0.18)',
                'glass': '0 8px 32px rgba(0,0,0,0.06), inset 0 1px 0 rgba(255,255,255,0.5)',
                'soft': '0 1px 3px rgba(0,0,0,0.04)',
            },
            backgroundImage: {
                'gold-gradient': 'linear-gradient(135deg, #B7864A 0%, #C99B5F 50%, #9A6F3A 100%)',
                'warm-radial': 'radial-gradient(ellipse at center, rgba(183,134,74,0.08) 0%, transparent 70%)',
            },
            animation: {
                'shimmer': 'shimmer 2.8s infinite',
                'fade-in': 'fadeIn 0.5s ease both',
                'reveal-up': 'revealUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) both',
                'pulse-subtle': 'pulseSubtle 3s ease-in-out infinite',
                'float': 'float 6s ease-in-out infinite',
                'float-slow': 'float 8s ease-in-out infinite',
                'float-card-1': 'floatCard1 7s ease-in-out infinite',
                'float-card-2': 'floatCard2 8s ease-in-out infinite',
                'float-card-3': 'floatCard3 9s ease-in-out infinite',
                'scroll-bounce': 'scrollBounce 2s ease-in-out infinite',
                'grain': 'grainShift 0.5s steps(1) infinite',
            },
            keyframes: {
                shimmer: {
                    '0%': { backgroundPosition: '-200% 0' },
                    '100%': { backgroundPosition: '200% 0' },
                },
                revealUp: {
                    from: { opacity: '0', transform: 'translateY(24px)' },
                    to: { opacity: '1', transform: 'translateY(0)' },
                },
                fadeIn: {
                    from: { opacity: '0' },
                    to: { opacity: '1' },
                },
                pulseSubtle: {
                    '0%, 100%': { opacity: '1' },
                    '50%': { opacity: '0.7' },
                },
                float: {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-8px)' },
                },
                floatCard1: {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-12px)' },
                },
                floatCard2: {
                    '0%, 100%': { transform: 'translateY(0) rotate(0.5deg)' },
                    '50%': { transform: 'translateY(-8px) rotate(-0.5deg)' },
                },
                floatCard3: {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-10px)' },
                },
                scrollBounce: {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(6px)' },
                },
                grainShift: {
                    '0%': { transform: 'translate(0, 0)' },
                    '10%': { transform: 'translate(-1%, -1%)' },
                    '20%': { transform: 'translate(1%, 0%)' },
                    '30%': { transform: 'translate(0%, 1%)' },
                    '40%': { transform: 'translate(-1%, 0%)' },
                    '50%': { transform: 'translate(0%, -1%)' },
                    '60%': { transform: 'translate(1%, 1%)' },
                    '70%': { transform: 'translate(-1%, 1%)' },
                    '80%': { transform: 'translate(0%, -1%)' },
                    '90%': { transform: 'translate(1%, 0%)' },
                    '100%': { transform: 'translate(0, 0)' },
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
            transitionDuration: {
                '250': '250ms',
                '350': '350ms',
                '400': '400ms',
                '550': '550ms',
                '650': '650ms',
                '750': '750ms',
                '850': '850ms',
            },
            borderRadius: {
                'xl2': '20px',
                'xl3': '24px',
                'xl4': '28px',
                'xl5': '32px',
            },
        }
    },
    plugins: []
};
