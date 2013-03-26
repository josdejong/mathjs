// test data type Vector

var assert = require('assert');
var math = require('../../math.js');

var v = math.vector([3,4,5]);
assert.deepEqual(v.size(), [3]);
assert.deepEqual(v.get(2), 5);
assert.deepEqual(v.get([1,0]), [4,3]);
v.set(1, 400);
assert.deepEqual(v.valueOf(), [3,400,5]);
v.resize(5);
assert.deepEqual(v.valueOf(), [3,400,5,0,0]);
c = math.complex(2,3);
v.resize(7, c);
c.re = 4;
assert.deepEqual(v.valueOf(), [3,400,5,0,0, math.complex(2,3), math.complex(2,3)]);
v.resize(2);
assert.deepEqual(v.valueOf(), [3,400]);
v.set([4,5], [400, 500]);
assert.deepEqual(v.valueOf(), [3,400,0,0,400,500]);

v = math.vector([100]);
v.set(2, 200);
assert.deepEqual(v.valueOf(), [100, 0, 200]);
v.resize(1);
assert.deepEqual(v.valueOf(), [100]);
var s = v.toScalar();
assert.deepEqual(s, 100);

v = math.vector();
assert.deepEqual(v.size(), [0]);
v.set(new math.range(2,2,10), 7);
assert.deepEqual(v.valueOf(), [0,0,7,0,7,0,7,0,7,0,7]);

// TODO: extensively test Vector
