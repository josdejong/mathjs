// test probability functions

var assert = require('assert');
var math = require('../../math.js');


// test factorial
assert.equal(math.factorial(0), 1);
assert.equal(math.factorial(1), 1);
assert.equal(math.factorial(2), 2);
assert.equal(math.factorial(3), 6);
assert.equal(math.factorial(4), 24);
assert.equal(math.factorial(5), 120);
assert.deepEqual(math.factorial(math.range(0,5)), [1,1,2,6,24,120]);
assert.throws(function() { math.factorial(-1); });
assert.throws(function() { math.factorial(1.5); });
assert.throws(function() { math.factorial(); });
assert.throws(function() { math.factorial(1,3); });


// test random
var r1 = math.random();
assert.ok(r1 >= 0 && r1 <= 1);

var r2 = math.random();
assert.ok(r2 >= 0 && r2 <= 1);

var r3 = math.random();
assert.ok(r3 >= 0 && r3 <= 1);
