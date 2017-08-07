/*!
 * PSWD v1.1.0: 
 * (c) 2017 Sevenissimo
 * MIT License
 * http://github.com/sevenissimo/pswd
 */

;(function (window, document, undefined) {

	'use strict';

	// Basic Javascript support detection
	if ('getElementById' in document && 'addEventListener' in window)
		document.documentElement.classList.remove('no-js');

})(window, document);
;(function (window, document, undefined) {

	'use strict';

	// SVG feature detection
	var supports = !!document.createElementNS && !!document.createElementNS('http://www.w3.org/2000/svg', 'svg').createSVGRect;
	if ( !supports ) return;

	// Add `.svg` class to <html> element
	document.documentElement.classList.add('svg');

})(window, document);
;(function (window, undefined) {

	'use strict';

	// Service worker detection and registration
	if ('serviceWorker' in navigator)
		window.addEventListener('load', function() {
			navigator.serviceWorker.register('sw.js');
		});

})(window);
