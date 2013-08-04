// test number construction
var assert = require('assert'),
    math = require('../../../dist/math.js'),
    approx = require('../../../tools/approx.js'),
    number = math.number;

// parser
assert.equal(math.eval('number("123")'), 123);
assert.equal(math.eval('number()'), 0);

// 0 arguments
approx.equal(number(), 0);

// 1 argument

// boolean input
approx.equal(number(true), 1);
approx.equal(number(false), 0);

// number input
approx.equal(number(3), 3);
approx.equal(number(-3), -3);

// string input
approx.equal(number('2.1e3'), 2100);
approx.equal(number(' 2.1e-3 '), 0.0021);
approx.equal(number(''), 0);
approx.equal(number(' '), 0);
assert.throws(function () {number('2.3.4')}, SyntaxError);
assert.throws(function () {number('23a')}, SyntaxError);

// wrong number of arguments
assert.throws(function () {number(1,2)}, SyntaxError);
assert.throws(function () {number(1,2,3)}, SyntaxError);

// wrong type of arguments
assert.throws(function () {number(math.complex(2,3))}, SyntaxError);
assert.throws(function () {number(math.unit('5cm'))}, SyntaxError);
assert.throws(function () {number(math.range(1,3))}, SyntaxError);
assert.throws(function () {number(math.matrix([1,3]))}, SyntaxError);
assert.throws(function () {number([1,3])}, SyntaxError);


