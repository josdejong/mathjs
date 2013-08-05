// test typeof
var assert = require('assert');
var math = require('../../../src/index.js');

assert.equal(math.typeof(2), 'number');
assert.equal(math.typeof(new Number(2)), 'number');
assert.equal(math.typeof(2 + 3), 'number');
assert.equal(math.typeof(2 + ''), 'string');
assert.equal(math.typeof('hello there'), 'string');
assert.equal(math.typeof(math.format(3)), 'string');
assert.equal(math.typeof(math.complex(2,3)), 'complex');
assert.equal(math.typeof([1,2,3]), 'array');
assert.equal(math.typeof(math.matrix()), 'matrix');
assert.equal(math.typeof(math.unit('5cm')), 'unit');
assert.equal(math.typeof(true), 'boolean');
assert.equal(math.typeof(false), 'boolean');
assert.equal(math.typeof(null), 'null');
assert.equal(math.typeof(undefined), 'undefined');
assert.equal(math.typeof(new Date()), 'date');
assert.equal(math.typeof(function () {}), 'function');
assert.equal(math.typeof(math.sin), 'function');
assert.equal(math.typeof({}), 'object');
assert.equal(math.typeof(math), 'object');
assert.throws(function() {math.typeof(); });
assert.throws(function() {math.typeof(1,2); });
