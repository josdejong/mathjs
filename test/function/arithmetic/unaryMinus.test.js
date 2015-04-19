// test unary minus
var assert = require('assert'),
    math = require('../../../index'),
    error = require('../../../lib/error/index'),
    bignumber = math.bignumber;

describe('unaryMinus', function() {
  it('should return unary minus of a boolean', function () {
    assert.equal(math.unaryMinus(true), -1);
    assert.equal(math.unaryMinus(false), 0);
  });

  it('should return bignumber unary minus of a boolean', function () {
    var bigmath = math.create({number: 'bignumber'});
    assert.deepEqual(bigmath.unaryMinus(true), bigmath.bignumber(-1));
    assert.deepEqual(bigmath.unaryMinus(false), bigmath.bignumber(-0));
  });

  it('should return unary minus of null', function () {
    assert.equal(math.unaryMinus(null), 0);
  });

  it('should return unary minus on a string', function() {
    assert.equal(math.unaryMinus('2'), -2);
    assert.equal(math.unaryMinus('-2'), 2);
  });

  it('should return bignumber unary minus on a string', function() {
    var bigmath = math.create({number: 'bignumber'});
    assert.deepEqual(bigmath.unaryMinus('2'), bigmath.bignumber(-2));
    assert.deepEqual(bigmath.unaryMinus('-2'), bigmath.bignumber(2));
  });

  it('should perform unary minus of a number', function() {
    assert.deepEqual(math.unaryMinus(2), -2);
    assert.deepEqual(math.unaryMinus(-2), 2);
    assert.deepEqual(math.unaryMinus(0), 0);
  });

  it('should perform unary minus of a big number', function() {
    assert.deepEqual(math.unaryMinus(bignumber(2)), bignumber(-2));
    assert.deepEqual(math.unaryMinus(bignumber(-2)), bignumber(2));
    assert.deepEqual(math.unaryMinus(bignumber(0)).valueOf(), bignumber(0).valueOf());
  });

  it('should perform unary minus of a complex number', function() {
    assert.equal(math.unaryMinus(math.complex(3, 2)), '-3 - 2i');
    assert.equal(math.unaryMinus(math.complex(3, -2)), '-3 + 2i');
    assert.equal(math.unaryMinus(math.complex(-3, 2)), '3 - 2i');
    assert.equal(math.unaryMinus(math.complex(-3, -2)), '3 + 2i');
  });

  it('should perform unary minus of a unit', function() {
    assert.equal(math.unaryMinus(math.unit(5, 'km')).toString(), '-5 km');
  });

  it('should perform element-wise unary minus on a matrix', function() {
    a2 = math.matrix([[1,2],[3,4]]);
    var a7 = math.unaryMinus(a2);
    assert.ok(a7 instanceof math.type.Matrix);
    assert.deepEqual(a7.size(), [2,2]);
    assert.deepEqual(a7.valueOf(), [[-1,-2],[-3,-4]]);
    assert.deepEqual(math.unaryMinus([[1,2],[3,4]]), [[-1,-2],[-3,-4]]);
  });

  it('should throw an error in case of invalid number of arguments', function() {
    assert.throws(function () {math.unaryMinus()}, error.ArgumentsError);
    assert.throws(function () {math.unaryMinus(1, 2)}, error.ArgumentsError);
  });

  it('should throw an error in case of invalid type of argument', function() {
    assert.throws(function () {math.unaryMinus(new Date())}, error.UnsupportedTypeError);
  });

  it('should LaTeX unaryMinus', function () {
    var expression = math.parse('unaryMinus(1)');
    assert.equal(expression.toTex(), '-\\left(1\\right)');
  });

});
