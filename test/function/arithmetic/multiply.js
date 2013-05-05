// test multiply
var assert = require('assert'),
    math = require('../../../math.js'),
    multiply = math.multiply,
    matrix = math.matrix,
    unit = math.unit;

// parser
assert.equal(math.eval('4 * 2'), 8);
assert.equal(math.eval('8 * 2 * 2'), 32);
assert.equal(math.eval('multiply(4, 2)'), 8);

// number
assert.equal(multiply(2, 3), 6);
assert.equal(multiply(-2, 3), -6);
assert.equal(multiply(-2, -3), 6);
assert.equal(multiply(5, 0), 0);
assert.equal(multiply(0, 5), 0);

// TODO: complex

// unit
assert.equal(multiply(2, unit('5 mm')).toString(), '10 mm');
assert.equal(multiply(2, unit('5 mm')).toString(), '10 mm');
assert.equal(multiply(unit('5 mm'), 2).toString(), '10 mm');
assert.equal(multiply(unit('5 mm'), 0).toString(), '0 m');

// string
assert.throws(function () {multiply("hello", "world")});
assert.throws(function () {multiply("hello", 2)});

// matrix, array
var a = matrix([[1,2],[3,4]]);
var b = matrix([[5,6],[7,8]]);
var c = matrix([[5],[6]]);
var d = matrix([[5,6]]);
assert.deepEqual(multiply(a, 3).valueOf(), [[3,6],[9,12]]);
assert.deepEqual(multiply(3, a).valueOf(), [[3,6],[9,12]]);
assert.deepEqual(multiply(a, b).valueOf(), [[19,22],[43,50]]);
assert.deepEqual(multiply(a, c).valueOf(), [[17],[39]]);
assert.deepEqual(multiply(d, a).valueOf(), [[23,34]]);
assert.deepEqual(multiply(d, b).valueOf(), [[67,78]]);
assert.deepEqual(multiply(d, c).valueOf(), [[61]]);
assert.throws(function () {multiply(c, b)});

// TODO: test array, range