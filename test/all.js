/**
 * mathjs test
 */

var assert = require('assert');
// var nodeunit = require('nodeunit'); // TODO: use nodeunit
var math = require('../math.js'),
    Complex = math.type.Complex,
    Unit = math.type.Unit;

// test module existence
assert.equal(typeof math, 'object');


// test Complex
var complex1 = new Complex(3, -4);
assert.equal(complex1.toString(), '3 - 4i');

assert.throws(function () {
    Complex(3, -4);
});

// test Unit
var unit1 = new Unit(5000, 'cm');
assert.equal(unit1.toString(), '50 m');

assert.throws(function () {
    math.type.Unit(2, 'inch');
});

// test sqrt
assert.equal(math.sqrt(25), 5);
assert.equal(math.sqrt(complex1).toString(), '2 - i');
assert.equal(math.sqrt(-4).toString(), '2i');

// test abs
assert.equal(math.abs(-4.2), 4.2);
assert.equal(math.abs(-3.5), 3.5);
assert.equal(math.abs(new math.type.Complex(3, -4)), 5);

// TODO: add extensive tests for all functions and types
