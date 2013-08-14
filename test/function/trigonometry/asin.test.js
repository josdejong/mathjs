// test asin
var assert = require('assert'),
    math = require('../../../index.js'),
    approx = require('../../../tools/approx.js'),
    pi = math.pi,
    complex = math.complex,
    matrix = math.matrix,
    unit = math.unit,
    asin = math.asin,
    sin = math.sin;

// number
approx.equal(asin(-1) / pi, -0.5);
approx.equal(asin(-0.5) / pi, -1/6);
approx.equal(asin(0) / pi, 0);
approx.equal(asin(0.5) / pi, 1/6);
approx.equal(asin(1) / pi, 0.5);

// complex
var re = 0.570652784321099;
var im = 1.983387029916536;
approx.deepEqual(asin(complex('2+3i')), complex(re, im));
approx.deepEqual(asin(complex('2-3i')), complex(re, -im));
approx.deepEqual(asin(complex('-2+3i')), complex(-re, im));
approx.deepEqual(asin(complex('-2-3i')), complex(-re, -im));
approx.deepEqual(asin(complex('i')), complex(0, 0.881373587019543));
approx.deepEqual(asin(complex('1')), 1.57079632679490);
approx.deepEqual(asin(complex('1+i')), complex(0.666239432492515, 1.061275061905036));

// unit
assert.throws(function () {asin(unit('45deg'))});
assert.throws(function () {asin(unit('5 celsius'))});

// string
assert.throws(function () {asin('string')});

// inverse
approx.equal(asin(sin(-1)), -1);
approx.equal(asin(sin(0)), 0);
approx.equal(asin(sin(0.1)), 0.1);
approx.equal(asin(sin(0.5)), 0.5);
approx.equal(asin(sin(2)), 1.14159265358979);

// matrix, array, range
// note: the results of asin(2) and asin(3) differs in octave
// the next tests are verified with mathematica
var asin123 = [
  1.57079632679490,
  complex(1.57079632679490, -1.31695789692482),
  complex(1.57079632679490, -1.76274717403909)];
approx.deepEqual(asin([1,2,3]), asin123);
approx.deepEqual(asin(math.range('1:4')), asin123);
approx.deepEqual(asin(matrix([1,2,3])), matrix(asin123));
