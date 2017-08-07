/*!
 * PSWD v1.1.0: 
 * (c) 2017 Sevenissimo
 * MIT License
 * http://github.com/sevenissimo/pswd
 */

// Helper functions
var swLog = function(error) { console.log('Service worker: '+ error.message); };

// Config
var urls = [
	'/',
	'/dist/css/main.min.css',
	'/dist/js/detects.min.js', '/dist/js/main.min.js', '/dist/js/modules.min.js'
];


// Service worker installation, open cache
self.addEventListener('install', function(event) {
	event.waitUntil(
		caches
			.open(CACHE_NAME)
			.then(function(cache) {
				return cache.addAll(urls);
			})
			.catch(swLog)
	);
});

// Service worker @ work, serve from cache
self.addEventListener('fetch', function(event) {
	event.respondWith(
		caches
			.match(event.request)
			.then(function(response) {
				return response || fetch(event.request);
			})
			.catch(swLog)
	);
});

// Service worker updated, clear old cache
self.addEventListener('activate', function(event) {
	event.waitUntil(
		caches
			.keys() // -> cacheNames
			.then(function(cacheNames) {
				return Promise.all(
					cacheNames.map(function(cacheName) {
						if (cacheName != CACHE_NAME)
							return caches.delete(cacheName);
					})
				);
			})
	);
});


// Var CACHE_NAME set by gulp
var CACHE_NAME = "PSWD-1502140100396";