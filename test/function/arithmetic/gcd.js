var assert = require('assert');
var math = require('../../../math.js');

// test gcd
assert.equal(math.gcd(12, 8), 4);
assert.equal(math.gcd(8, 12), 4);
assert.equal(math.gcd(8, -12), 4);
assert.equal(math.gcd(-12, 8), 4);
assert.equal(math.gcd(12, -8), 4);
assert.equal(math.gcd(15, 3), 3);
assert.equal(math.gcd(3, 0), 3);
assert.equal(math.gcd(-3, 0), 3);
assert.equal(math.gcd(0, 3), 3);
assert.equal(math.gcd(0, -3), 3);
assert.equal(math.gcd(0, 0), 0);
assert.equal(math.gcd(25, 15, -10, 30), 5);
assert.throws(function () {math.gcd(1); });
assert.throws(function () {math.gcd(math.complex(1,3),2); });

// TODO: test for different data types and wrong arguments