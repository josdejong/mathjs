// test min
var assert = require('assert');
var math = require('../../../math.js');

assert.equal(math.min(5), 5);
assert.equal(math.min(1,3), 1);
assert.equal(math.min(3,1), 1);
assert.equal(math.min(1,3,5,-5,2), -5);
assert.equal(math.min(0,0,0,0), 0);
assert.equal(math.min('A', 'C', 'D', 'B'), 'A');
assert.equal(math.min([1,3,5,-5,2]), -5);
assert.equal(math.min(math.matrix([1,3,5,-5,2])), -5);
assert.equal(math.min(math.range(1,5)), 1);
assert.equal(math.min(math.range(5,-1,2)), 2);
assert.throws(function() {math.min()});
assert.throws(function() {math.min([5,2], 3)});
assert.throws(function() {math.min([])});
assert.deepEqual(math.min([
    [ 1, 4,  7],
    [ 3, 0,  5],
    [-1, 9, 11]
]), [-1, 0,  5]);
assert.deepEqual(math.min(math.matrix([
    [ 1, 4,  7],
    [ 3, 0,  5],
    [-1, 9, 11]
])), math.matrix([-1, 0, 5]));


