// test add
var assert = require('assert');
var math = require('../../../dist/math.js');

// parser
assert.equal(math.eval('add(2, 3)'), 5);
assert.equal(math.eval('2 + 3'), 5);
assert.equal(math.eval('2 + 3 + 4'), 9);

// number
assert.equal(math.add(2, 3), 5);
assert.equal(math.add(-2, 3), 1);
assert.equal(math.add(2, -3), -1);
assert.equal(math.add(-5, -3), -8);

// complex
assert.equal(math.add(math.complex(3, -4), math.complex(8, 2)), '11 - 2i');
assert.equal(math.add(math.complex(3, -4), 10), '13 - 4i');
assert.equal(math.add(10, math.complex(3, -4)), '13 - 4i');

// unit
assert.equal(math.add(math.unit(5, 'km'), math.unit(100, 'mile')).toString(), '165.93 km');
assert.throws(function () {
  math.add(math.unit(5, 'km'), math.unit(100, 'gram'));
});

// string
assert.equal(math.add('hello ', 'world'), 'hello world');
assert.equal(math.add('str', 123), 'str123');
assert.equal(math.add(123, 'str'), '123str');

// matrix, array
var a2 = math.matrix([[1,2],[3,4]]);
var a3 = math.matrix([[5,6],[7,8]]);
var a4 = math.add(a2, a3);
assert.ok(a4 instanceof math.type.Matrix);
assert.deepEqual(a4.size(), [2,2]);
assert.deepEqual(a4.valueOf(), [[6,8],[10,12]]);
var a5 = math.pow(a2, 2);
assert.ok(a5 instanceof math.type.Matrix);
assert.deepEqual(a5.size(), [2,2]);
assert.deepEqual(a5.valueOf(), [[7,10],[15,22]]);
