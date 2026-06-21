/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        './app/**/*.{js,ts,jsx,tsx}',
        './components/**/*.{js,ts,jsx,tsx}'
    ],
    theme: {
        extend: {
            colors: {
                background: '#0A0A0A',
                gold: '#D4AF37',
                'gold-dark': '#B8860B',
                muted: '#A1A1AA'
            },
            boxShadow: {
                glow: '0 20px 60px rgba(212,175,55,0.18)',
                soft: '0 0 50px rgba(255,255,255,0.06)'
            },
            backgroundImage: {
                'luxury-gradient': 'radial-gradient(circle at top, rgba(212,175,55,0.15), transparent 40%), radial-gradient(circle at bottom, rgba(255,255,255,0.05), transparent 25%)'
            },
            animation: {
                shimmer: 'shimmer 2.8s infinite'
            },
            keyframes: {
                shimmer: {
                    '0%': { backgroundPosition: '-200% 0' },
                    '100%': { backgroundPosition: '200% 0' }
                }
            }
        }
    },
    plugins: []
};
