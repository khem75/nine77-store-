const nextConfig = {
    images: {
        remotePatterns: [
            // Allow any Supabase project storage URLs
            {
                protocol: 'https',
                hostname: '*.supabase.co',
                pathname: '/storage/v1/object/public/**',
            },
            // Allow local dev Supabase
            {
                protocol: 'http',
                hostname: '127.0.0.1',
                port: '54321',
                pathname: '/storage/v1/object/public/**',
            },
            // qrserver.com — QR code fallback until /public/whatsapp-qr.png is added
            {
                protocol: 'https',
                hostname: 'api.qrserver.com',
            },
        ],
    },
    transpilePackages: ['three', '@react-three/fiber', '@react-three/drei'],
};

export default nextConfig;
