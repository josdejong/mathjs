// test gcd
var assert = require('assert');
var math = require('../../../src/index.js');

// parser
assert.equal(math.eval('gcd(12, 8)'), 4);

// number
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
assert.throws(function () {math.gcd(1); }, SyntaxError, 'Wrong number of arguments in function gcd (3 provided, 1-2 expected)');

// complex
assert.throws(function () {math.gcd(math.complex(1,3),2); }, TypeError, 'Function gcd(complex, number) not supported');

// string
assert.throws(function () {math.gcd('a', 2); }, TypeError, 'Function gcd(string, number) not supported');
assert.throws(function () {math.gcd(2, 'a'); }, TypeError, 'Function gcd(number, string) not supported');

// unit
assert.throws(function () { math.gcd(math.unit('5cm'), 2); }, TypeError, 'Function gcd(unit, number) not supported');

// array, matrix, range
assert.deepEqual(math.gcd([5,2,3], [25,3,6]), [5, 1, 3]);
