const { SitemapStream, streamToPromise } = require('sitemap');
const fs = require('fs');

const sitemap = new SitemapStream({ hostname: 'https://example.com' });

const urls = [
    { url: '/', changefreq: 'daily', priority: 1.0 },
    { url: '/about', changefreq: 'monthly', priority: 0.8 },
    { url: '/contact', changefreq: 'monthly', priority: 0.8 }
];

urls.forEach(url => sitemap.write(url));
sitemap.end();

streamToPromise(sitemap).then(data => {
    fs.writeFileSync('public/sitemap.xml', data);
});
