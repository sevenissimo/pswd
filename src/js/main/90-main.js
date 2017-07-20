/*
 * IE9+ DOM Ready
 * @link http://youmightnotneedjquery.com/#ready
 */
;(function ready(fn) {
	if (document.readyState != 'loading') {
		fn();
	} else {
		document.addEventListener('DOMContentLoaded', fn);
	}
})(function() {
	
	'use srict';

	// Feature test -----------------------------
	// If minimum requirements are meet, show the app
	if ('getElementById' in document && 'addEventListener' in window)
		document.getElementById('app').removeAttribute('hidden');

	// ('localStorage' in window && !!localStorage.setItem)
	// ........?

	// Helper functions
	var getParamU = function(str) { return decodeURIComponent((m = str.match(/(?:u=)([^&]*)/)) ? m[1] : null) },
		getDomain = function(url) { return (m = url.match(/(?:\w+\.)?(\w+\.\w{2,})/)) ? m[1] : null };

	// Cached DOM elements
	var seed   = document.getElementById('seed')
	  , pass   = document.getElementById('pass')
	  , result = document.getElementById('result')
	  , domain = document.getElementById('domain')
	  , chart  = document.getElementById('chart')
	  , hash   = document.getElementById('hash');

	// Cached DOM collection
	var data = [
		document.querySelector('a[href="#data"]'),
		document.getElementById('data')
	];


	// Password Chart functions -----------------

	var seedUpdate = function() {
		// Re-init Password Chart
		// if seed value is empty, resets Password Chart
		PasswordChart.init(seed.value);

		if (seed.value) {
			// Update chart and infos
			domain.innerHTML = seed.value || '';
			 chart.innerHTML = PasswordChart.chart();
			  hash.innerHTML = '#'+ PasswordChart.hash();

			// Show data tab
			Array.prototype.forEach.call(data, function(el, i) {
				el.removeAttribute('hidden');
			});

			resultUpdate();
		} else {
			// Hide data tab and its content
			Array.prototype.forEach.call(data, function(el, i) {
				el.setAttribute('hidden', true);
			});
		}
	};

	var resultUpdate = function() {
		if (seed.value && pass.value)
			result.value = PasswordChart.derive(pass.value);
	};


	// DOM: All inputs --------------------------

	// IE9+ forEach
	// @link http://youmightnotneedjquery.com/#each
	Array.prototype.forEach.call(
		document.querySelectorAll('input'), function(el, i) {
			// Select on focus
			el.addEventListener('focus', function(e) {
				// Prevent first click to deselect
				// @link: http://stackoverflow.com/a/18534059
				this.addEventListener('mouseup', function cb(e) {
					// One-time event handlers in JavaScript
					// @link: https://www.sitepoint.com/create-one-time-events-javascript/
					this.removeEventListener(e.type, cb);
					this.select();
					e.preventDefault();
				});
				this.select();
			});
		}
	);

	// DOM: Seed --------------------------------

	seed.addEventListener('input', seedUpdate);
	seed.addEventListener('keyup', function(e) {
		// Focus next on <return>
		if (e.keyCode == 13 && this.value)
			pass.focus();
	});

	seed.addEventListener('paste', function(e) {
		// Parse clipboard data
		if (d = getDomain(e.clipboardData.getData('text'))) {
			this.value = d;
			e.preventDefault();
		}
		seedUpdate();
	});

	// onLoad
	if (d = getDomain(getParamU(window.location.search))) {
		seed.value = d;
		seedUpdate();
	};
	seed.focus();

	// DOM: Pass --------------------------------

	pass.addEventListener('input', resultUpdate)
	pass.addEventListener('keyup', function(e) {
		// Focus next on <return>
		if (e.keyCode == 13 && this.value)
			result.focus();
	});

	['focus', 'input'].forEach(function(event, i) {
		pass.addEventListener(event, function(e) {
			if ('true' === localStorage.getItem('visible-pass')
			&&  this.value.length <= 1) // Show only if empty
				this.type = 'text';
		});
	});
	pass.addEventListener('blur',  function(e) {
		this.type = 'password';
	});

	// DOM: Result ------------------------------

	result.addEventListener('copy', function() {
		if ('true' === localStorage.getItem('clear-on-copy'))
			this.value = '';

		alert('Derived password copied to clipboard!');
	});


	// DOM: Extras: save & print ----------------

	document.getElementById('save').addEventListener('click', function(e) {
		var br = "\r\n\r\n"
		  , blob = new Blob(
			['Chart for '+ seed.value.toUpperCase(), br, PasswordChart.chart(), br,
			 'Chart ID #'+ PasswordChart.hash()],
			{type: 'text/plain'});

		this.setAttribute('download', seed.value + '.txt');
		this.href = URL.createObjectURL(blob);

		// IE10+ : has Blob, but not a[download]
		// @link: http://danml.com/download.html#source
		if (navigator.msSaveBlob) { 
			navigator.msSaveBlob(blob, seed.value +'.txt');
			e.preventDefault();
		}
	});

	document.getElementById('print').addEventListener('click', print.bind(window));


	// DOM: Preferences -------------------------

	// IE9+ forEach
	// @link http://youmightnotneedjquery.com/#each
	Array.prototype.forEach.call(
		document.getElementById('prefs').querySelectorAll('input[type=checkbox]'),
		function(el, i) {
			// onLoad sync prefs
			el.checked = ('true' === localStorage.getItem(el.id));

			// Listen for changes
			el.addEventListener('change', function(e) {
				//console.log(el.id + " changed: " + el.checked);
				localStorage.setItem(el.id, el.checked);
			});
		}
	);


	// Modules init --------------------------

	tabby.init();
});
