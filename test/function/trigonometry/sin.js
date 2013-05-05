// test sin
var assert = require('assert'),
    math = require('../../../math.js'),
    approx = require('../../../tools/approx.js'),
    pi = math.pi,
    complex = math.complex,
    matrix = math.matrix,
    unit = math.unit,
    sin = math.sin;

// TODO: replace all string comparisons with approx.equal comparisons with numbers

// number
approx.equal(sin(0), 0);
approx.equal(sin(pi*1/4), 0.707106781186548);
approx.equal(sin(pi*1/8), 0.382683432365090);
approx.equal(sin(pi*2/4), 1);
approx.equal(sin(pi*3/4), 0.707106781186548);
approx.equal(sin(pi*4/4), 0);
approx.equal(sin(pi*5/4), -0.707106781186548);
approx.equal(sin(pi*6/4), -1);
approx.equal(sin(pi*7/4), -0.707106781186548);
approx.equal(sin(pi*8/4), 0);
approx.equal(sin(pi/4), math.sqrt(2)/2);

// complex
assert.deepEqual(sin(complex('2+3i')).toString(), '9.1545 - 4.1689i');
assert.deepEqual(sin(complex('2-3i')).toString(), '9.1545 + 4.1689i');
assert.deepEqual(sin(complex('-2+3i')).toString(), '-9.1545 - 4.1689i');
assert.deepEqual(sin(complex('-2-3i')).toString(), '-9.1545 + 4.1689i');
assert.deepEqual(sin(complex('i')).toString(), '1.1752i');
assert.deepEqual(sin(complex('1')).toString(), '0.84147');
assert.deepEqual(sin(complex('1+i')).toString(), '1.2985 + 0.63496i');

// unit
approx.equal(sin(unit('45deg')), 0.707106781186548);
approx.equal(sin(unit('-45deg')), -0.707106781186548);
assert.throws(function () {sin(unit('5 celsius'))});

// string
assert.throws(function () {sin('string')});

// array, matrix, range
var sin123 = [0.84147098480789, 0.909297426825682, 0.141120008059867];
approx.deepEqual(sin([1,2,3]), sin123);
approx.deepEqual(sin(math.range('1:3')), sin123);
approx.deepEqual(sin(matrix([1,2,3])), matrix(sin123));
