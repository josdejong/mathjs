// test square
var assert = require('assert');
var math = require('../../../math.js');

assert.equal(math.square(4), 16);
assert.equal(math.square(math.complex('2i')), -4);
assert.deepEqual(math.square([2,3,4,5]), [4,9,16,25]);
assert.deepEqual(math.square([[2,3],[4,5]]), [[4,9],[16,25]]);
// TODO: test square
