// test zeros
var assert = require('assert');
var math = require('../../../math.js');

assert.deepEqual(math.zeros().valueOf(), [[0]]);
assert.deepEqual(math.zeros([]).valueOf(), [[0]]);
assert.deepEqual(math.zeros(3).valueOf(), [[0,0,0],[0,0,0],[0,0,0]]);
assert.deepEqual(math.zeros(2,3).valueOf(), [[0,0,0],[0,0,0]]);
assert.deepEqual(math.zeros(3,2).valueOf(), [[0,0],[0,0],[0,0]]);
assert.deepEqual(math.zeros([3,2]).valueOf(), [[0,0],[0,0],[0,0]]);
assert.deepEqual(math.zeros(math.matrix([3,2])).valueOf(), [[0,0],[0,0],[0,0]]);
assert.deepEqual(math.zeros(math.matrix([[[3]],[[2]]])).valueOf(), [[0,0],[0,0],[0,0]]);
assert.deepEqual(math.zeros(2,2,2).valueOf(), [[[0,0],[0,0]],[[0,0],[0,0]]]);
assert.deepEqual(math.zeros([2,2,2]).valueOf(), [[[0,0],[0,0]],[[0,0],[0,0]]]);
a = math.matrix([[1, 2, 3], [4, 5, 6]]);
assert.deepEqual(math.zeros(math.size(a)).size(), a.size());
