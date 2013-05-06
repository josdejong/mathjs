// test floor
var assert = require('assert'),
    approx = require('../../../tools/approx.js'),
    math = require('../../../math.js'),
    complex = math.complex,
    matrix = math.matrix,
    unit = math.unit,
    range = math.range,
    floor = math.floor;

// parser
assert.equal(math.eval('floor(1.3)'), 1);
assert.equal(math.eval('floor(1.8)'), 1);

// number
approx.equal(floor(0), 0);
approx.equal(floor(1), 1);
approx.equal(floor(1.3), 1);
approx.equal(floor(1.8), 1);
approx.equal(floor(2), 2);
approx.equal(floor(-1), -1);
approx.equal(floor(-1.3), -2);
approx.equal(floor(-1.8), -2);
approx.equal(floor(-2), -2);
approx.equal(floor(-2.1), -3);
approx.deepEqual(floor(math.pi), 3);

// complex
approx.deepEqual(floor(complex(0, 0)), complex(0, 0));
approx.deepEqual(floor(complex(1.3, 1.8)), complex(1, 1));
approx.deepEqual(floor(math.i), complex(0, 1));
approx.deepEqual(floor(complex(-1.3, -1.8)), complex(-2, -2));

// unit
assert.throws(function () {floor(unit('5cm'))}, TypeError, 'Function floor(unit) not supported');

// string
assert.throws(function () {floor('hello world')}, TypeError, 'Function floor(string) not supported');

// matrix, array, range
approx.deepEqual(floor([1.2, 3.4, 5.6, 7.8, 10.0]), [1, 3, 5, 7, 10]);
approx.deepEqual(floor(matrix([1.2, 3.4, 5.6, 7.8, 10.0])), matrix([1, 3, 5, 7, 10]));
approx.deepEqual(floor(range(1.2, 2.2, 10)), [1, 3, 5, 7, 10]);
