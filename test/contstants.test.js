var assert = require('assert'),
    math = require('../src/index.js'),
    approx = require('../tools/approx.js');

// pi
approx.equal(math.pi, 3.14159265358979);
approx.equal(math.sin(math.pi / 2), 1);
approx.equal(math.PI, math.pi);
approx.equal(math.eval('pi'), 3.14159265358979);

// tau
approx.equal(math.tau, 6.28318530717959);
approx.equal(math.eval('tau'), 6.28318530717959);

// e
approx.equal(math.e, 2.71828182845905);
approx.equal(math.eval('e'), 2.71828182845905);

// i
assert.equal(math.i.re, 0);
assert.equal(math.i.im, 1);
assert.deepEqual(math.i, math.complex(0,1));
assert.deepEqual(math.sqrt(-1), math.i);
assert.deepEqual(math.eval('i'), math.complex(0, 1));

// test euler 1+e^(pi*i) == 0
assert.equal(math.round(math.add(1,math.pow(math.e, math.multiply(math.pi, math.i))), 5), 0);
assert.equal(math.round(math.eval('1+e^(pi*i)'), 5), 0);

// true, false
assert.strictEqual(math.true, true);
assert.strictEqual(math.false, false);
assert.strictEqual(math.eval('true'), true);
assert.strictEqual(math.eval('false'), false);

// inifinity, NaN
assert.strictEqual(math.Infinity, Infinity);
assert.ok(isNaN(math.NaN));
