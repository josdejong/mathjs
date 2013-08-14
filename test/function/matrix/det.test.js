// test det
var assert = require('assert');
var math = require('../../../index.js');

assert.equal(math.det(3), 3);
assert.equal(math.det([5]), 5);
assert.equal(math.det(math.range(2,3)), 2);
assert.equal(math.det([[1,2],[3,4]]), -2);
assert.equal(math.det(math.matrix([[1,2],[3,4]])), -2);
assert.equal(math.det([
  [-2, 2,  3],
  [-1, 1,  3],
  [ 2, 0, -1]
]), 6);
assert.equal(math.det([
  [ 1, 4,  7],
  [ 3, 0,  5],
  [-1, 9, 11]
]), -8);
assert.equal(math.det(math.diag([4,-5,6])), -120);
