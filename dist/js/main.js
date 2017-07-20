/*!
 * PSWD v1.0.0: 
 * (c) 2017 Sevenissimo
 * MIT License
 * http://github.com/sevenissimo/pswd
 */

/*! JavaScript MD5 v2.4.0 | (c) 2011 Sebastian Tschan | MIT license | https://github.com/blueimp/JavaScript-MD5 */
/*
 * JavaScript MD5
 * https://github.com/blueimp/JavaScript-MD5
 *
 * Copyright 2011, Sebastian Tschan
 * https://blueimp.net
 *
 * Licensed under the MIT license:
 * http://www.opensource.org/licenses/MIT
 *
 * Based on
 * A JavaScript implementation of the RSA Data Security, Inc. MD5 Message
 * Digest Algorithm, as defined in RFC 1321.
 * Version 2.2 Copyright (C) Paul Johnston 1999 - 2009
 * Other contributors: Greg Holt, Andrew Kepert, Ydnar, Lostinet
 * Distributed under the BSD License
 * See http://pajhome.org.uk/crypt/md5 for more info.
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
		root.md5 = factory();
	}
})(this, function () {

	'use strict'

	/*
	* Add integers, wrapping at 2^32. This uses 16-bit operations internally
	* to work around bugs in some JS interpreters.
	*/
	function safeAdd (x, y) {
		var lsw = (x & 0xFFFF) + (y & 0xFFFF)
		var msw = (x >> 16) + (y >> 16) + (lsw >> 16)
		return (msw << 16) | (lsw & 0xFFFF)
	}

	/*
	* Bitwise rotate a 32-bit number to the left.
	*/
	function bitRotateLeft (num, cnt) {
		return (num << cnt) | (num >>> (32 - cnt))
	}

	/*
	* These functions implement the four basic operations the algorithm uses.
	*/
	function md5cmn (q, a, b, x, s, t) {
		return safeAdd(bitRotateLeft(safeAdd(safeAdd(a, q), safeAdd(x, t)), s), b)
	}
	function md5ff (a, b, c, d, x, s, t) {
		return md5cmn((b & c) | ((~b) & d), a, b, x, s, t)
	}
	function md5gg (a, b, c, d, x, s, t) {
		return md5cmn((b & d) | (c & (~d)), a, b, x, s, t)
	}
	function md5hh (a, b, c, d, x, s, t) {
		return md5cmn(b ^ c ^ d, a, b, x, s, t)
	}
	function md5ii (a, b, c, d, x, s, t) {
		return md5cmn(c ^ (b | (~d)), a, b, x, s, t)
	}

	/*
	* Calculate the MD5 of an array of little-endian words, and a bit length.
	*/
	function binlMD5 (x, len) {
		/* append padding */
		x[len >> 5] |= 0x80 << (len % 32)
		x[(((len + 64) >>> 9) << 4) + 14] = len

		var i
		var olda
		var oldb
		var oldc
		var oldd
		var a = 1732584193
		var b = -271733879
		var c = -1732584194
		var d = 271733878

		for (i = 0; i < x.length; i += 16) {
			olda = a
			oldb = b
			oldc = c
			oldd = d

			a = md5ff(a, b, c, d, x[i], 7, -680876936)
			d = md5ff(d, a, b, c, x[i + 1], 12, -389564586)
			c = md5ff(c, d, a, b, x[i + 2], 17, 606105819)
			b = md5ff(b, c, d, a, x[i + 3], 22, -1044525330)
			a = md5ff(a, b, c, d, x[i + 4], 7, -176418897)
			d = md5ff(d, a, b, c, x[i + 5], 12, 1200080426)
			c = md5ff(c, d, a, b, x[i + 6], 17, -1473231341)
			b = md5ff(b, c, d, a, x[i + 7], 22, -45705983)
			a = md5ff(a, b, c, d, x[i + 8], 7, 1770035416)
			d = md5ff(d, a, b, c, x[i + 9], 12, -1958414417)
			c = md5ff(c, d, a, b, x[i + 10], 17, -42063)
			b = md5ff(b, c, d, a, x[i + 11], 22, -1990404162)
			a = md5ff(a, b, c, d, x[i + 12], 7, 1804603682)
			d = md5ff(d, a, b, c, x[i + 13], 12, -40341101)
			c = md5ff(c, d, a, b, x[i + 14], 17, -1502002290)
			b = md5ff(b, c, d, a, x[i + 15], 22, 1236535329)

			a = md5gg(a, b, c, d, x[i + 1], 5, -165796510)
			d = md5gg(d, a, b, c, x[i + 6], 9, -1069501632)
			c = md5gg(c, d, a, b, x[i + 11], 14, 643717713)
			b = md5gg(b, c, d, a, x[i], 20, -373897302)
			a = md5gg(a, b, c, d, x[i + 5], 5, -701558691)
			d = md5gg(d, a, b, c, x[i + 10], 9, 38016083)
			c = md5gg(c, d, a, b, x[i + 15], 14, -660478335)
			b = md5gg(b, c, d, a, x[i + 4], 20, -405537848)
			a = md5gg(a, b, c, d, x[i + 9], 5, 568446438)
			d = md5gg(d, a, b, c, x[i + 14], 9, -1019803690)
			c = md5gg(c, d, a, b, x[i + 3], 14, -187363961)
			b = md5gg(b, c, d, a, x[i + 8], 20, 1163531501)
			a = md5gg(a, b, c, d, x[i + 13], 5, -1444681467)
			d = md5gg(d, a, b, c, x[i + 2], 9, -51403784)
			c = md5gg(c, d, a, b, x[i + 7], 14, 1735328473)
			b = md5gg(b, c, d, a, x[i + 12], 20, -1926607734)

			a = md5hh(a, b, c, d, x[i + 5], 4, -378558)
			d = md5hh(d, a, b, c, x[i + 8], 11, -2022574463)
			c = md5hh(c, d, a, b, x[i + 11], 16, 1839030562)
			b = md5hh(b, c, d, a, x[i + 14], 23, -35309556)
			a = md5hh(a, b, c, d, x[i + 1], 4, -1530992060)
			d = md5hh(d, a, b, c, x[i + 4], 11, 1272893353)
			c = md5hh(c, d, a, b, x[i + 7], 16, -155497632)
			b = md5hh(b, c, d, a, x[i + 10], 23, -1094730640)
			a = md5hh(a, b, c, d, x[i + 13], 4, 681279174)
			d = md5hh(d, a, b, c, x[i], 11, -358537222)
			c = md5hh(c, d, a, b, x[i + 3], 16, -722521979)
			b = md5hh(b, c, d, a, x[i + 6], 23, 76029189)
			a = md5hh(a, b, c, d, x[i + 9], 4, -640364487)
			d = md5hh(d, a, b, c, x[i + 12], 11, -421815835)
			c = md5hh(c, d, a, b, x[i + 15], 16, 530742520)
			b = md5hh(b, c, d, a, x[i + 2], 23, -995338651)

			a = md5ii(a, b, c, d, x[i], 6, -198630844)
			d = md5ii(d, a, b, c, x[i + 7], 10, 1126891415)
			c = md5ii(c, d, a, b, x[i + 14], 15, -1416354905)
			b = md5ii(b, c, d, a, x[i + 5], 21, -57434055)
			a = md5ii(a, b, c, d, x[i + 12], 6, 1700485571)
			d = md5ii(d, a, b, c, x[i + 3], 10, -1894986606)
			c = md5ii(c, d, a, b, x[i + 10], 15, -1051523)
			b = md5ii(b, c, d, a, x[i + 1], 21, -2054922799)
			a = md5ii(a, b, c, d, x[i + 8], 6, 1873313359)
			d = md5ii(d, a, b, c, x[i + 15], 10, -30611744)
			c = md5ii(c, d, a, b, x[i + 6], 15, -1560198380)
			b = md5ii(b, c, d, a, x[i + 13], 21, 1309151649)
			a = md5ii(a, b, c, d, x[i + 4], 6, -145523070)
			d = md5ii(d, a, b, c, x[i + 11], 10, -1120210379)
			c = md5ii(c, d, a, b, x[i + 2], 15, 718787259)
			b = md5ii(b, c, d, a, x[i + 9], 21, -343485551)

			a = safeAdd(a, olda)
			b = safeAdd(b, oldb)
			c = safeAdd(c, oldc)
			d = safeAdd(d, oldd)
		}
		return [a, b, c, d]
	}

	/*
	* Convert an array of little-endian words to a string
	*/
	function binl2rstr (input) {
		var i
		var output = ''
		var length32 = input.length * 32
		for (i = 0; i < length32; i += 8) {
			output += String.fromCharCode((input[i >> 5] >>> (i % 32)) & 0xFF)
		}
		return output
	}

	/*
	* Convert a raw string to an array of little-endian words
	* Characters >255 have their high-byte silently ignored.
	*/
	function rstr2binl (input) {
		var i
		var output = []
		output[(input.length >> 2) - 1] = undefined
		for (i = 0; i < output.length; i += 1) {
			output[i] = 0
		}
		var length8 = input.length * 8
		for (i = 0; i < length8; i += 8) {
			output[i >> 5] |= (input.charCodeAt(i / 8) & 0xFF) << (i % 32)
		}
		return output
	}

	/*
	* Calculate the MD5 of a raw string
	*/
	function rstrMD5 (s) {
		return binl2rstr(binlMD5(rstr2binl(s), s.length * 8))
	}

	/*
	* Calculate the HMAC-MD5, of a key and some data (raw strings)
	*//*
	function rstrHMACMD5 (key, data) {
		var i
		var bkey = rstr2binl(key)
		var ipad = []
		var opad = []
		var hash
		ipad[15] = opad[15] = undefined
		if (bkey.length > 16) {
			bkey = binlMD5(bkey, key.length * 8)
		}
		for (i = 0; i < 16; i += 1) {
			ipad[i] = bkey[i] ^ 0x36363636
			opad[i] = bkey[i] ^ 0x5C5C5C5C
		}
		hash = binlMD5(ipad.concat(rstr2binl(data)), 512 + data.length * 8)
		return binl2rstr(binlMD5(opad.concat(hash), 512 + 128))
	}*/

	/*
	* Convert a raw string to a hex string
	*/
	function rstr2hex (input) {
		var hexTab = '0123456789abcdef'
		var output = ''
		var x
		var i
		for (i = 0; i < input.length; i += 1) {
			x = input.charCodeAt(i)
			output += hexTab.charAt((x >>> 4) & 0x0F) +
			hexTab.charAt(x & 0x0F)
		}
		return output
	}

	/*
	* Encode a string as utf-8
	*/
	function str2rstrUTF8 (input) {
		return unescape(encodeURIComponent(input))
	}

	/*
	* Take string arguments and return either raw or hex encoded strings
	*/
	function rawMD5 (s) {
		return rstrMD5(str2rstrUTF8(s))
	}
	function hexMD5 (s) {
		return rstr2hex(rawMD5(s))
	}/*
	function rawHMACMD5 (k, d) {
		return rstrHMACMD5(str2rstrUTF8(k), str2rstrUTF8(d))
	}
	function hexHMACMD5 (k, d) {
		return rstr2hex(rawHMACMD5(k, d))
	}*/


	// Public
	return function(string, raw) {
		if (!raw)
			return hexMD5(string);
		return rawMD5(string);
	}

});

