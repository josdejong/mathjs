/**
 * Math2 test
 */

var assert = require('assert');
// var nodeunit = require('nodeunit'); // TODO: use nodeunit
var math2 = require('../math2.js'),
    Complex = math2.type.Complex,
    Unit = math2.type.Unit;

// test module existence
assert.equal(typeof math2, 'object');


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
    math2.type.Unit(2, 'inch');
});

// test sqrt
assert.equal(math2.sqrt(25), 5);
assert.equal(math2.sqrt(complex1).toString(), '2 - i');
assert.equal(math2.sqrt(-4).toString(), '2i');

// test abs
assert.equal(math2.abs(-4.2), 4.2);
assert.equal(math2.abs(-3.5), 3.5);
assert.equal(math2.abs(new math2.type.Complex(3, -4)), 5);

// TODO: add extensive tests for all functions and types
