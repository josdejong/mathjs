// test unary minus
var assert = require('assert'),
    math = require('../../../index')(),
    error = require('../../../lib/error/index'),
    bignumber = math.bignumber;

describe('unaryminus', function() {
  it('should perform unary minus of a boolean', function () {
    assert.equal(math.unary(true), -1);
    assert.equal(math.unary(false), 0);
  });

  it('should perform unary minus of a number', function() {
    assert.deepEqual(math.unary(2), -2);
    assert.deepEqual(math.unary(-2), 2);
    assert.deepEqual(math.unary(0), 0);
  });

  it('should perform unary minus of a big number', function() {
    assert.deepEqual(math.unary(bignumber(2)), bignumber(-2));
    assert.deepEqual(math.unary(bignumber(-2)), bignumber(2));
    assert.deepEqual(math.unary(bignumber(0)).valueOf(), bignumber(0).valueOf());
  });

  it('should perform unary minus of a complex number', function() {
    assert.equal(math.unary(math.complex(3, 2)), '-3 - 2i');
    assert.equal(math.unary(math.complex(3, -2)), '-3 + 2i');
    assert.equal(math.unary(math.complex(-3, 2)), '3 - 2i');
    assert.equal(math.unary(math.complex(-3, -2)), '3 + 2i');
  });

  it('should perform unary minus of a unit', function() {
    assert.equal(math.unary(math.unit(5, 'km')).toString(), '-5 km');
  });

  it('should throw an error when used with a string', function() {
    assert.throws(function () {math.unary('hello'); });
  });

  it('should perform element-wise unary minus on a matrix', function() {
    a2 = math.matrix([[1,2],[3,4]]);
    var a7 = math.unary(a2);
    assert.ok(a7 instanceof math.type.Matrix);
    assert.deepEqual(a7.size(), [2,2]);
    assert.deepEqual(a7.valueOf(), [[-1,-2],[-3,-4]]);
    assert.deepEqual(math.unary([[1,2],[3,4]]), [[-1,-2],[-3,-4]]);
  });

  it('should throw an error in case of invalid number of arguments', function() {
    assert.throws(function () {math.unary()}, error.ArgumentsError);
    assert.throws(function () {math.unary(1, 2)}, error.ArgumentsError);
  });

});