/*! Mersenne Twister | (c) 2002 Makoto Matsumoto and Takuji Nishimura | https://github.com/boo1ean/mersenne-twister */
/*
  https://github.com/banksean wrapped Makoto Matsumoto and Takuji Nishimura's code in a namespace
  so it's better encapsulated. Now you can have multiple random number generators
  and they won't stomp all over eachother's state.

  If you want to use this as a substitute for Math.random(), use the random()
  method like so:

  var m = new MersenneTwister();
  var randomNumber = m.random();

  You can also call the other genrand_{foo}() methods on the instance.

  If you want to use a specific seed in order to get a repeatable random
  sequence, pass an integer into the constructor:

  var m = new MersenneTwister(123);

  and that will always produce the same random sequence.

  Sean McCullough (banksean@gmail.com)
*/

/*
   A C-program for MT19937, with initialization improved 2002/1/26.
   Coded by Takuji Nishimura and Makoto Matsumoto.

   Before using, initialize the state by using init_seed(seed)
   or init_by_array(init_key, key_length).

   Copyright (C) 1997 - 2002, Makoto Matsumoto and Takuji Nishimura,
   All rights reserved.

   Redistribution and use in source and binary forms, with or without
   modification, are permitted provided that the following conditions
   are met:

     1. Redistributions of source code must retain the above copyright
        notice, this list of conditions and the following disclaimer.

     2. Redistributions in binary form must reproduce the above copyright
        notice, this list of conditions and the following disclaimer in the
        documentation and/or other materials provided with the distribution.

     3. The names of its contributors may not be used to endorse or promote
        products derived from this software without specific prior written
        permission.

   THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
   "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT
   LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR
   A PARTICULAR PURPOSE ARE DISCLAIMED.  IN NO EVENT SHALL THE COPYRIGHT OWNER OR
   CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL,
   EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO,
   PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR
   PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
   LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
   NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
   SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.


   Any feedback is very welcome.
   http://www.math.sci.hiroshima-u.ac.jp/~m-mat/MT/emt.html
   email: m-mat @ math.sci.hiroshima-u.ac.jp (remove space)
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
		root.MersenneTwister = factory();
	}
})(this, function() {

	'use strict';

	// Private
	var
		N = 624, M = 397,        // Period parameters
		MATRIX_A   = 0x9908b0df, // constant vector a
		UPPER_MASK = 0x80000000, // most significant w-r bits
		LOWER_MASK = 0x7fffffff, // least significant r bits
	 
		mt = new Array(N), // the array for the state vector
		mti= N+1; // mti==N+1 means mt[N] is not initialized

	/*
	 * Initializes mt[N] with a seed
	 */
	function init(s) {
		mt[0] = s >>> 0;
		for (mti=1; mti<N; mti++) {
			s = mt[mti-1] ^ (mt[mti-1] >>> 30);
			mt[mti] = (((((s & 0xffff0000) >>> 16) * 1812433253) << 16) + (s & 0x0000ffff) * 1812433253) + mti;
			/* See Knuth TAOCP Vol2. 3rd Ed. P.106 for multiplier. */
			/* In the previous versions, MSBs of the seed affect   */
			/* only MSBs of the array mt[].                        */
			/* 2002/01/09 modified by Makoto Matsumoto             */
			mt[mti] >>>= 0;
		}
	}
 
	/* Initialize by an array with array-length
	 * init_key is the array for initializing keys
	 * key_length is its length
	 * slight change for C++, 2004/2/26 *//*
	function initByArray(init_key, key_length) {
		var i, j, k;
		init(19650218);
		i=1; j=0;
		k = (N>key_length ? N : key_length);
		for (; k; k--) {
			var s = mt[i-1] ^ (mt[i-1] >>> 30)
			mt[i] = (mt[i] ^ (((((s & 0xffff0000) >>> 16) * 1664525) << 16) + ((s & 0x0000ffff) * 1664525))) + init_key[j] + j; // non linear
			mt[i] >>>= 0; // for WORDSIZE > 32 machines
			i++; j++;
			if (i>=N) { mt[0] = mt[N-1]; i=1; }
			if (j>=key_length) j=0;
		}
		for (k=N-1; k; k--) {
			var s = mt[i-1] ^ (mt[i-1] >>> 30);
			mt[i] = (mt[i] ^ (((((s & 0xffff0000) >>> 16) * 1566083941) << 16) + (s & 0x0000ffff) * 1566083941)) - i; // non linear
			mt[i] >>>= 0; // for WORDSIZE > 32 machines
			i++;
			if (i>=N) { mt[0] = mt[N-1]; i=1; }
		}

		mt[0] = 0x80000000; // MSB is 1; assuring non-zero initial array
	}*/
 
	/*
	 * Generates a random number on [0,0xffffffff]-interval
	 */
	function randInt32() {
		var y, mag01 = new Array(0x0, MATRIX_A);
		/* mag01[x] = x * MATRIX_A  for x=0,1 */

		if (mti >= N) { // generate N words at one time
			var kk;

			//if (mti == N+1) // if init() has not been called,
				//init(5489); // a default initial seed is used

			for (kk=0;kk<N-M;kk++) {
				y = (mt[kk]&UPPER_MASK)|(mt[kk+1]&LOWER_MASK);
				mt[kk] = mt[kk+M] ^ (y >>> 1) ^ mag01[y & 0x1];
			}
			for (;kk<N-1;kk++) {
				y = (mt[kk]&UPPER_MASK)|(mt[kk+1]&LOWER_MASK);
				mt[kk] = mt[kk+(M-N)] ^ (y >>> 1) ^ mag01[y & 0x1];
			}
			y = (mt[N-1]&UPPER_MASK)|(mt[0]&LOWER_MASK);
			mt[N-1] = mt[M-1] ^ (y >>> 1) ^ mag01[y & 0x1];

			mti = 0;
		}

		y = mt[mti++];

		// Tempering
		y ^= (y >>> 11);
		y ^= (y << 7) & 0x9d2c5680;
		y ^= (y << 15) & 0xefc60000;
		y ^= (y >>> 18);

		return y >>> 0;
	}
 
	/* These real versions are due to Isaku Wada, 2002/01/09 added */
	/*
	 * Generates a random number on [0,0x7fffffff]-interval
	 *//*
	function randInt31() {
		return (randInt32()>>>1);
	}*/
	 
	/*
	 * Generates a random number on [0,1]-real-interval
	 *//*
	function randReal1() {
		return randInt32()*(1.0/4294967295.0); // divided by 2^32-1
	}*/

	/*
	 * Generates a random number on [0,1)-real-interval
	 *//*
	function random() {
		return randInt32()*(1.0/4294967296.0); // divided by 2^32
	}*/
	 
	/*
	 * Generates a random number on (0,1)-real-interval
	 *//*
	function randReal3() {
		return (randInt32() + 0.5)*(1.0/4294967296.0); // divided by 2^32
	}*/
	 
	/*
	 * Generates a random number on [0,1) with 53-bit resolution
	 *//*
	function randRes53() { 
		var a=randInt32()>>>5, b=randInt32()>>>6; 
		return(a*67108864.0+b)*(1.0/9007199254740992.0); 
	}*/

	/*
	 * Generates a random number on given interval
	 */
	function randInRange(l, u) {
		return l + Math.round((u-l)*(randInt32()/0xFFFFFFFF));
	}

	// Init
	init(seed || 5489);

	// Public
	return {
		seed: init,
		rand: function(arg1, arg2) {
			if (!arg2) {
				if (!arg1)
					return randInt32();
				return randInRange(0, arg1);
			}
			return randInRange(arg1, arg2);
		}
	}

});
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
