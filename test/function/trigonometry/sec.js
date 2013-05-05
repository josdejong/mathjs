// test sec
var assert = require('assert'),
    math = require('../../../math.js'),
    approx = require('../../../tools/approx.js'),
    pi = math.pi,
    complex = math.complex,
    matrix = math.matrix,
    unit = math.unit,
    sec = math.sec;

// TODO: replace all string comparisons with approx.equal comparisons with numbers

// number
approx.equal(1 / sec(0), 1);
approx.equal(1 / sec(pi*1/4), 0.707106781186548);
approx.equal(1 / sec(pi*1/8), 0.923879532511287);
approx.equal(1 / sec(pi*2/4), 0);
approx.equal(1 / sec(pi*3/4), -0.707106781186548);
approx.equal(1 / sec(pi*4/4), -1);
approx.equal(1 / sec(pi*5/4), -0.707106781186548);
approx.equal(1 / sec(pi*6/4), 0);
approx.equal(1 / sec(pi*7/4), 0.707106781186548);
approx.equal(1 / sec(pi*8/4), 1);
approx.equal(1 / sec(pi/4), math.sqrt(2)/2);

approx.equal(math.pow(sec(pi/4), 2), 2);
approx.equal(sec(0), 1);
approx.equal(sec(pi), -1);
approx.equal(sec(-pi), -1);
approx.equal(math.pow(sec(-pi/4), 2), 2);
approx.equal(sec(2*pi), 1);
approx.equal(sec(-2*pi), 1);

// complex
assert.deepEqual(sec(complex('2+3i')).toString(), '-0.041675 + 0.090611i');
assert.deepEqual(sec(complex('2-3i')).toString(), '-0.041675 - 0.090611i');
assert.deepEqual(sec(complex('-2+3i')).toString(), '-0.041675 - 0.090611i');
assert.deepEqual(sec(complex('-2-3i')).toString(), '-0.041675 + 0.090611i');
assert.deepEqual(sec(complex('i')).toString(), '0.64805');
assert.deepEqual(sec(complex('1')).toString(), '1.8508');
assert.deepEqual(sec(complex('1+i')).toString(), '0.49834 + 0.59108i');

// unit
approx.equal(sec(unit('45deg')), 1.41421356237310);
approx.equal(sec(unit('-45deg')), 1.41421356237310);
assert.throws(function () {sec(unit('5 celsius'))});

// string
assert.throws(function () {sec('string')});

// array, matrix, range
var sec123 = [1.85081571768093, -2.40299796172238, -1.01010866590799];
approx.deepEqual(sec([1,2,3]), sec123);
approx.deepEqual(sec(math.range('1:3')), sec123);
approx.deepEqual(sec(matrix([1,2,3])), matrix(sec123));
