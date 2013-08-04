// test factorial
var assert = require('assert');
var math = require('../../../dist/math.js');

assert.equal(math.factorial(0), 1);
assert.equal(math.factorial(1), 1);
assert.equal(math.factorial(2), 2);
assert.equal(math.factorial(3), 6);
assert.equal(math.factorial(4), 24);
assert.equal(math.factorial(5), 120);
assert.deepEqual(math.factorial(math.range(0,5)), [1,1,2,6,24,120]);
assert.throws(function() { math.factorial(-1); });
assert.throws(function() { math.factorial(1.5); });
assert.throws(function() { math.factorial(); });
assert.throws(function() { math.factorial(1,3); });
