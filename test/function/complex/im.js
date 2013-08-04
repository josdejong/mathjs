// test im
var assert = require('assert');
var math = require('../../../dist/math.js');

assert.equal(math.im(math.complex(2,3)), 3);
assert.equal(math.im(math.complex(-2,-3)), -3);
assert.equal(math.im(math.i), 1);
assert.equal(math.im(2), 0);
assert.equal(math.im('string'), 0);
assert.equal(math.im(true), 0);
assert.deepEqual(math.im([2, math.complex('3-6i')]), [0, -6]);
assert.deepEqual(math.im(math.matrix([2, math.complex('3-6i')])).valueOf(), [0, -6]);
