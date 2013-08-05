// test sign
var assert = require('assert');
var math = require('../../../src/index.js');

// parser
assert.equal(math.eval('sign(3)'), 1);
assert.equal(math.eval('sign(-3)'), -1);
assert.equal(math.eval('sign(0)'), 0);

// number
assert.equal(math.sign(3), 1);
assert.equal(math.sign(-3), -1);
assert.equal(math.sign(0), 0);

// complex
assert.equal(math.sign(math.complex(2,-3)).toString(), '0.5547 - 0.83205i');

// unit
assert.throws(function () { math.sign(math.unit('5cm')); });

// string
assert.throws(function () { math.sign("hello world"); });

// matrix, range
assert.deepEqual(math.sign(math.range(-2,2)), [-1,-1,0,1,1]);
assert.deepEqual(math.sign(math.matrix(math.range(-2,2))).valueOf(), [-1,-1,0,1,1]);
assert.deepEqual(math.sign([-2, -1, 0, 1, 2]), [-1,-1,0,1,1]);
