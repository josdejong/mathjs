// test bitNot
var assert = require('assert'),
    math = require('../../../index'),
    error = require('../../../lib/error/index'),
    bignumber = math.bignumber,
    bitNot = math.bitNot;

describe('bitNot', function () {
  it('should return bitwise not of a boolean', function () {
    assert.equal(bitNot(true), -2);
    assert.equal(bitNot(false), -1);
  });

  it('should return bitwise not of null', function () {
    assert.equal(bitNot(null), -1);
  });

  it('should perform bitwise not of a number', function () {
    assert.deepEqual(bitNot(2), -3);
    assert.deepEqual(bitNot(-2), 1);
    assert.deepEqual(bitNot(0), -1);
  });

  it('should perform bitwise not of a bignumber', function() {
    assert.deepEqual(bitNot(bignumber(2)), bignumber(-3));
    assert.deepEqual(bitNot(bignumber(-2)), bignumber(1));
    assert.deepEqual(bitNot(bignumber('1.2345e30')), bignumber('-1234500000000000000000000000001'));
  });

  it('should throw an error if the parameters are not integers', function () {
    assert.throws(function () {
      bitNot(1.1);
    }, /Parameter in function bitNot must be integer numbers/);
    assert.throws(function () {
      bitNot(bignumber(1.1));
    }, /Parameter in function bitNot must be integer numbers/);
  });

  it('should throw an error if used with a unit', function() {
    assert.throws(function () {bitNot(math.unit('5cm'))}, error.UnsupportedTypeError);
  });

  it('should perform element-wise bitwise not on a matrix', function () {
    a2 = math.matrix([[1,2],[3,4]]);
    var a7 = bitNot(a2);
    assert.ok(a7 instanceof math.type.Matrix);
    assert.deepEqual(a7.size(), [2,2]);
    assert.deepEqual(a7.valueOf(), [[-2,-3],[-4,-5]]);
  });

  it('should perform element-wise bitwise not on an array', function () {
    assert.deepEqual(bitNot([[1,2],[3,4]]), [[-2,-3],[-4,-5]]);
  });

  it('should throw an error in case of invalid number of arguments', function () {
    assert.throws(function () {bitNot()}, error.ArgumentsError);
    assert.throws(function () {bitNot(1, 2)}, error.ArgumentsError);
  });

  it('should throw an error in case of invalid type of argument', function () {
    assert.throws(function () {bitNot(new Date())}, error.UnsupportedTypeError);
    assert.throws(function () {bitNot('foo')}, error.UnsupportedTypeError);
    assert.throws(function () {bitNot(undefined)}, error.UnsupportedTypeError);
  });

  it('should LaTeX bitNot', function () {
    var expression = math.parse('bitNot(4)');
    assert.equal(expression.toTex(), '~\\left(4\\right)');
  });

});
