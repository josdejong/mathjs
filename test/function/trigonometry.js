// test trigonometric functions

var assert = require('assert');
    math = require('../../math.js'),
    pi = math.pi,
    acos = math.acos,
    atan = math.atan,
    asin = math.asin,
    complex = math.complex,
    matrix = math.matrix,
    unit = math.unit,
    divide = math.divide;
    round = math.round,
    sin = math.sin,
    cos = math.cos,
    tan = math.tan,
    atan2 = math.atan2;

/**
 * Test whether two numbers are equal when rounded to 5 decimals
 * @param {Number} a
 * @param {Number} b
 */
function approxEqual(a, b) {
    assert.equal(round(a, 5), round(b, 5));
}

/**
 * Test whether all numbers in two objects objects are equal when rounded
 * to 5 decimals
 * @param {Object} a
 * @param {Object} b
 */
function approxDeepEqual(a, b) {
    assert.deepEqual(round(a, 5), round(b, 5));
}


// test acos
approxEqual(acos(-1) / pi, 1);
approxEqual(acos(-0.5) / pi, 2 / 3);
approxEqual(acos(0) / pi, 0.5);
approxEqual(acos(0.5) / pi, 1 / 3);
approxEqual(acos(1) / pi, 0);

assert.deepEqual(acos(complex('2+3i')).toString(), '1.0001 - 1.9834i');
assert.deepEqual(acos(complex('2-3i')).toString(), '1.0001 + 1.9834i');
assert.deepEqual(acos(complex('-2+3i')).toString(), '2.1414 - 1.9834i');
assert.deepEqual(acos(complex('-2-3i')).toString(), '2.1414 + 1.9834i');
assert.deepEqual(acos(complex('i')).toString(), '1.5708 - 0.88137i');
assert.deepEqual(acos(complex('1')).toString(), '0');
assert.deepEqual(acos(complex('1+i')).toString(), '0.90456 - 1.0613i');

approxEqual(acos(cos(-1)), 1);
approxEqual(acos(cos(0)), 0);
approxEqual(acos(cos(0.1)), 0.1);
approxEqual(acos(cos(0.5)), 0.5);
approxEqual(acos(cos(2)), 2);

// note: the results of acos(2) and acos(3) differs in octave
// the next tests are verified with mathematica
var acos123 = [0, complex(0, 1.31696), complex(0, 1.76275)];
approxDeepEqual(acos([1,2,3]), acos123);
approxDeepEqual(acos(math.range('1:3')), acos123);
approxDeepEqual(acos(matrix([1,2,3])), matrix(acos123));

assert.throws(function () {acos(unit('45deg'))});
assert.throws(function () {acos('string')});
assert.throws(function () {acos(unit('5 celsius'))});


// test asin
approxEqual(asin(-1) / pi, -0.5);
approxEqual(asin(-0.5) / pi, -1/6);
approxEqual(asin(0) / pi, 0);
approxEqual(asin(0.5) / pi, 1/6);
approxEqual(asin(1) / pi, 0.5);

assert.deepEqual(asin(complex('2+3i')).toString(), '0.57065 + 1.9834i');
assert.deepEqual(asin(complex('2-3i')).toString(), '0.57065 - 1.9834i');
assert.deepEqual(asin(complex('-2+3i')).toString(), '-0.57065 + 1.9834i');
assert.deepEqual(asin(complex('-2-3i')).toString(), '-0.57065 - 1.9834i');
assert.deepEqual(asin(complex('i')).toString(), '0.88137i');
assert.deepEqual(asin(complex('1')).toString(), '1.5708');
assert.deepEqual(asin(complex('1+i')).toString(), '0.66624 + 1.0613i');

approxEqual(asin(sin(-1)), -1);
approxEqual(asin(sin(0)), 0);
approxEqual(asin(sin(0.1)), 0.1);
approxEqual(asin(sin(0.5)), 0.5);
approxEqual(asin(sin(2)), 1.14159);

// note: the results of asin(2) and asin(3) differs in octave
// the next tests are verified with mathematica
var asin123 = [1.5708, complex(1.5708, -1.31696), complex(1.5708, -1.76275)];
approxDeepEqual(asin([1,2,3]), asin123);
approxDeepEqual(asin(math.range('1:3')), asin123);
approxDeepEqual(asin(matrix([1,2,3])), matrix(asin123));

