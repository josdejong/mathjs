// test acos
var assert = require('assert'),
    math = require('../../../src/index.js'),
    approx = require('../../../tools/approx.js'),
    pi = math.pi,
    acos = math.acos,
    cos = math.cos,
    complex = math.complex,
    matrix = math.matrix,
    unit = math.unit;

// number
approx.equal(acos(-1) / pi, 1);
approx.equal(acos(-0.5) / pi, 2 / 3);
approx.equal(acos(0) / pi, 0.5);
approx.equal(acos(0.5) / pi, 1 / 3);
approx.equal(acos(1) / pi, 0);

// complex
approx.deepEqual(acos(complex('2+3i')), complex(1.00014354247380, -1.98338702991654));
approx.deepEqual(acos(complex('2-3i')), complex(1.00014354247380, 1.98338702991654));
approx.deepEqual(acos(complex('-2+3i')), complex(2.14144911111600, -1.98338702991654));
approx.deepEqual(acos(complex('-2-3i')), complex(2.14144911111600, 1.98338702991654));
approx.deepEqual(acos(complex('i')), complex(1.570796326794897, -0.881373587019543));
approx.deepEqual(acos(complex('1')), complex(0, 0));
approx.deepEqual(acos(complex('1+i')), complex(0.904556894302381, -1.061275061905036));

// unit
assert.throws(function () {acos(unit('45deg'))});
assert.throws(function () {acos(unit('5 celsius'))});

// string
assert.throws(function () {acos('string')});

// inverse
approx.equal(acos(cos(-1)), 1);
approx.equal(acos(cos(0)), 0);
approx.equal(acos(cos(0.1)), 0.1);
approx.equal(acos(cos(0.5)), 0.5);
approx.equal(acos(cos(2)), 2);

// matrix, array, range
// note: the results of acos(2) and acos(3) differs in octave
// the next tests are verified with mathematica
var acos123 = [0, complex(0, 1.316957896924817), complex(0, 1.762747174039086)];
approx.deepEqual(acos([1,2,3]), acos123);
approx.deepEqual(acos(math.range('1:4')), acos123);
approx.deepEqual(acos(matrix([1,2,3])), matrix(acos123));
