// test transpose
var assert = require('assert');
var math = require('../../../dist/math.js');

assert.deepEqual(math.transpose(3), 3);
assert.deepEqual(math.transpose([1,2,3]), [1,2,3]);
assert.deepEqual(math.transpose([[1,2,3],[4,5,6]]), [[1,4],[2,5],[3,6]]);
assert.deepEqual(math.transpose(math.matrix([[1,2,3],[4,5,6]])), math.matrix([[1,4],[2,5],[3,6]]));
assert.deepEqual(math.transpose([[1,2],[3,4]]), [[1,3],[2,4]]);
assert.deepEqual(math.transpose([[1,2,3,4]]), [[1],[2],[3],[4]]);
assert.deepEqual(math.transpose([[]]), [[]]);
assert.throws(function () {math.transpose([[[1],[2]],[[3],[4]]])});
