// test ceil
var assert = require('assert'),
    approx = require('../../../tools/approx.js'),
    math = require('../../../src/index.js'),
    complex = math.complex,
    matrix = math.matrix,
    unit = math.unit,
    range = math.range,
    ceil = math.ceil;

// parser
assert.equal(math.eval('ceil(1.3)'), 2);
assert.equal(math.eval('ceil(1.8)'), 2);

// number
approx.equal(ceil(0), 0);
approx.equal(ceil(1), 1);
approx.equal(ceil(1.3), 2);
approx.equal(ceil(1.8), 2);
approx.equal(ceil(2), 2);
approx.equal(ceil(-1), -1);
approx.equal(ceil(-1.3), -1);
approx.equal(ceil(-1.8), -1);
approx.equal(ceil(-2), -2);
approx.equal(ceil(-2.1), -2);
approx.deepEqual(ceil(math.pi), 4);

// complex
approx.deepEqual(ceil(complex(0, 0)), complex(0, 0));
approx.deepEqual(ceil(complex(1.3, 1.8)), complex(2, 2));
approx.deepEqual(ceil(math.i), complex(0, 1));
approx.deepEqual(ceil(complex(-1.3, -1.8)), complex(-1, -1));

// unit
assert.throws(function () {ceil(unit('5cm'))}, TypeError, 'Function ceil(unit) not supported');

// string
assert.throws(function () {ceil('hello world')}, TypeError, 'Function ceil(string) not supported');

// matrix, array, range
approx.deepEqual(ceil([1.2, 3.4, 5.6, 7.8, 10.0]), [2, 4, 6, 8, 10]);
approx.deepEqual(ceil(matrix([1.2, 3.4, 5.6, 7.8, 10.0])), matrix([2, 4, 6, 8, 10]));
approx.deepEqual(ceil(range(1.2, 2.2, 10)), [2, 4, 6, 8, 10]);