assert.throws(function () {asin(unit('45deg'))});
assert.throws(function () {asin('string')});
assert.throws(function () {asin(unit('5 celsius'))});

// test atan
approxEqual(atan(-1) / pi, -0.25);
approxEqual(atan(-0.5) / pi, -0.14758);
approxEqual(atan(0) / pi, 0);
approxEqual(atan(0.5) / pi, 0.14758);
approxEqual(atan(1) / pi, 0.25);

assert.deepEqual(atan(complex('2+3i')).toString(), '1.4099 + 0.22907i');
assert.deepEqual(atan(complex('2-3i')).toString(), '1.4099 - 0.22907i');
assert.deepEqual(atan(complex('-2+3i')).toString(), '-1.4099 + 0.22907i');
assert.deepEqual(atan(complex('-2-3i')).toString(), '-1.4099 - 0.22907i');
assert.deepEqual(atan(complex('i')).toString(), '-Infinityi');
assert.deepEqual(atan(complex('1')).toString(), '0.7854');
assert.deepEqual(atan(complex('1+i')).toString(), '1.0172 + 0.40236i');

approxEqual(atan(tan(-1)), -1);
approxEqual(atan(tan(0)), 0);
approxEqual(atan(tan(0.1)), 0.1);
approxEqual(atan(tan(0.5)), 0.5);
approxEqual(atan(tan(2)), -1.14159);

var atan123 = [0.7854, 1.10715, 1.24905];
approxDeepEqual(atan([1,2,3]), atan123);
approxDeepEqual(atan(math.range('1:3')), atan123);
approxDeepEqual(atan(matrix([1,2,3])), matrix(atan123));

assert.throws(function () {atan(unit('45deg'))});
assert.throws(function () {atan('string')});
assert.throws(function () {atan(unit('5 celsius'))});


// test atan2
approxEqual(atan2(0, 0) / pi, 0);
approxEqual(atan2(0, 1) / pi, 0);
approxEqual(atan2(1, 1) / pi, 0.25);
approxEqual(atan2(1, 0) / pi, 0.5);
approxEqual(atan2(1, -1) / pi, 0.75);
approxEqual(atan2(0, -1) / pi, 1);
approxEqual(atan2(-1, -1) / pi, -0.75);
approxEqual(atan2(-1, 0) / pi, -0.5);
approxEqual(atan2(-1, 1) / pi, -0.25);
approxDeepEqual(divide(atan2([1,0,-1], [1,0,-1]), pi), [0.25, 0, -0.75]);
approxDeepEqual(divide(atan2(
    matrix([1,0,-1]),
    matrix([1,0,-1])), pi),
    matrix([0.25, 0, -0.75]));
approxEqual(atan2(0, 2) / pi, 0);
approxEqual(atan2(0, -2) / pi, 1);
assert.throws(function () {atan2(complex('2+3i'), complex('1-2i')); });
assert.throws(function () {atan2('string', 1)});
assert.throws(function () {atan2(unit('5cm'), 1)});

// test cos
approxEqual(cos(0), 1);
approxEqual(cos(pi*1/4), 0.70711);
approxEqual(cos(pi*1/8), 0.92388);
approxEqual(cos(pi*2/4), 0);
approxEqual(cos(pi*3/4), -0.70711);
approxEqual(cos(pi*4/4), -1);
approxEqual(cos(pi*5/4), -0.70711);
approxEqual(cos(pi*6/4), 0);
approxEqual(cos(pi*7/4), 0.70711);
approxEqual(cos(pi*8/4), 1);
approxEqual(cos(pi/4), math.sqrt(2)/2);

assert.deepEqual(cos(complex('2+3i')).toString(), '-4.1896 - 9.1092i');
assert.deepEqual(cos(complex('2-3i')).toString(), '-4.1896 + 9.1092i');
assert.deepEqual(cos(complex('-2+3i')).toString(), '-4.1896 + 9.1092i');
assert.deepEqual(cos(complex('-2-3i')).toString(), '-4.1896 - 9.1092i');
assert.deepEqual(cos(complex('i')).toString(), '1.5431');
assert.deepEqual(cos(complex('1')).toString(), '0.5403');
assert.deepEqual(cos(complex('1+i')).toString(), '0.83373 - 0.9889i');

