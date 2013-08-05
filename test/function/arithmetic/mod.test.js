// test mod
var assert = require('assert'),
    approx = require('../../../tools/approx.js'),
    math = require('../../../src/index.js'),
    matrix = math.matrix,
    range = math.range,
    mod = math.mod;

// test parser
approx.equal(math.eval('8 % 3'), 2);
approx.equal(math.eval('mod(8, 3)'), 2);

// test number
approx.equal(mod(7, 2), 1);
approx.equal(mod(9, 3), 0);
approx.equal(mod(10, 4), 2);
assert.throws(function () {mod(10, -4)});
approx.equal(mod(-10, 4), 2);
assert.throws(function () {mod(-10, -4)});
approx.equal(mod(8.2, 3), 2.2);
approx.equal(mod(4, 1.5), 1);
approx.equal(mod(0, 3), 0);

// test wrong number of arguments
assert.throws(function () {mod(1)}, SyntaxError);
assert.throws(function () {mod(1,2,3)}, SyntaxError);

// test complex
assert.throws(function () {mod(math.complex(1,2), 3)}, TypeError);
assert.throws(function () {mod(3, math.complex(1,2))}, TypeError);

// test string
assert.throws(function () {mod('string', 3)}, TypeError);
assert.throws(function () {mod(5, 'string')}, TypeError);

// test array, matrix, range
approx.deepEqual(mod([-4,-3,-2,-1,0,1,2,3,4], 3), [2,0,1,2,0,1,2,0,1]);
approx.deepEqual(mod(matrix([-4,-3,-2,-1,0,1,2,3,4]), 3), matrix([2,0,1,2,0,1,2,0,1]));
approx.deepEqual(mod(range(-4,4), 3), [2,0,1,2,0,1,2,0,1]);
