// test abs
var assert = require('assert');
var math = require('../../../math.js');

// parser
assert.equal(math.eval('abs(-4.2)'), 4.2);

// number
assert.equal(math.abs(-4.2), 4.2);
assert.equal(math.abs(-3.5), 3.5);
assert.equal(math.abs(100), 100);
assert.equal(math.abs(0), 0);

// complex
assert.equal(math.abs(math.complex(3, -4)), 5);

// unit
assert.throws(function () {
  math.abs(math.unit(5, 'km'));
});

// string
assert.throws(function () {
  math.abs('a string');
});

// matrix, array
var a1 = math.abs(math.matrix([1,-2,3]));
assert.ok(a1 instanceof math.type.Matrix);
assert.deepEqual(a1.size(), [3]);
assert.deepEqual(a1.valueOf(), [1,2,3]);
a1 = math.abs(math.range(-2,2));
assert.ok(a1 instanceof Array);
assert.deepEqual(a1.length, 5);
assert.deepEqual(a1, [2,1,0,1,2]);
