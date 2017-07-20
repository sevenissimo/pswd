/*! TODO */
/*
 * chart.js | (C) 2006 Doug Martin | passwordchart.com
 */


/*
 * UMD (Universal Module Definition)
 * @link https://github.com/umdjs/umd/
 */
;(function (root, factory) {
	if ( typeof define === 'function' && define.amd ) {
		define([], factory);
	} else if ( typeof exports === 'object' ) {
		module.exports = factory();
	} else {
		root.PasswordChart = factory();
	}
})(this, function () {

	'use strict';

	// Private
	var hash, table =  new Array(), // Translation table
		mt = MersenneTwister;       // Pseudorandom Number Generator

	function generate() {
		var map = {
			//	0: function() { return false },
				1: function() {
					return ((mt.rand(1)) ?
							'abcdefghijkmnpqrstuvwxyz' :
							'ABCDEFGHIJKLMNPQRSTUVWXY'
						).charAt(mt.rand(23)) },
				2: function() { return '346789'.charAt(mt.rand(5)) },
				3: function() { return '~!@#$%^&*_+?'.charAt(mt.rand(11)) }
			}

		// Fill translation table
		for (var i=0; i<36; i++) {
			var len = mt.rand(1,3)
				table[i] = ''

			while (table[i].length < len)
				table[i] += map[mt.rand(3) || 1]();
		}
	}

	function plot() {
		// Plot the chart
		for (var result='', i=0; i<36; i++)
			result += "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789".charAt(i) + ": "
			       +  table[i] + (((i + 1) % 4 == 0) ? "\r\n" : "\t");
		return result
	}

	function derive(str) {
		return
	}

	// Public
	return {
		init: function(seed) {
			// Drop table, anyway.
			table = new Array();

			if (!seed) return;

			// Use always-lowercase seed as it should be a domain name.
			seed = seed.toLowerCase();

			// Hash the seed and use the first 4 bytes as the random number seed.
			// The Mersenne Twister masks off everything above the first 4 bytes.
			hash = parseInt(md5(seed).substr(0,8), 16);

			// Seed Mersenne Twister pseudorandom number generator
			mt.seed(hash);

			// Generate translation table
			generate();
		},

		hash: function() {
			if (!table.length) return null;

			return hash * 4;
		},

		chart: function() {
			if (!table.length) return '';

			// Return chart as plain text
			return plot();
		},

		derive: function(pass) {
			if (!table.length || !pass) return;

			// ...?
			pass = pass.toUpperCase();

			for (var result='', c, i=0; i<pass.length; i++) {
				c = pass.charAt(i);

				if ((c >= '0') && (c <= '9'))
					result += table[26 + (c.charCodeAt(0) - 48)];
				else if ((c >= 'A') && (c <= 'Z'))
					result += table[c.charCodeAt(0) - 65];
			}

			return result
		}
	}

});
