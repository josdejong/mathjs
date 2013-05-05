// test ones
var assert = require('assert');
var math = require('../../../math.js');

assert.deepEqual(math.ones().valueOf(), [[1]]);
assert.deepEqual(math.ones([]).valueOf(), [[1]]);
assert.deepEqual(math.ones(3).valueOf(), [[1,1,1],[1,1,1],[1,1,1]]);
assert.deepEqual(math.ones(2,3).valueOf(), [[1,1,1],[1,1,1]]);
assert.deepEqual(math.ones(3,2).valueOf(), [[1,1],[1,1],[1,1]]);
assert.deepEqual(math.ones([3,2]).valueOf(), [[1,1],[1,1],[1,1]]);
assert.deepEqual(math.ones(math.matrix([3,2])).valueOf(), [[1,1],[1,1],[1,1]]);
assert.deepEqual(math.ones(math.matrix([[[3]],[[2]]])).valueOf(), [[1,1],[1,1],[1,1]]);
assert.deepEqual(math.ones(2,2,2).valueOf(), [[[1,1],[1,1]],[[1,1],[1,1]]]);
assert.deepEqual(math.ones([2,2,2]).valueOf(), [[[1,1],[1,1]],[[1,1],[1,1]]]);
a = math.matrix([[1, 2, 3], [4, 5, 6]]);
assert.deepEqual(math.ones(math.size(a)).size(), a.size());
