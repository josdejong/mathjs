// test data type Matrix

var assert = require('assert');
var math = require('../../math.js'),
    Complex = math.Complex,
    Matrix = math.Matrix,
    Vector = math.Vector,
    Range = math.Range,
    Unit = math.Unit;

var m = new Matrix();
assert.equal(m.isScalar(), true);
assert.equal(m.isVector(), true);
assert.deepEqual(m.size(), [0]);
assert.deepEqual(m.toScalar(), null);
assert.throws(function () { m.get([0]); });

m = new Matrix([[23]]);
assert.equal(m.isScalar(), true);
assert.equal(m.isVector(), true);
assert.deepEqual(m.size(), [1,1]);
assert.deepEqual(m.toScalar(), 23);
assert.deepEqual(m.get([0,0]), 23);

m = new Matrix([[1,2,3],[4,5,6]]);
assert.equal(m.isScalar(), false);
assert.equal(m.isVector(), false);
assert.deepEqual(m.size(), [2,3]);
assert.equal(m.get([1,2]), 6);
assert.equal(m.get([0,1]), 2);
assert.throws(function () { m.get([1,2, 3]); });
assert.throws(function () { m.get([3,0]); });
assert.throws(function () { m.get([1]); });

m = new Matrix([1,2,3]);
assert.equal(m.isScalar(), false);
assert.equal(m.isVector(), true);
assert.deepEqual(m.size(), [3]);
assert.deepEqual(m.toVector().valueOf(), [1,2,3]);

m = new Matrix([[1],[2],[3]]);
assert.equal(m.isScalar(), false);
assert.equal(m.isVector(), true);
assert.deepEqual(m.size(), [3,1]);
assert.deepEqual(m.toVector().valueOf(), [1,2,3]);

m = new Matrix([[[1],[2],[3]]]);
assert.equal(m.isScalar(), false);
assert.equal(m.isVector(), true);
assert.deepEqual(m.size(), [1,3,1]);
assert.deepEqual(m.toVector().valueOf(), [1,2,3]);

m = new Matrix([[[3]]]);
assert.equal(m.isScalar(), true);
assert.equal(m.isVector(), true);
assert.deepEqual(m.size(), [1,1,1]);
assert.deepEqual(m.toVector().valueOf(), [3]);

m = new Matrix([[]]);
assert.equal(m.isScalar(), true);
assert.equal(m.isVector(), true);
assert.deepEqual(m.size(), [0,0]);
assert.deepEqual(m.toVector().valueOf(), []);

m = new Matrix();
assert.equal(m.isScalar(), true);
assert.equal(m.isVector(), true);
assert.deepEqual(m.size(), [0]);
assert.deepEqual(m.toVector().valueOf(), []);

// test resizing
m = new Matrix([[1,2,3],[4,5,6]]);
assert.deepEqual(m.size(), [2,3]);
m.resize([2,4]);
assert.deepEqual(m.size(), [2,4]);
assert.deepEqual(m.valueOf(), [[1,2,3,0],[4,5,6,0]]);
m.resize([1,2]);
assert.deepEqual(m.size(), [1,2]);
assert.deepEqual(m.valueOf(), [[1,2]]);
m.resize([1,2,2], 8);
assert.deepEqual(m.size(), [1,2,2]);
assert.deepEqual(m.valueOf(), [[[1,8],[2,8]]]);
m.resize([2,3], 9);
assert.deepEqual(m.size(), [2,3]);
assert.deepEqual(m.valueOf(), [[1, 2, 9], [9, 9, 9]]);
m = new Matrix();
assert.deepEqual(m.size(), [0]);
m.resize([3,3,3], 6);
assert.deepEqual(m.size(), [3,3,3]);
assert.deepEqual(m.valueOf(), [
    [[6,6,6],[6,6,6],[6,6,6]],
    [[6,6,6],[6,6,6],[6,6,6]],
    [[6,6,6],[6,6,6],[6,6,6]]
]);
m.set([2,2,1], 3);
assert.deepEqual(m.valueOf(), [
    [[6,6,6],[6,6,6],[6,6,6]],
    [[6,6,6],[6,6,6],[6,6,6]],
    [[6,6,6],[6,6,6],[6,3,6]]
]);
m.resize([2,2]);
assert.deepEqual(m.size(), [2,2]);
assert.deepEqual(m.valueOf(), [[6,6],[6,6]]);
m.set([1,0], 3);
assert.deepEqual(m.valueOf(), [[6,6],[3,6]]);
m.resize([0]);
assert.deepEqual(m.size(), [0]);
assert.deepEqual(m.valueOf(), []);

m = new Matrix();
m.set([1,2], 5);
assert.deepEqual(m.size(), [2,3]);
assert.deepEqual(m.valueOf(), [[0,0,0],[0,0,5]]);


// TODO: extensively test Matrix
