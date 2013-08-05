// test unit construction
var assert = require('assert'),
    math = require('../../../src/index.js'),
    unit = math.unit;


// 1 argument
assert.deepEqual(unit('5 cm').toString(), '50 mm');
assert.deepEqual(unit('5000 cm').toString(), '50 m');
assert.deepEqual(unit('10 kg').toString(), '10 kg');

var a = math.unit('5cm');
var b = math.unit(a);
assert.deepEqual(b.toString(), '50 mm');

assert.throws(function () {unit('invalid unit')}, SyntaxError);

assert.throws(function () {unit(2)}, TypeError);
assert.throws(function () {unit(math.complex(2,3))}, TypeError);

// 2 arguments
assert.deepEqual(unit(5, 'cm').toString(), '50 mm');
assert.deepEqual(unit(10, 'kg').toString(), '10 kg');

assert.throws(function () {unit('2', 'cm')}, TypeError);
assert.throws(function () {unit(2, math.complex(2,3))}, TypeError);

// 0 or 3+ arguments
assert.throws(function () {unit()}, SyntaxError);
assert.throws(function () {unit(1,2,3)}, SyntaxError);
