// test data type Range

var assert = require('assert');
var math = require('../../index.js'),
    Range = math.type.Range;

var r = new Range(2,6);
assert.deepEqual(r.toArray(), [2,3,4,5]);
assert.equal(r.size(), 4);

r = new Range(10, 4, -1);
assert.deepEqual(r.toArray(), [10,9,8,7,6,5]);
assert.equal(r.size(), 6);

r = new Range(1, 5.5, 1.5);
assert.deepEqual(r.toArray(), [1,2.5,4]);
assert.equal(r.size(), 3);

r = new Range();
assert.deepEqual(r.toArray(), []);

r = new Range(0,1);
assert.deepEqual(r.toArray(), [0]);
assert.equal(r.size(), 1);


r = new Range(0,10,0);
assert.deepEqual(r.toArray(), []);
assert.equal(r.size(), 0);

r = new Range(0,10,-1);
assert.deepEqual(r.toArray(), []);
assert.equal(r.size(), 0);

// test range parse
r = Range.parse('10:-1:4');
assert.deepEqual(r.toArray(), [10,9,8,7,6,5]);
assert.equal(r.size(), 6);
r = Range.parse('2 : 6');
assert.deepEqual(r.toArray(), [2,3,4,5]);
assert.equal(r.size(), 4);

assert.equal(Range.parse('a:4'), null);
assert.equal(Range.parse('3'), null);
assert.equal(Range.parse(''), null);


// TODO: extensively test Range