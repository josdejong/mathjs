var assert = require('assert');
var math = require('../../../index.js');

describe('arg', function() {

  it('should compute the argument of a complex number correctly', function() {
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
  });

  it('should calculate the argument for each element in a matrix', function() {
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
  });

  it('should compute the argument of a real number correctly', function() {
    assert.equal(math.arg(2) / math.pi, 0);
    assert.equal(math.arg(-2) / math.pi, 1);
  });

  it('should throw an error if used with a string', function() {
    assert.throws(function () {math.arg('string')});
  });

  it('should throw an error if used with a unit', function() {
    assert.throws(function () {math.arg(math.unit('5cm'))});
  });

});