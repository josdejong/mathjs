// test eval
var assert = require('assert');
var math = require('../../../math.js');

assert.equal(math.eval('pi'), Math.PI);
assert.equal(math.eval('(2+3)/4'), 1.25);
assert.equal(math.eval('sqrt(-4)').toString(), '2i');
assert.deepEqual(math.eval(['1+2', '3+4', '5+6']), [3, 7, 11]);
assert.throws(function () {math.eval('b = 43');});
assert.throws(function () {math.eval('function f(x) = a * x');});
assert.throws(function () {math.eval('a([1,1])= [4]');});
assert.throws(function () {math.set('a', 3)});
