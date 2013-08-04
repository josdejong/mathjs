// test emultiply (element-wise multiply)
var assert = require('assert'),
    math = require('../../../dist/math.js'),
    approx = require('../../../tools/approx.js'),
    emultiply = math.emultiply,
    divide = math.divide,
    matrix = math.matrix,
    complex = math.complex,
    range = math.range,
    i = math.i,
    unit = math.unit;

// parser
/* TODO: emultiply for parser
 approx.equal(math.eval('4 .* 2'), 8);
 approx.equal(math.eval('8 .* 2 .* 2'), 32);
 */
approx.equal(math.eval('emultiply(4, 2)'), 8);

// number
approx.equal(emultiply(2, 3), 6);
approx.equal(emultiply(-2, 3), -6);
approx.equal(emultiply(-2, -3), 6);
approx.equal(emultiply(5, 0), 0);
approx.equal(emultiply(0, 5), 0);

// complex
approx.deepEqual(emultiply(complex(2, 3), 2), complex(4, 6));
approx.deepEqual(emultiply(complex(2, -3), 2), complex(4, -6));
approx.deepEqual(emultiply(complex(0, 1), complex(2, 3)), complex(-3, 2));
approx.deepEqual(emultiply(complex(2, 3), complex(2, 3)), complex(-5, 12));
approx.deepEqual(emultiply(2, complex(2, 3)), complex(4, 6));
approx.deepEqual(divide(complex(-5, 12), complex(2, 3)), complex(2, 3));

// unit
assert.equal(emultiply(2, unit('5 mm')).toString(), '10 mm');
assert.equal(emultiply(2, unit('5 mm')).toString(), '10 mm');
assert.equal(emultiply(unit('5 mm'), 2).toString(), '10 mm');
assert.equal(emultiply(unit('5 mm'), 0).toString(), '0 m');

// string
assert.throws(function () {emultiply("hello", "world")});
assert.throws(function () {emultiply("hello", 2)});

// matrix, array, range
var a = matrix([[1,2],[3,4]]);
var b = matrix([[5,6],[7,8]]);
var c = matrix([[5],[6]]);
var d = matrix([[5,6]]);
approx.deepEqual(emultiply(a, 3), matrix([[3,6],[9,12]]));
approx.deepEqual(emultiply(3, a), matrix([[3,6],[9,12]]));
approx.deepEqual(emultiply(a, b), matrix([[5,12],[21,32]]));

approx.deepEqual(emultiply([[1,2],[3,4]], [[5,6],[7,8]]), [[5,12],[21,32]]);
approx.deepEqual(emultiply(range(1, 4), 2), [2, 4, 6, 8]);

assert.throws(function () {emultiply(a, c)});
assert.throws(function () {emultiply(d, a)});
assert.throws(function () {emultiply(d, b)});
assert.throws(function () {emultiply(d, c)});
assert.throws(function () {emultiply(c, b)});
