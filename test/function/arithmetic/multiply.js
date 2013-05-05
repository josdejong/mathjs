// test multiply
var assert = require('assert');
var math = require('../../../math.js');

// parser
assert.equal(math.eval('4 * 2'), 8);
assert.equal(math.eval('8 * 2 * 2'), 32);
assert.equal(math.eval('multiply(4, 2)'), 8);

// number
assert.equal(math.multiply(2, 3), 6);
assert.equal(math.multiply(-2, 3), -6);
assert.equal(math.multiply(-2, -3), 6);
assert.equal(math.multiply(5, 0), 0);
assert.equal(math.multiply(0, 5), 0);

// TODO: complex

// unit
assert.equal(math.multiply(2, math.unit('5 mm')).toString(), '10 mm');
assert.equal(math.multiply(2, math.unit('5 mm')).toString(), '10 mm');
assert.equal(math.multiply(math.unit('5 mm'), 2).toString(), '10 mm');
assert.equal(math.multiply(math.unit('5 mm'), 0).toString(), '0 m');

// TODO: string


// matrix, array
var a = math.matrix([[1,2],[3,4]]);
var b = math.matrix([[5,6],[7,8]]);
var c = math.matrix([[5],[6]]);
var d = math.matrix([[5,6]]);
assert.deepEqual(math.multiply(a, 3).valueOf(), [[3,6],[9,12]]);
assert.deepEqual(math.multiply(3, a).valueOf(), [[3,6],[9,12]]);
assert.deepEqual(math.multiply(a, b).valueOf(), [[19,22],[43,50]]);
assert.deepEqual(math.multiply(a, c).valueOf(), [[17],[39]]);
assert.deepEqual(math.multiply(d, a).valueOf(), [[23,34]]);
assert.deepEqual(math.multiply(d, b).valueOf(), [[67,78]]);
assert.deepEqual(math.multiply(d, c).valueOf(), [[61]]);
assert.throws(function () {math.multiply(c, b)});

// TODO: test array, range