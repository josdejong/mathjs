// test max
var assert = require('assert');
var math = require('../../../lib/index.js');

assert.equal(math.max(5), 5);
assert.equal(math.max(3,1), 3);
assert.equal(math.max(1,3), 3);
assert.equal(math.max(1,3,5,2,-5), 5);
assert.equal(math.max(0,0,0,0), 0);
assert.equal(math.max('A', 'C', 'D', 'B'), 'D');
assert.equal(math.max([1,3,5,2,-5]), 5);
assert.equal(math.max(math.matrix([1,3,5,2,-5])), 5);
assert.equal(math.max(math.range(1,6)), 5);
assert.equal(math.max(math.range(5,1,-1)), 5);
assert.throws(function() {math.max()});
assert.throws(function() {math.max([5,2], 3)});
assert.throws(function() {math.max([])});
assert.deepEqual(math.max([
  [ 1, 4,  7],
  [ 3, 0,  5],
  [-1, 9, 11]
]), [ 3, 9, 11]);
assert.deepEqual(math.max(math.matrix([
  [ 1, 4,  7],
  [ 3, 0,  5],
  [-1, 9, 11]
])), math.matrix([ 3, 9, 11]));
