// test arg
var assert = require('assert');
var math = require('../../../dist/math.js');

assert.equal(math.arg(math.complex('0')) / math.pi, 0);
assert.equal(math.arg(math.complex('1 + 0i')) / math.pi, 0);
assert.equal(math.arg(math.complex('1 + i')) / math.pi, 0.25);
assert.equal(math.arg(math.complex('0 + i')) / math.pi, 0.5);
assert.equal(math.arg(math.complex('-1 + i')) / math.pi, 0.75);
assert.equal(math.arg(math.complex('-1 + 0i')) / math.pi, 1);
assert.equal(math.arg(math.complex('-1 - i')) / math.pi, -0.75);
assert.equal(math.arg(math.complex('0 - i')) / math.pi, -0.5);
assert.equal(math.arg(math.complex('1 - i')) / math.pi, -0.25);
assert.equal(math.arg(math.i) / math.pi, 0.5);
assert.deepEqual(math.divide(math.arg([
  math.i, math.unary(math.i), math.add(1,math.i)
]), math.pi), [
  0.5, -0.5, 0.25
]);
assert.deepEqual(math.matrix(math.divide(math.arg([
  math.i, math.unary(math.i), math.add(1,math.i)
]), math.pi)).valueOf(), [
  0.5, -0.5, 0.25
]);
assert.equal(math.arg(2) / math.pi, 0);
assert.equal(math.arg(-2) / math.pi, 1);
assert.throws(function () {math.arg('string')});
assert.throws(function () {math.arg(math.unit('5cm'))});
