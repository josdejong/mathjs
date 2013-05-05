// test squeeze
var assert = require('assert');
var math = require('../../../math.js');

m = math.ones(1,3,2);
assert.deepEqual(math.size(m).valueOf(), [1,3,2]);
assert.deepEqual(math.size(math.squeeze(m)).valueOf(), [3,2]);
m = math.ones(3,1,1);
assert.deepEqual(math.size(m).valueOf(), [3,1,1]);
assert.deepEqual(math.size(math.squeeze(m)).valueOf(), [3]);
assert.deepEqual(math.squeeze(2.3), 2.3);
assert.deepEqual(math.size(math.squeeze(math.range(1,5))), [5]);
