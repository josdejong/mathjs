// test data type Complex

var assert = require('assert');
var math = require('../../math.js'),
    Complex = math.Complex,
    Unit = math.Unit;

var complex1 = new Complex(3, -4);
assert.equal(complex1.re, 3);
assert.equal(complex1.im, -4);
assert.equal(complex1, '3 - 4i');
assert.throws(function () { Complex(3, -4); });

// test constructor
assert.equal(new Complex().toString(), '0');
assert.equal(new Complex(2, 3).toString(), '2 + 3i');
assert.equal(new Complex(2, 0).toString(), '2');
assert.equal(new Complex(0, 3).toString(), '3i');
assert.equal(new Complex('2 + 3i').toString(), '2 + 3i');
assert.equal(new Complex('2 +3i').toString(), '2 + 3i');
assert.equal(new Complex('2+3i').toString(), '2 + 3i');
assert.equal(new Complex(' 2+3i ').toString(), '2 + 3i');
assert.equal(new Complex('2-3i').toString(), '2 - 3i');
assert.equal(new Complex('-2-3i').toString(), '-2 - 3i');
assert.equal(new Complex('-2+3i').toString(), '-2 + 3i');
assert.equal(new Complex('-2+3i').toString(), '-2 + 3i');
//assert.equal(new Complex('-2+3e-1i').toString(), '-2 + 0.3i'); // TODO
//assert.equal(new Complex('-2+3e+1i').toString(), '-2 + 30i'); // TODO
//assert.equal(new Complex('2+3e2i').toString(), '2 + 300i'); // TODO
//assert.equal(new Complex('2.2e-1-3.2e-1i').toString(), '0.22 - 0.32i'); // TODO
assert.equal(new Complex('2').toString(), '2');
assert.equal(new Complex('-2').toString(), '-2');
assert.equal(new Complex('3i').toString(), '3i');
assert.equal(new Complex('-3i').toString(), '-3i');
assert.throws(function () { new Complex(1, 2, 3); });
assert.throws(function () { new Complex("str", 2); });
assert.throws(function () { new Complex(1, true); });
assert.throws(function () { new Complex(2); });
assert.throws(function () { new Complex(""); });
assert.throws(function () { new Complex("2r"); });
assert.throws(function () { new Complex("str"); });
assert.throws(function () { new Complex("2i+3i"); });


// test toString
assert.equal(new Complex().toString(),      '0');
assert.equal(new Complex(0, 2).toString(),  '2i');
assert.equal(new Complex(1, 1).toString(),  '1 + i');
assert.equal(new Complex(1, 2).toString(),  '1 + 2i');
assert.equal(new Complex(1, -1).toString(), '1 - i');
assert.equal(new Complex(1, -2).toString(), '1 - 2i');
assert.equal(new Complex(1, 0).toString(),  '1');
assert.equal(new Complex(-1, 2).toString(), '-1 + 2i');
assert.equal(new Complex(-1, 1).toString(), '-1 + i');

// test copy
var copy = complex1.copy();
copy.re = 100;
copy.im = 200;
assert.notEqual(complex1, copy);
assert.equal(complex1.re, 3);
assert.equal(complex1.im, -4);
assert.equal(copy.re, 100);
assert.equal(copy.im, 200);
