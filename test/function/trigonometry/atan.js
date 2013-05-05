// test atan
var assert = require('assert'),
    math = require('../../../math.js'),
    approx = require('../../../tools/approx.js'),
    pi = math.pi,
    complex = math.complex,
    matrix = math.matrix,
    unit = math.unit,
    atan = math.atan,
    tan = math.tan;

// TODO: replace all string comparisons with approx.equal comparisons with numbers

// number
approx.equal(atan(-1) / pi, -0.25);
approx.equal(atan(-0.5) / pi, -0.147583617650433);
approx.equal(atan(0) / pi, 0);
approx.equal(atan(0.5) / pi, 0.147583617650433);
approx.equal(atan(1) / pi, 0.25);

// complex
assert.deepEqual(atan(complex('2+3i')).toString(), '1.4099 + 0.22907i');
assert.deepEqual(atan(complex('2-3i')).toString(), '1.4099 - 0.22907i');
assert.deepEqual(atan(complex('-2+3i')).toString(), '-1.4099 + 0.22907i');
assert.deepEqual(atan(complex('-2-3i')).toString(), '-1.4099 - 0.22907i');
assert.deepEqual(atan(complex('i')).toString(), '-Infinityi');
assert.deepEqual(atan(complex('1')).toString(), '0.7854');
assert.deepEqual(atan(complex('1+i')).toString(), '1.0172 + 0.40236i');

// unit
assert.throws(function () {atan(unit('45deg'))});
assert.throws(function () {atan(unit('5 celsius'))});

// string
assert.throws(function () {atan('string')});

// inverse
approx.equal(atan(tan(-1)), -1);
approx.equal(atan(tan(0)), 0);
approx.equal(atan(tan(0.1)), 0.1);
approx.equal(atan(tan(0.5)), 0.5);
approx.equal(atan(tan(2)), -1.14159265358979);

// matrix, array, range
var atan123 = [0.785398163397448, 1.107148717794090, 1.249045772398254];
approx.deepEqual(atan([1,2,3]), atan123);
approx.deepEqual(atan(math.range('1:3')), atan123);
approx.deepEqual(atan(matrix([1,2,3])), matrix(atan123));