approxDeepEqual(cos([1,2,3]), [0.54030, -0.41615, -0.98999]);
approxDeepEqual(cos(math.range('1:3')), [0.54030, -0.41615, -0.98999]);
approxDeepEqual(cos(matrix([1,2,3])), matrix([0.54030, -0.41615, -0.98999]));

approxEqual(cos(unit('45deg')), 0.70711);
approxEqual(cos(unit('-135deg')), -0.70711);
assert.throws(function () {cos('string')});
assert.throws(function () {cos(unit('5 celsius'))});

// TODO: test cot
// TODO: test csc
// TODO: test sec

// test sin
approxEqual(sin(0), 0);
approxEqual(sin(pi*1/4), 0.70711);
approxEqual(sin(pi*1/8), 0.38268);
approxEqual(sin(pi*2/4), 1);
approxEqual(sin(pi*3/4), 0.70711);
approxEqual(sin(pi*4/4), 0);
approxEqual(sin(pi*5/4), -0.70711);
approxEqual(sin(pi*6/4), -1);
approxEqual(sin(pi*7/4), -0.70711);
approxEqual(sin(pi*8/4), 0);
approxEqual(sin(pi/4), math.sqrt(2)/2);

assert.deepEqual(sin(complex('2+3i')).toString(), '9.1545 - 4.1689i');
assert.deepEqual(sin(complex('2-3i')).toString(), '9.1545 + 4.1689i');
assert.deepEqual(sin(complex('-2+3i')).toString(), '-9.1545 - 4.1689i');
assert.deepEqual(sin(complex('-2-3i')).toString(), '-9.1545 + 4.1689i');
assert.deepEqual(sin(complex('i')).toString(), '1.1752i');
assert.deepEqual(sin(complex('1')).toString(), '0.84147');
assert.deepEqual(sin(complex('1+i')).toString(), '1.2985 + 0.63496i');

approxDeepEqual(sin([1,2,3]), [0.84147, 0.90930, 0.14112]);
approxDeepEqual(sin(math.range('1:3')), [0.84147, 0.90930, 0.14112]);
approxDeepEqual(sin(matrix([1,2,3])), matrix([0.84147, 0.90930, 0.14112]));

approxEqual(sin(unit('45deg')), 0.70711);
approxEqual(sin(unit('-45deg')), -0.70711);
assert.throws(function () {sin('string')});
assert.throws(function () {sin(unit('5 celsius'))});


// test tan
var tan = tan;
approxEqual(tan(0), 0);
approxEqual(tan(pi*1/4), 1);
approxEqual(tan(pi*1/8), 0.41421);
assert.ok(tan(pi*2/4) > 1e15);
approxEqual(tan(pi*3/4), -1);
approxEqual(tan(pi*4/4), 0);
approxEqual(tan(pi*5/4), 1);
assert.ok(tan(pi*6/4) > 1e15);
approxEqual(tan(pi*7/4), -1);
approxEqual(tan(pi*8/4), 0);

approxDeepEqual(tan([1,2,3]), [1.55741, -2.18504, -0.14255]);
(tan(math.range('1:3')), [1.55741, -2.18504, -0.14255]);
approxDeepEqual(tan(matrix([1,2,3])), matrix([1.55741, -2.18504, -0.14255]));

assert.deepEqual(tan(complex('2+3i')).toString(), '-0.003764 + 1.0032i');
assert.deepEqual(tan(complex('2-3i')).toString(), '-0.003764 - 1.0032i');
assert.deepEqual(tan(complex('-2+3i')).toString(), '0.003764 + 1.0032i');
assert.deepEqual(tan(complex('-2-3i')).toString(), '0.003764 - 1.0032i');
assert.deepEqual(tan(complex('i')).toString(), '0.76159i');
assert.deepEqual(tan(complex('1')).toString(), '1.5574');
assert.deepEqual(tan(complex('1+i')).toString(), '0.27175 + 1.0839i');

approxEqual(tan(unit(' 60deg')), math.sqrt(3));
approxEqual(tan(unit('-135deg')), 1);
assert.throws(function () {tan('string')});
assert.throws(function () {tan(unit('5 celsius'))});
math.range(0, 0.1, 1).forEach(function (value) {
    approxEqual(tan(value), sin(value) / cos(value));
});
