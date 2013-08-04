// test subtract
var assert = require('assert');
var math = require('../../../math.js');

// parser
assert.equal(math.eval('4 - 2'), 2);
assert.equal(math.eval('8 - 2 - 2'), 4);
assert.equal(math.eval('subtract(4, 2)'), 2);

// number
assert.deepEqual(math.subtract(4, 2), 2);
assert.deepEqual(math.subtract(4, -4), 8);
assert.deepEqual(math.subtract(-4, -4), 0);
assert.deepEqual(math.subtract(-4, 4), -8);
assert.deepEqual(math.subtract(2, 4), -2);
assert.deepEqual(math.subtract(3, 0), 3);
assert.deepEqual(math.subtract(0, 3), -3);
assert.deepEqual(math.subtract(0, 3), -3);
assert.deepEqual(math.subtract(0, 3), -3);

// complex
assert.equal(math.subtract(math.complex(3, 2), math.complex(8, 4)), '-5 - 2i');
assert.equal(math.subtract(math.complex(6, 3), math.complex(-2, -2)), '8 + 5i');
assert.equal(math.subtract(math.complex(3, 4), 10), '-7 + 4i');
assert.equal(math.subtract(math.complex(3, 4), -2), '5 + 4i');
assert.equal(math.subtract(math.complex(-3, -4), 10), '-13 - 4i');
assert.equal(math.subtract(10, math.complex(3, 4)), '7 - 4i');
assert.equal(math.subtract(10, math.i), '10 - i');
assert.equal(math.subtract(0, math.i), '-i');
assert.equal(math.subtract(10, math.complex(0, 1)), '10 - i');

// unit
assert.equal(math.subtract(math.unit(5, 'km'), math.unit(100, 'mile')).toString(), '-155.93 km');
assert.throws(function () {
  math.subtract(math.unit(5, 'km'), math.unit(100, 'gram'));
});

// string
assert.throws(function () {math.subtract('hello ', 'world'); });
assert.throws(function () {math.subtract('str', 123)});
assert.throws(function () {math.subtract(123, 'str')});

// array, matrix, range
a2 = math.matrix([[1,2],[3,4]]);
a3 = math.matrix([[5,6],[7,8]]);
var a6 = math.subtract(a2, a3);
assert.ok(a6 instanceof math.type.Matrix);
assert.deepEqual(a6.size(), [2,2]);
assert.deepEqual(a6.valueOf(), [[-4,-4],[-4,-4]]);
assert.deepEqual(math.subtract(math.range(1,5), 2), math.range(-1,3).valueOf());
