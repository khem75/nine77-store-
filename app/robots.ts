export default function Robots() {
    return {
        rules: [
            {
                userAgent: '*',
                allow: '/'
            }
        ],
        sitemap: 'https://nine77.example/sitemap.xml'
    };
}
