// test data type Range

var assert = require('assert');
var math = require('../../math.js'),
    Complex = math.Complex,
    Matrix = math.Matrix,
    Vector = math.Vector,
    Range = math.Range;

var r = new Range(2,5);
assert.deepEqual(r.toArray(), [2,3,4,5]);
assert.equal(r.size(), 4);

r = new Range(10, -1, 5);
assert.deepEqual(r.toArray(), [10,9,8,7,6,5]);
assert.equal(r.size(), 6);

r = new Range(1, 1.5, 5);
assert.deepEqual(r.toArray(), [1,2.5,4]);
assert.equal(r.size(), 3);

assert.throws(function () {
    var r = new Range();
});

r = new Range(0,0);
assert.deepEqual(r.toArray(), [0]);
assert.equal(r.size(), 1);


r = new Range(0,0,10);
assert.deepEqual(r.toArray(), []);
assert.equal(r.size(), 0);

r = new Range(0,-1,10);
assert.deepEqual(r.toArray(), []);
assert.equal(r.size(), 0);

// TODO: extensively test Range
