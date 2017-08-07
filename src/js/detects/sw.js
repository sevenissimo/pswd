;(function (window, undefined) {

	'use strict';

	// Service worker detection and registration
	if ('serviceWorker' in navigator)
		window.addEventListener('load', function() {
			navigator.serviceWorker.register('sw.js');
		});

})(window);
