var assert = require('assert');
var math = require('../math.js');

assert.equal(math.round(math.pi, 3), 3.142);
assert.equal(math.sin(math.pi / 2), 1);
assert.equal(math.PI, math.pi);

assert.equal(math.round(math.e, 3), 2.718);

assert.equal(math.i.re, 0);
assert.equal(math.i.im, 1);
assert.deepEqual(math.i, math.complex(0,1));
assert.deepEqual(math.sqrt(-1), math.i);
assert.equal(math.I, math.i);

// test euler 1+e^(pi*i) == 0
assert.equal(math.round(math.add(1,math.pow(math.e, math.multiply(math.pi, math.i))), 5), 0);
assert.equal(math.round(math.eval('1+e^(pi*i)'), 5), 0);
