const CACHE_NAME = 'cLockCache';
const urlsToCache = [
    '/',
    '/index.html',
    '/assets/js/main.js',
    '/assets/css/styles.css',
    '/assets/audio/alarm.mp3',
    '/assets/audio/timer.mp3',
    '/assets/favicon/favicon-96x96.png',
    '/assets/favicon/favicon.svg',
    '/assets/favicon/favicon.ico',
    '/assets/favicon/apple-touch-icon.png',
    '/assets/favicon/site.webmanifest',
    'https://unpkg.com/react@18/umd/react.production.min.js',
    'https://unpkg.com/react-dom@18/umd/react-dom.production.min.js',
    'https://error.403.pp.ua/babel',
    'https://error.403.pp.ua/tw',
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css',
    'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.min.js',
    'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf_viewer.min.css',
    'https://unpkg.com/jszip/dist/jszip.min.js',
    'https://unpkg.com/tiff.js@1.0.0/tiff.min.js',
    'https://volodymyrbaydalka.github.io/docxjs/dist/docx-preview.js',
    'https://volodymyrbaydalka.github.io/docxjs/demo/tiff-preprocessor.js',
    'https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js',
    'https://raw.githubusercontent.com/Stuk/jszip/refs/heads/main/dist/jszip.min.js',
    'https://cdnjs.cloudflare.com/ajax/libs/prism/1.24.1/themes/prism.min.css',
    'https://cdnjs.cloudflare.com/ajax/libs/prism/1.24.1/prism.min.js',
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/webfonts/fa-solid-900.woff2',
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/webfonts/fa-solid-900.woff',
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/webfonts/fa-solid-900.ttf',
];

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Opened cache');
                return cache.addAll(urlsToCache);
            })
    );
});

self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                return response || fetch(event.request);
            })
    );
});