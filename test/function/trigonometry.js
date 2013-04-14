// test trigonometric functions

var assert = require('assert');
    math = require('../../math.js'),
    pi = math.pi,
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
 * Round a number to 5 decimals
 * @param {Number} value
 * @returns {Number} roundedValue
 */
function round5 (value) {
    return round(value, 5);
}

// TODO: test acos
// TODO: test asin
// TODO: test atan

// test atan2
assert.equal(atan2(0, 0) / pi, 0);
assert.equal(atan2(0, 1) / pi, 0);
assert.equal(atan2(1, 1) / pi, 0.25);
assert.equal(atan2(1, 0) / pi, 0.5);
assert.equal(atan2(1, -1) / pi, 0.75);
assert.equal(atan2(0, -1) / pi, 1);
assert.equal(atan2(-1, -1) / pi, -0.75);
assert.equal(atan2(-1, 0) / pi, -0.5);
assert.equal(atan2(-1, 1) / pi, -0.25);
assert.deepEqual(divide(atan2([1,0,-1], [1,0,-1]), pi), [0.25, 0, -0.75]);
assert.deepEqual(divide(atan2(
    matrix([1,0,-1]),
    matrix([1,0,-1])), pi),
    matrix([0.25, 0, -0.75]));
assert.equal(atan2(0, 2) / pi, 0);
assert.equal(atan2(0, -2) / pi, 1);
assert.throws(function () {atan2(complex('2+3i'), complex('1-2i')); });
assert.throws(function () {atan2('string', 1)});
assert.throws(function () {atan2(unit('5cm'), 1)});

// test cos
assert.equal(round5(cos(0)), 1);
assert.equal(round5(cos(pi*1/4)), 0.70711);
assert.equal(round5(cos(pi*1/8)), 0.92388);
assert.equal(round5(cos(pi*2/4)), 0);
assert.equal(round5(cos(pi*3/4)), -0.70711);
assert.equal(round5(cos(pi*4/4)), -1);
assert.equal(round5(cos(pi*5/4)), -0.70711);
assert.equal(round5(cos(pi*6/4)), 0);
assert.equal(round5(cos(pi*7/4)), 0.70711);
assert.equal(round5(cos(pi*8/4)), 1);
assert.equal(round5(cos(pi/4)), round5(math.sqrt(2)/2));

assert.deepEqual(cos(complex('2+3i')).toString(), '-4.1896 - 9.1092i');
assert.deepEqual(cos(complex('2-3i')).toString(), '-4.1896 + 9.1092i');
assert.deepEqual(cos(complex('-2+3i')).toString(), '-4.1896 + 9.1092i');
assert.deepEqual(cos(complex('-2-3i')).toString(), '-4.1896 - 9.1092i');
assert.deepEqual(cos(complex('i')).toString(), '1.5431');
assert.deepEqual(cos(complex('1')).toString(), '0.5403');
assert.deepEqual(cos(complex('1+i')).toString(), '0.83373 - 0.9889i');

assert.deepEqual(round5(cos([1,2,3])),
    [0.54030, -0.41615, -0.98999]);
assert.deepEqual(round5(cos(math.range('1:3'))),
    [0.54030, -0.41615, -0.98999]);
assert.deepEqual(round5(cos(matrix([1,2,3]))),
    matrix([0.54030, -0.41615, -0.98999]));

assert.equal(round5(cos(unit('45deg'))), 0.70711);
assert.equal(round5(cos(unit('-135deg'))), -0.70711);
assert.throws(function () {cos('string')});
assert.throws(function () {cos(unit('5 celsius'))});

// TODO: test cot
// TODO: test csc
// TODO: test sec

// test sin
assert.equal(round5(sin(0)), 0);
assert.equal(round5(sin(pi*1/4)), 0.70711);
assert.equal(round5(sin(pi*1/8)), 0.38268);
assert.equal(round5(sin(pi*2/4)), 1);
assert.equal(round5(sin(pi*3/4)), 0.70711);
assert.equal(round5(sin(pi*4/4)), 0);
assert.equal(round5(sin(pi*5/4)), -0.70711);
assert.equal(round5(sin(pi*6/4)), -1);
assert.equal(round5(sin(pi*7/4)), -0.70711);
assert.equal(round5(sin(pi*8/4)), 0);
assert.equal(round5(sin(pi/4)), round5(math.sqrt(2)/2));

assert.deepEqual(sin(complex('2+3i')).toString(), '9.1545 - 4.1689i');
assert.deepEqual(sin(complex('2-3i')).toString(), '9.1545 + 4.1689i');
assert.deepEqual(sin(complex('-2+3i')).toString(), '-9.1545 - 4.1689i');
assert.deepEqual(sin(complex('-2-3i')).toString(), '-9.1545 + 4.1689i');
assert.deepEqual(sin(complex('i')).toString(), '1.1752i');
assert.deepEqual(sin(complex('1')).toString(), '0.84147');
assert.deepEqual(sin(complex('1+i')).toString(), '1.2985 + 0.63496i');

assert.deepEqual(round5(sin([1,2,3])),
    [0.84147, 0.90930, 0.14112]);
assert.deepEqual(round5(sin(math.range('1:3'))),
    [0.84147, 0.90930, 0.14112]);
assert.deepEqual(round5(sin(matrix([1,2,3]))),
    matrix([0.84147, 0.90930, 0.14112]));

assert.equal(round5(sin(unit('45deg'))), 0.70711);
assert.equal(round5(sin(unit('-45deg'))), -0.70711);
assert.throws(function () {sin('string')});
assert.throws(function () {sin(unit('5 celsius'))});


// test tan
var tan = tan;
assert.equal(round5(tan(0)), 0);
assert.equal(round5(tan(pi*1/4)), 1);
assert.equal(round5(tan(pi*1/8)), 0.41421);
assert.ok(tan(pi*2/4) > 1e15);
assert.equal(round5(tan(pi*3/4)), -1);
assert.equal(round5(tan(pi*4/4)), 0);
assert.equal(round5(tan(pi*5/4)), 1);
assert.ok(tan(pi*6/4) > 1e15);
assert.equal(round5(tan(pi*7/4)), -1);
assert.equal(round5(tan(pi*8/4)), 0);

assert.deepEqual(round5(tan([1,2,3])),
    [1.55741, -2.18504, -0.14255]);
assert.deepEqual(round5(tan(math.range('1:3'))),
    [1.55741, -2.18504, -0.14255]);
assert.deepEqual(round5(tan(matrix([1,2,3]))),
    matrix([1.55741, -2.18504, -0.14255]));

assert.deepEqual(tan(complex('2+3i')).toString(), '-0.003764 + 1.0032i');
assert.deepEqual(tan(complex('2-3i')).toString(), '-0.003764 - 1.0032i');
assert.deepEqual(tan(complex('-2+3i')).toString(), '0.003764 + 1.0032i');
assert.deepEqual(tan(complex('-2-3i')).toString(), '0.003764 - 1.0032i');
assert.deepEqual(tan(complex('i')).toString(), '0.76159i');
assert.deepEqual(tan(complex('1')).toString(), '1.5574');
assert.deepEqual(tan(complex('1+i')).toString(), '0.27175 + 1.0839i');

assert.equal(round5(tan(unit(' 60deg'))), round5(math.sqrt(3)));
assert.equal(round5(tan(unit('-135deg'))), 1);
assert.throws(function () {tan('string')});
assert.throws(function () {tan(unit('5 celsius'))});
