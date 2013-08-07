// test re
var assert = require('assert');
var math = require('../../../src/index.js');

assert.equal(math.re(math.complex(2,3)), 2);
assert.equal(math.re(math.complex(-2,-3)), -2);
assert.equal(math.re(math.i), 0);
assert.equal(math.re(2), 2);
assert.equal(math.re('string'), 'string');
assert.equal(math.re(true), true);
assert.deepEqual(math.re([2, math.complex('3-6i')]), [2, 3]);
assert.deepEqual(math.re(math.matrix([2, math.complex('3-6i')])).valueOf(), [2, 3]);
