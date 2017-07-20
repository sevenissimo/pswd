;(function (window, document, undefined) {

	'use strict';

	// Basic Javascript support detection
	if ('getElementById' in document && 'addEventListener' in window)
		document.documentElement.classList.remove('no-js');

})(window, document);