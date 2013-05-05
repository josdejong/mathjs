// test cos
var assert = require('assert'),
    math = require('../../../math.js'),
    approx = require('../../../tools/approx.js'),
    pi = math.pi,
    complex = math.complex,
    matrix = math.matrix,
    unit = math.unit,
    cos = math.cos;

// TODO: replace all string comparisons with approx.equal comparisons with numbers

// number
approx.equal(cos(0), 1);
approx.equal(cos(pi*1/4), 0.707106781186548);
approx.equal(cos(pi*1/8), 0.923879532511287);
approx.equal(cos(pi*2/4), 0);
approx.equal(cos(pi*3/4), -0.707106781186548);
approx.equal(cos(pi*4/4), -1);
approx.equal(cos(pi*5/4), -0.707106781186548);
approx.equal(cos(pi*6/4), 0);
approx.equal(cos(pi*7/4), 0.707106781186548);
approx.equal(cos(pi*8/4), 1);
approx.equal(cos(pi/4), math.sqrt(2)/2);

// complex
assert.deepEqual(cos(complex('2+3i')).toString(), '-4.1896 - 9.1092i');
assert.deepEqual(cos(complex('2-3i')).toString(), '-4.1896 + 9.1092i');
assert.deepEqual(cos(complex('-2+3i')).toString(), '-4.1896 + 9.1092i');
assert.deepEqual(cos(complex('-2-3i')).toString(), '-4.1896 - 9.1092i');
assert.deepEqual(cos(complex('i')).toString(), '1.5431');
assert.deepEqual(cos(complex('1')).toString(), '0.5403');
assert.deepEqual(cos(complex('1+i')).toString(), '0.83373 - 0.9889i');

// unit
approx.equal(cos(unit('45deg')), 0.707106781186548);
approx.equal(cos(unit('-135deg')), -0.707106781186548);
assert.throws(function () {cos(unit('5 celsius'))});

// string
assert.throws(function () {cos('string')});

// array, matrix, range
var cos123 = [0.540302305868140, -0.41614683654714, -0.989992496600445];
approx.deepEqual(cos([1,2,3]), cos123);
approx.deepEqual(cos(math.range('1:3')), cos123);
approx.deepEqual(cos(matrix([1,2,3])), matrix(cos123));
