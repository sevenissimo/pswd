/*!
 * Kraken v7.5.2: A lightweight front-end boilerplate
 * (c) 2017 Chris Ferdinandi
 * MIT License
 * http://github.com/cferdinandi/kraken
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