// test unaryminus
var assert = require('assert');
var math = require('../../../math.js');

// parser
assert.equal(math.eval('-2'), -2);
assert.equal(math.eval('4*-2'), -8);
assert.equal(math.eval('4 * -2'), -8);
assert.equal(math.eval('4+-2'), 2);
assert.equal(math.eval('4 + -2'), 2);
assert.equal(math.eval('4--2'), 6);
assert.equal(math.eval('4 - -2'), 6);
assert.equal(math.eval('unaryminus(4)'), -4);

// number
assert.deepEqual(math.unaryminus(2), -2);
assert.deepEqual(math.unaryminus(-2), 2);
assert.deepEqual(math.unaryminus(0), 0);

// complex
assert.equal(math.unaryminus(math.complex(3, 2)), '-3 - 2i');
assert.equal(math.unaryminus(math.complex(3, -2)), '-3 + 2i');
assert.equal(math.unaryminus(math.complex(-3, 2)), '3 - 2i');
assert.equal(math.unaryminus(math.complex(-3, -2)), '3 + 2i');

// unit
assert.equal(math.unaryminus(math.unit(5, 'km')).toString(), '-5 km');

// string
assert.throws(function () {math.subtract('hello ', 'world'); });
assert.throws(function () {math.subtract('str', 123)});
assert.throws(function () {math.subtract(123, 'str')});

// array, matrix, range
a2 = math.matrix([[1,2],[3,4]]);
var a7 = math.unaryminus(a2);
assert.ok(a7 instanceof math.type.Matrix);
assert.deepEqual(a7.size(), [2,2]);
assert.deepEqual(a7.valueOf(), [[-1,-2],[-3,-4]]);
assert.deepEqual(math.unaryminus([[1,2],[3,4]]), [[-1,-2],[-3,-4]]);
assert.deepEqual(math.unaryminus(math.range(1,5)), math.range(-1,-1,-5).valueOf());
