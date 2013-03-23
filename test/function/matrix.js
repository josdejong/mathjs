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

// TODO: test eye
// TODO: test zeros
