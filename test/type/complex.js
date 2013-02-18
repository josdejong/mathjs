// test data type Complex

var assert = require('assert');
var math = require('../../math.js'),
    Complex = math.type.Complex,
    Unit = math.type.Unit;

var complex1 = new Complex(3, -4);
assert.equal(complex1.re, 3);
assert.equal(complex1.im, -4);
assert.equal(complex1, '3 - 4i');

assert.throws(function () {
    Complex(3, -4);
});

// test toString
assert.equal(new Complex(), '0');
assert.equal(new Complex(0, 2), '2i');
assert.equal(new Complex(1, 1), '1 + i');
assert.equal(new Complex(1, 2), '1 + 2i');
assert.equal(new Complex(1, -1), '1 - i');
assert.equal(new Complex(1, -2), '1 - 2i');
assert.equal(new Complex(1, 0), '1');
assert.equal(new Complex(-1, 2), '-1 + 2i');
assert.equal(new Complex(-1, 1), '-1 + i');

// test copy
var copy = complex1.copy();
copy.re = 100;
copy.im = 200;
assert.notEqual(complex1, copy);
assert.equal(complex1.re, 3);
assert.equal(complex1.im, -4);
assert.equal(copy.re, 100);
assert.equal(copy.im, 200);
