// test round
var assert = require('assert');
var math = require('../../../src/index.js');

// parser
assert.equal(math.eval('round(pi)'), 3);
assert.equal(math.eval('round(pi, 3)'), 3.142);

// number
assert.equal(math.round(math.pi), 3);
assert.equal(math.round(math.pi * 1000), 3142);
assert.equal(math.round(math.pi, 3), 3.142);
assert.equal(math.round(math.pi, 6), 3.141593);
assert.equal(math.round(1234.5678, 2), 1234.57);
assert.throws(function () {math.round();}, SyntaxError, 'Wrong number of arguments in function round (3 provided, 1-2 expected)');
assert.throws(function () {math.round(1,2,3);}, SyntaxError, 'Wrong number of arguments in function round (3 provided, 1-2 expected)');

// complex
assert.deepEqual(math.round(math.complex(2.2, math.pi)), math.complex(2,3));

// unit
assert.throws(function () { math.round(math.unit('5cm')); }, TypeError, 'Function round(unit) not supported');

// string
assert.throws(function () { math.round("hello world"); }, TypeError, 'Function round(unit) not supported');

// matrix, array, range
assert.deepEqual(math.round(math.range(0,1/3,2), 2), [0,0.33,0.67,1,1.33,1.67,2]);
assert.deepEqual(math.round(math.range(0,1/3,2)), [0,0,1,1,1,2,2]);
assert.deepEqual(math.round([1.7,2.3]), [2,2]);
assert.deepEqual(math.round(math.matrix([1.7,2.3])).valueOf(), [2, 2]);
