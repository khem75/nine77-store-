export default function Robots() {
    return {
        rules: [
            {
                userAgent: '*',
                allow: '/'
            }
        ],
        sitemap: 'https://nine77-store.vercel.app/sitemap.xml'
    };
}
