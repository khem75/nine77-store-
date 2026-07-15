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
                background: '#0B0B0B',
                'background-2': '#171717',
                surface: '#1E1E1E',
                card: '#1A1A1A',
                gold: '#C7A46A',
                'gold-light': '#D8BE8E',
                'gold-dark': '#B08B4E',
                muted: '#9E9E9E',
                border: 'rgba(255,255,255,0.08)',
                'border-subtle': 'rgba(255,255,255,0.05)',
            },
            spacing: {
                // Bottom nav clearance: 80px nav pill + 20px gap + safe area
                'mobile-nav': 'calc(100px + env(safe-area-inset-bottom))',
                'mobile-nav-sm': 'calc(80px + env(safe-area-inset-bottom))',
                'safe-bottom': 'env(safe-area-inset-bottom)',
            },
            boxShadow: {
                glow: '0 0 40px rgba(212,175,55,0.15)',
                'glow-sm': '0 0 20px rgba(212,175,55,0.1)',
                'glow-lg': '0 0 60px rgba(212,175,55,0.25)',
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
                'pulse-subtle': 'pulseSubtle 3s ease-in-out infinite',
                'float': 'float 6s ease-in-out infinite',
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
                pulseSubtle: {
                    '0%, 100%': { opacity: '1' },
                    '50%': { opacity: '0.7' },
                },
                float: {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-8px)' },
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
