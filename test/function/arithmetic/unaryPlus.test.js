// test unary plus
var assert = require('assert'),
    math = require('../../../index'),
    error = require('../../../lib/error/index'),
    bignumber = math.bignumber;

describe('unaryPlus', function() {
  it('should return unary plus of a boolean', function () {
    assert.equal(math.unaryPlus(true), 1);
    assert.equal(math.unaryPlus(false), 0);
  });

  it('should return unary plus of null', function () {
    assert.equal(math.unaryPlus(null), 0);
  });

  it('should return bignumber unary plus of a boolean', function () {
    var bigmath = math.create({number: 'bignumber'});
    assert.deepEqual(bigmath.unaryPlus(true), bigmath.bignumber(1));
    assert.deepEqual(bigmath.unaryPlus(false), bigmath.bignumber(0));
  });

  it('should return unary plus on a string', function() {
    assert.equal(math.unaryPlus('2'), 2);
    assert.equal(math.unaryPlus('-2'), -2);
  });

  it('should return bignumber unary plus on a string', function() {
    var bigmath = math.create({number: 'bignumber'});
    assert.deepEqual(bigmath.unaryPlus('2'), bigmath.bignumber(2));
    assert.deepEqual(bigmath.unaryPlus('-2'), bigmath.bignumber(-2));
  });

  it('should perform unary plus of a number', function() {
    assert.deepEqual(math.unaryPlus(2), 2);
    assert.deepEqual(math.unaryPlus(-2), -2);
    assert.deepEqual(math.unaryPlus(0), 0);
  });

  it('should perform unary plus of a big number', function() {
    assert.deepEqual(math.unaryPlus(bignumber(2)), bignumber(2));
    assert.deepEqual(math.unaryPlus(bignumber(-2)), bignumber(-2));
    assert.deepEqual(math.unaryPlus(bignumber(0)).valueOf(), bignumber(0).valueOf());
  });

  it('should perform unary plus of a complex number', function() {
    assert.equal(math.unaryPlus(math.complex(3, 2)), '3 + 2i');
    assert.equal(math.unaryPlus(math.complex(3, -2)), '3 - 2i');
    assert.equal(math.unaryPlus(math.complex(-3, 2)), '-3 + 2i');
    assert.equal(math.unaryPlus(math.complex(-3, -2)), '-3 - 2i');
  });

  it('should perform unary plus of a unit', function() {
    assert.equal(math.unaryPlus(math.unit(5, 'km')).toString(), '5 km');
  });

  it('should perform element-wise unary plus on a matrix', function() {
    a2 = math.matrix([[1,2],[3,4]]);
    var a7 = math.unaryPlus(a2);
    assert.ok(a7 instanceof math.type.Matrix);
    assert.deepEqual(a7.size(), [2,2]);
    assert.deepEqual(a7.valueOf(), [[1,2],[3,4]]);
    assert.deepEqual(math.unaryPlus([[1,2],[3,4]]), [[1,2],[3,4]]);
  });

  it('should throw an error in case of invalid number of arguments', function() {
    assert.throws(function () {math.unaryPlus()}, error.ArgumentsError);
    assert.throws(function () {math.unaryPlus(1, 2)}, error.ArgumentsError);
  });

  it('should throw an error in case of invalid type of argument', function() {
    assert.throws(function () {math.unaryPlus(new Date())}, error.UnsupportedTypeError);
  });

});