// test eye
var assert = require('assert');
var math = require('../../../src/index.js');

assert.deepEqual(math.eye().valueOf(), [[1]]);
assert.deepEqual(math.eye([]).valueOf(), [[1]]);
assert.deepEqual(math.eye(1).valueOf(), [[1]]);
assert.deepEqual(math.eye(2).valueOf(), [[1,0],[0,1]]);
assert.deepEqual(math.eye([2]).valueOf(), [[1,0],[0,1]]);
assert.deepEqual(math.eye(2,3).valueOf(), [[1,0,0],[0,1,0]]);
assert.deepEqual(math.eye(3,2).valueOf(), [[1,0],[0,1],[0,0]]);
assert.deepEqual(math.eye([3,2]).valueOf(), [[1,0],[0,1],[0,0]]);
assert.deepEqual(math.eye(math.matrix([3,2])).valueOf(), [[1,0],[0,1],[0,0]]);
assert.deepEqual(math.eye(math.matrix([[3],[2]])).valueOf(), [[1,0],[0,1],[0,0]]);
assert.deepEqual(math.eye(3,3).valueOf(), [[1,0,0],[0,1,0],[0,0,1]]);
assert.throws(function () {math.eye(3,3,2);});
assert.throws(function () {math.eye([3,3,2]);});
