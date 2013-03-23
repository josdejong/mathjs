// test matrix functions

var assert = require('assert');
var math = require('../../math.js'),
    Complex = math.Complex,
    Unit = math.Unit,
    Matrix = math.Matrix,
    Vector = math.Vector,
    Range = math.Range;

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
assert.deepEqual(math.size(new Complex(2,3)), []);
assert.deepEqual(math.size(null), []);
assert.deepEqual(math.size(new Vector()), [0]);
assert.deepEqual(math.size(new Matrix()), [0]);
assert.deepEqual(math.size(new Range(2,5)), [4]);
// TODO: test whether math.size throws an error in case of invalid data or size

// test eye
assert.deepEqual(math.eye().valueOf(), [[1]]);
assert.deepEqual(math.eye([]).valueOf(), [[1]]);
assert.deepEqual(math.eye(1).valueOf(), [[1]]);
assert.deepEqual(math.eye(2).valueOf(), [[1,0],[0,1]]);
assert.deepEqual(math.eye([2]).valueOf(), [[1,0],[0,1]]);
assert.deepEqual(math.eye(2,3).valueOf(), [[1,0,0],[0,1,0]]);
assert.deepEqual(math.eye(3,2).valueOf(), [[1,0],[0,1],[0,0]]);
assert.deepEqual(math.eye([3,2]).valueOf(), [[1,0],[0,1],[0,0]]);
assert.deepEqual(math.eye(new Vector([3,2])).valueOf(), [[1,0],[0,1],[0,0]]);
assert.deepEqual(math.eye(new Matrix([[3],[2]])).valueOf(), [[1,0],[0,1],[0,0]]);
assert.deepEqual(math.eye(3,3).valueOf(), [[1,0,0],[0,1,0],[0,0,1]]);
assert.throws(function () {math.eye(3,3,2);});
assert.throws(function () {math.eye([3,3,2]);});


// test zeros
assert.deepEqual(math.zeros().valueOf(), [[0]]);
assert.deepEqual(math.zeros([]).valueOf(), [[0]]);
assert.deepEqual(math.zeros(3).valueOf(), [[0,0,0],[0,0,0],[0,0,0]]);
assert.deepEqual(math.zeros(2,3).valueOf(), [[0,0,0],[0,0,0]]);
assert.deepEqual(math.zeros(3,2).valueOf(), [[0,0],[0,0],[0,0]]);
assert.deepEqual(math.zeros([3,2]).valueOf(), [[0,0],[0,0],[0,0]]);
assert.deepEqual(math.zeros(new Vector([3,2])).valueOf(), [[0,0],[0,0],[0,0]]);
assert.deepEqual(math.zeros(new Matrix([3,2])).valueOf(), [[0,0],[0,0],[0,0]]);
assert.deepEqual(math.zeros(new Matrix([[[3]],[[2]]])).valueOf(), [[0,0],[0,0],[0,0]]);
assert.deepEqual(math.zeros(2,2,2).valueOf(), [[[0,0],[0,0]],[[0,0],[0,0]]]);
assert.deepEqual(math.zeros([2,2,2]).valueOf(), [[[0,0],[0,0]],[[0,0],[0,0]]]);
var a = new Matrix([[1, 2, 3], [4, 5, 6]]);
assert.deepEqual(math.zeros(math.size(a)).size(), a.size());


// test ones
assert.deepEqual(math.ones().valueOf(), [[1]]);
assert.deepEqual(math.ones([]).valueOf(), [[1]]);
assert.deepEqual(math.ones(3).valueOf(), [[1,1,1],[1,1,1],[1,1,1]]);
assert.deepEqual(math.ones(2,3).valueOf(), [[1,1,1],[1,1,1]]);
assert.deepEqual(math.ones(3,2).valueOf(), [[1,1],[1,1],[1,1]]);
assert.deepEqual(math.ones([3,2]).valueOf(), [[1,1],[1,1],[1,1]]);
assert.deepEqual(math.ones(new Vector([3,2])).valueOf(), [[1,1],[1,1],[1,1]]);
assert.deepEqual(math.ones(new Matrix([3,2])).valueOf(), [[1,1],[1,1],[1,1]]);
assert.deepEqual(math.ones(new Matrix([[[3]],[[2]]])).valueOf(), [[1,1],[1,1],[1,1]]);
assert.deepEqual(math.ones(2,2,2).valueOf(), [[[1,1],[1,1]],[[1,1],[1,1]]]);
assert.deepEqual(math.ones([2,2,2]).valueOf(), [[[1,1],[1,1]],[[1,1],[1,1]]]);
a = new Matrix([[1, 2, 3], [4, 5, 6]]);
assert.deepEqual(math.ones(math.size(a)).size(), a.size());

