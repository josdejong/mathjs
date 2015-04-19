// test sign
var assert = require('assert'),
    approx = require('../../../tools/approx'),
    error = require('../../../lib/error/index'),
    math = require('../../../index'),
    bignumber = math.bignumber;

describe('sign', function() {
  it('should calculate the sign of a boolean', function () {
    assert.equal(math.sign(true), 1);
    assert.equal(math.sign(false), 0);
  });

  it('should calculate the sign of null', function () {
    assert.equal(math.sign(null), 0);
  });

  it('should calculate the sign of a number', function() {
    assert.equal(math.sign(3), 1);
    assert.equal(math.sign(-3), -1);
    assert.equal(math.sign(0), 0);
  });

  it('should calculate the sign of a big number', function() {
    assert.deepEqual(math.sign(bignumber(3)), bignumber(1));
    assert.deepEqual(math.sign(bignumber(-3)), bignumber(-1));
    assert.deepEqual(math.sign(bignumber(0)), bignumber(0));
  });

  it('should calculate the sign of a complex value', function() {
    approx.deepEqual(math.sign(math.complex(2,-3)), math.complex(0.554700196225229, -0.832050294337844));
  });

  it('should throw an error when used with a unit', function() {
    assert.throws(function () { math.sign(math.unit('5cm')); });
  });

  it('should throw an error when used with a string', function() {
    assert.throws(function () { math.sign("hello world"); });
  });

  it('should return a matrix of the signs of each elements in the given array', function() {
    assert.deepEqual(math.sign([-2,-1,0,1,2]), [-1,-1,0,1,1]);
  });

  it('should return a matrix of the signs of each elements in the given matrix', function() {
    assert.deepEqual(math.sign(math.matrix([-2,-1,0,1,2])), math.matrix([-1,-1,0,1,1]));
  });

  it('should throw an error in case of invalid number of arguments', function() {
    assert.throws(function () {math.sign()}, error.ArgumentsError);
    assert.throws(function () {math.sign(1, 2)}, error.ArgumentsError);
  });

  it('should LaTeX sign', function () {
    var expression = math.parse('sign(-4)');
    assert.equal(expression.toTex(), '\\mathrm{sign}\\left(-4\\right)');
  });

});
