var assert = require('assert');
var math = require('../../../math.js');

// test lcm
assert.equal(math.lcm(4, 6), 12);
assert.equal(math.lcm(4, -6), 12);
assert.equal(math.lcm(6, 4), 12);
assert.equal(math.lcm(-6, 4), 12);
assert.equal(math.lcm(-6, -4), 12);
assert.equal(math.lcm(21, 6), 42);
assert.equal(math.lcm(3, -4, 24), 24);

// TODO: test lcm for wrong number and type of arguments
