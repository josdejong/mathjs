// test atan2
var assert = require('assert'),
    math = require('../../../index.js'),
    approx = require('../../../tools/approx.js'),
    pi = math.pi,
    acos = math.acos,
    atan = math.atan,
    asin = math.asin,
    complex = math.complex,
    matrix = math.matrix,
    unit = math.unit,
    divide = math.divide,
    round = math.round,
    sec = math.sec,
    csc = math.csc,
    cot = math.cot,
    sin = math.sin,
    cos = math.cos,
    tan = math.tan,
    atan2 = math.atan2;

var re, im;

// number
approx.equal(atan2(0, 0) / pi, 0);
approx.equal(atan2(0, 1) / pi, 0);
approx.equal(atan2(1, 1) / pi, 0.25);
approx.equal(atan2(1, 0) / pi, 0.5);
approx.equal(atan2(1, -1) / pi, 0.75);
approx.equal(atan2(0, -1) / pi, 1);
approx.equal(atan2(-1, -1) / pi, -0.75);
approx.equal(atan2(-1, 0) / pi, -0.5);
approx.equal(atan2(-1, 1) / pi, -0.25);

// complex
assert.throws(function () {atan2(complex('2+3i'), complex('1-2i')); });

// string
assert.throws(function () {atan2('string', 1)});

// unit
assert.throws(function () {atan2(unit('5cm'), 1)});

// array, matrix, range
approx.deepEqual(divide(atan2([1,0,-1], [1,0,-1]), pi), [0.25, 0, -0.75]);
approx.deepEqual(divide(atan2(
    matrix([1,0,-1]),
    matrix([1,0,-1])), pi),
    matrix([0.25, 0, -0.75]));
approx.equal(atan2(0, 2) / pi, 0);
approx.equal(atan2(0, -2) / pi, 1);
