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