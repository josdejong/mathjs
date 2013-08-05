// test squeeze
var assert = require('assert');
var math = require('../../../src/index.js'),
    squeeze = math.squeeze,
    size = math.size,
    matrix = math.matrix;

m = math.ones(1,3,2);
assert.deepEqual(size(m), matrix([1,3,2]));
assert.deepEqual(size(m.valueOf()), [1,3,2]);
assert.deepEqual(size(squeeze(m)), matrix([3,2]));
m = math.ones(3,1,1);
assert.deepEqual(size(m), matrix([3,1,1]));
assert.deepEqual(size(squeeze(m)), matrix([3]));
assert.deepEqual(squeeze(2.3), 2.3);
assert.deepEqual(size(squeeze(math.range(1,5))), [5]);
