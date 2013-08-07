// test complex construction
var assert = require('assert'),
    math = require('../../../src/index.js'),
    complex = math.complex;

// 0 arguments
assert.deepEqual(complex(), new math.type.Complex(0, 0));
assert.ok(complex() instanceof math.type.Complex);

// 1 argument (only string or Complex accepted)
assert.deepEqual(complex('2+3i'), new math.type.Complex(2, 3));
assert.deepEqual(complex('2-3i'), new math.type.Complex(2, -3));
assert.ok(complex('2+3i') instanceof math.type.Complex);

var a = complex(2,3);
var b = complex(a);
a.re = 4;
assert.deepEqual(b, new math.type.Complex(2,3));

assert.throws(function () {complex('no valid complex number')}, SyntaxError);
assert.throws(function () {complex(123)}, TypeError);
assert.throws(function () {complex(math.unit('5cm'))}, TypeError);
assert.throws(function () {complex(math.matrix())}, TypeError);

// 2 arguments
assert.deepEqual(complex(2, 3), new math.type.Complex(2, 3));
assert.deepEqual(complex(2, -3), new math.type.Complex(2, -3));
assert.deepEqual(complex(-2, 3), new math.type.Complex(-2, 3));
assert.ok(complex(2, 3) instanceof math.type.Complex);
assert.throws(function () {complex('string', 2)}, TypeError);
assert.throws(function () {complex(2, 'string')}, TypeError);

// more than 2 arguments
assert.throws(function () {complex(2,3,4)}, SyntaxError);
