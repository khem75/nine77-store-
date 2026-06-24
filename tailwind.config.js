/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        './app/**/*.{js,ts,jsx,tsx}',
        './components/**/*.{js,ts,jsx,tsx}'
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ['var(--font-outfit)', 'system-ui', 'sans-serif'],
                display: ['var(--font-outfit)', 'system-ui', 'sans-serif'],
                mono: ['var(--font-rajdhani)', 'monospace'],
            },
            colors: {
                background: '#080808',
                'background-2': '#0D0D0D',
                gold: '#D4AF37',
                'gold-light': '#F0CB5A',
                'gold-dark': '#B8860B',
                'gold-muted': 'rgba(212,175,55,0.15)',
                muted: '#71717A',
                surface: 'rgba(255,255,255,0.04)',
                border: 'rgba(255,255,255,0.08)',
            },
            boxShadow: {
                glow: '0 0 40px rgba(212,175,55,0.25), 0 20px 60px rgba(212,175,55,0.12)',
                'glow-sm': '0 0 20px rgba(212,175,55,0.2)',
                'glow-lg': '0 0 80px rgba(212,175,55,0.3), 0 40px 100px rgba(212,175,55,0.15)',
                soft: '0 0 50px rgba(255,255,255,0.04)',
                cinematic: '0 25px 80px rgba(0,0,0,0.8)',
                card: '0 8px 40px rgba(0,0,0,0.6)',
            },
            backgroundImage: {
                'luxury-gradient': 'radial-gradient(ellipse at top, rgba(212,175,55,0.12) 0%, transparent 50%), radial-gradient(ellipse at bottom right, rgba(212,175,55,0.06) 0%, transparent 50%)',
                'hero-gradient': 'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(212,175,55,0.15) 0%, transparent 70%)',
                'card-gradient': 'linear-gradient(135deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 100%)',
                'gold-gradient': 'linear-gradient(135deg, #D4AF37 0%, #F0CB5A 50%, #B8860B 100%)',
                'text-gold': 'linear-gradient(135deg, #F0CB5A, #D4AF37, #B8860B)',
            },
            animation: {
                shimmer: 'shimmer 2.8s infinite',
                'float-slow': 'float 6s ease-in-out infinite',
                'float-medium': 'float 4s ease-in-out infinite',
                'pulse-gold': 'pulseGold 3s ease-in-out infinite',
                'scan': 'scan 3s linear infinite',
                'reveal-up': 'revealUp 0.8s cubic-bezier(0.16,1,0.3,1) both',
                'fade-in': 'fadeIn 1s ease both',
            },
            keyframes: {
                shimmer: {
                    '0%': { backgroundPosition: '-200% 0' },
                    '100%': { backgroundPosition: '200% 0' }
                },
                float: {
                    '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
                    '33%': { transform: 'translateY(-12px) rotate(0.5deg)' },
                    '66%': { transform: 'translateY(-6px) rotate(-0.5deg)' },
                },
                pulseGold: {
                    '0%, 100%': { boxShadow: '0 0 20px rgba(212,175,55,0.2)' },
                    '50%': { boxShadow: '0 0 40px rgba(212,175,55,0.5)' },
                },
                scan: {
                    '0%': { transform: 'translateY(-100%)' },
                    '100%': { transform: 'translateY(400%)' },
                },
                revealUp: {
                    from: { opacity: '0', transform: 'translateY(40px)' },
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
                'cinematic': 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
            },
        }
    },
    plugins: []
};
