// test numerical functions

var assert = require('assert');
var math = require('../../math.js');

// test size
assert.deepEqual(math.size([[1,2,3],[4,5,6]]), [2,3]);
assert.deepEqual(math.size([[[1,2],[3,4]],[[5,6],[7,8]]]), [2,2,2]);
assert.deepEqual(math.size([1,2,3]), [3]);
assert.deepEqual(math.size([[1],[2],[3]]), [3,1]);
assert.deepEqual(math.size(100), []);
assert.deepEqual(math.size([100]), [1]);
assert.deepEqual(math.size([[100]]), [1,1]);
assert.deepEqual(math.size([[[100]]]), [1,1,1]);
assert.deepEqual(math.size([]), [0]);
assert.deepEqual(math.size([[]]), [0,0]);
assert.deepEqual(math.size([[[]]]), [0,0,0]);
assert.deepEqual(math.size('hello'), [5]);
assert.deepEqual(math.size(''), [0]);
assert.deepEqual(math.size(math.complex(2,3)), []);
assert.deepEqual(math.size(null), []);
assert.deepEqual(math.size(math.matrix()), [0]);
assert.deepEqual(math.size(math.range(2,5)), [4]);
// TODO: test whether math.size throws an error in case of invalid data or size

// test identity
assert.deepEqual(math.identity().valueOf(), [[1]]);
assert.deepEqual(math.identity([]).valueOf(), [[1]]);
assert.deepEqual(math.identity(1).valueOf(), [[1]]);
assert.deepEqual(math.identity(2).valueOf(), [[1,0],[0,1]]);
assert.deepEqual(math.identity([2]).valueOf(), [[1,0],[0,1]]);
assert.deepEqual(math.identity(2,3).valueOf(), [[1,0,0],[0,1,0]]);
assert.deepEqual(math.identity(3,2).valueOf(), [[1,0],[0,1],[0,0]]);
assert.deepEqual(math.identity([3,2]).valueOf(), [[1,0],[0,1],[0,0]]);
assert.deepEqual(math.identity(math.matrix([3,2])).valueOf(), [[1,0],[0,1],[0,0]]);
assert.deepEqual(math.identity(math.matrix([[3],[2]])).valueOf(), [[1,0],[0,1],[0,0]]);
assert.deepEqual(math.identity(3,3).valueOf(), [[1,0,0],[0,1,0],[0,0,1]]);
assert.throws(function () {math.identity(3,3,2);});
assert.throws(function () {math.identity([3,3,2]);});


// test zeros
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
var a = math.matrix([[1, 2, 3], [4, 5, 6]]);
assert.deepEqual(math.zeros(math.size(a)).size(), a.size());


// test ones
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


// test diag
assert.deepEqual(math.diag([1,2,3]).valueOf(), [[1,0,0],[0,2,0],[0,0,3]]);
assert.deepEqual(math.diag([1,2,3], 1).valueOf(), [[0,1,0,0],[0,0,2,0],[0,0,0,3]]);
assert.deepEqual(math.diag([1,2,3], -1).valueOf(), [[0,0,0],[1,0,0],[0,2,0],[0,0,3]]);
assert.deepEqual(math.diag([[1,2,3],[4,5,6]]).valueOf(), [1,5]);
assert.deepEqual(math.diag([[1,2,3],[4,5,6]],1).valueOf(), [2,6]);
assert.deepEqual(math.diag([[1,2,3],[4,5,6]],-1).valueOf(), [4]);
assert.deepEqual(math.diag([[1,2,3],[4,5,6]],-2).valueOf(), []);
assert.deepEqual(math.diag(math.range(1,3)).valueOf(), [[1,0,0],[0,2,0],[0,0,3]]);
// TODO: test diag for all types of input (also scalar)
