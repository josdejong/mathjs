// test data type Range

var assert = require('assert');
var math = require('../../src/index.js');

var r = math.range(2,6);
assert.deepEqual(r.toArray(), [2,3,4,5]);
assert.equal(r.size(), 4);

r = math.range(10, 4, -1);
assert.deepEqual(r.toArray(), [10,9,8,7,6,5]);
assert.equal(r.size(), 6);

r = math.range(1, 5.5, 1.5);
assert.deepEqual(r.toArray(), [1,2.5,4]);
assert.equal(r.size(), 3);

assert.throws(function () {
  var r = math.range();
});

r = math.range(0,1);
assert.deepEqual(r.toArray(), [0]);
assert.equal(r.size(), 1);


r = math.range(0,10,0);
assert.deepEqual(r.toArray(), []);
assert.equal(r.size(), 0);

r = math.range(0,10,-1);
assert.deepEqual(r.toArray(), []);
assert.equal(r.size(), 0);

// test range parse
r = math.range('10:-1:4');
assert.deepEqual(r.toArray(), [10,9,8,7,6,5]);
assert.equal(r.size(), 6);
r = math.range('2 : 6');
assert.deepEqual(r.toArray(), [2,3,4,5]);
assert.equal(r.size(), 4);
assert.throws(function () {math.range('a:4');});
assert.throws(function () {math.range('3');});
assert.throws(function () {math.range(3);});
assert.throws(function () {math.range('');});


// TODO: extensively test Range
