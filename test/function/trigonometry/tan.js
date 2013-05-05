// test tan
var assert = require('assert'),
    math = require('../../../math.js'),
    approx = require('../../../tools/approx.js'),
    pi = math.pi,
    complex = math.complex,
    matrix = math.matrix,
    unit = math.unit,
    sin = math.sin,
    cos = math.cos,
    tan = math.tan;

// TODO: replace all string comparisons with approx.equal comparisons with numbers

// number
approx.equal(tan(0), 0);
approx.equal(tan(pi*1/4), 1);
approx.equal(tan(pi*1/8), 0.414213562373095);
assert.ok(tan(pi*2/4) > 1e10);
approx.equal(tan(pi*3/4), -1);
approx.equal(tan(pi*4/4), 0);
approx.equal(tan(pi*5/4), 1);
assert.ok(tan(pi*6/4) > 1e10);
approx.equal(tan(pi*7/4), -1);
approx.equal(tan(pi*8/4), 0);

// complex
assert.deepEqual(tan(complex('2+3i')).toString(), '-0.003764 + 1.0032i');
assert.deepEqual(tan(complex('2-3i')).toString(), '-0.003764 - 1.0032i');
assert.deepEqual(tan(complex('-2+3i')).toString(), '0.003764 + 1.0032i');
assert.deepEqual(tan(complex('-2-3i')).toString(), '0.003764 - 1.0032i');
assert.deepEqual(tan(complex('i')).toString(), '0.76159i');
assert.deepEqual(tan(complex('1')).toString(), '1.5574');
assert.deepEqual(tan(complex('1+i')).toString(), '0.27175 + 1.0839i');

// unit
approx.equal(tan(unit(' 60deg')), math.sqrt(3));
approx.equal(tan(unit('-135deg')), 1);
assert.throws(function () {tan(unit('5 celsius'))});

// string
assert.throws(function () {tan('string')});

// compare
math.range(0, 0.1, 1).forEach(function (value) {
    approx.equal(tan(value), sin(value) / cos(value));
});

// array, matrix, range
var tan123 = [1.557407724654902, -2.185039863261519, -0.142546543074278];
approx.deepEqual(tan([1,2,3]), tan123);
approx.deepEqual(tan(math.range('1:3')), tan123);
approx.deepEqual(tan(matrix([1,2,3])), matrix(tan123));
