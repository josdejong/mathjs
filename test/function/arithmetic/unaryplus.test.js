// test unary plus
var assert = require('assert'),
    mathjs = require('../../../index'),
    math = mathjs(),
    error = require('../../../lib/error/index'),
    bignumber = math.bignumber;

describe('unaryplus', function() {
  it('should return unary plus of a boolean', function () {
    assert.equal(math.unaryplus(true), 1);
    assert.equal(math.unaryplus(false), 0);
  });

  it('should return bignumber unary plus of a boolean', function () {
    var bigmath = mathjs({number: 'bignumber'});
    assert.deepEqual(bigmath.unaryplus(true), bigmath.bignumber(1));
    assert.deepEqual(bigmath.unaryplus(false), bigmath.bignumber(0));
  });

  it('should return unary plus on a string', function() {
    assert.equal(math.unaryplus('2'), 2);
    assert.equal(math.unaryplus('-2'), -2);
  });

  it('should return bignumber unary plus on a string', function() {
    var bigmath = mathjs({number: 'bignumber'});
    assert.deepEqual(bigmath.unaryplus('2'), bigmath.bignumber(2));
    assert.deepEqual(bigmath.unaryplus('-2'), bigmath.bignumber(-2));
  });

  it('should perform unary plus of a number', function() {
    assert.deepEqual(math.unaryplus(2), 2);
    assert.deepEqual(math.unaryplus(-2), -2);
    assert.deepEqual(math.unaryplus(0), 0);
  });

  it('should perform unary plus of a big number', function() {
    assert.deepEqual(math.unaryplus(bignumber(2)), bignumber(2));
    assert.deepEqual(math.unaryplus(bignumber(-2)), bignumber(-2));
    assert.deepEqual(math.unaryplus(bignumber(0)).valueOf(), bignumber(0).valueOf());
  });

  it('should perform unary plus of a complex number', function() {
    assert.equal(math.unaryplus(math.complex(3, 2)), '3 + 2i');
    assert.equal(math.unaryplus(math.complex(3, -2)), '3 - 2i');
    assert.equal(math.unaryplus(math.complex(-3, 2)), '-3 + 2i');
    assert.equal(math.unaryplus(math.complex(-3, -2)), '-3 - 2i');
  });

  it('should perform unary plus of a unit', function() {
    assert.equal(math.unaryplus(math.unit(5, 'km')).toString(), '5 km');
  });

  it('should perform element-wise unary plus on a matrix', function() {
    a2 = math.matrix([[1,2],[3,4]]);
    var a7 = math.unaryplus(a2);
    assert.ok(a7 instanceof math.type.Matrix);
    assert.deepEqual(a7.size(), [2,2]);
    assert.deepEqual(a7.valueOf(), [[1,2],[3,4]]);
    assert.deepEqual(math.unaryplus([[1,2],[3,4]]), [[1,2],[3,4]]);
  });

  it('should throw an error in case of invalid number of arguments', function() {
    assert.throws(function () {math.unaryplus()}, error.ArgumentsError);
    assert.throws(function () {math.unaryplus(1, 2)}, error.ArgumentsError);
  });

  it('should throw an error in case of invalid type of argument', function() {
    assert.throws(function () {math.unaryplus(new Date())}, error.UnsupportedTypeError);
  });

});