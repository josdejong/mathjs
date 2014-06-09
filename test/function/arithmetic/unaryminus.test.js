// test unary minus
var assert = require('assert'),
    mathjs = require('../../../index'),
    math = mathjs(),
    error = require('../../../lib/error/index'),
    bignumber = math.bignumber;

describe('unaryminus', function() {
  it('should return unary minus of a boolean', function () {
    assert.equal(math.unaryminus(true), -1);
    assert.equal(math.unaryminus(false), 0);
  });

  it('should return bignumber unary minus of a boolean', function () {
    var bigmath = mathjs({number: 'bignumber'});
    assert.deepEqual(bigmath.unaryminus(true), bigmath.bignumber(-1));
    assert.deepEqual(bigmath.unaryminus(false), bigmath.bignumber(-0));
  });

  it('should return unary minus on a string', function() {
    assert.equal(math.unaryminus('2'), -2);
    assert.equal(math.unaryminus('-2'), 2);
  });

  it('should return bignumber unary minus on a string', function() {
    var bigmath = mathjs({number: 'bignumber'});
    assert.deepEqual(bigmath.unaryminus('2'), bigmath.bignumber(-2));
    assert.deepEqual(bigmath.unaryminus('-2'), bigmath.bignumber(2));
  });

  it('should perform unary minus of a number', function() {
    assert.deepEqual(math.unaryminus(2), -2);
    assert.deepEqual(math.unaryminus(-2), 2);
    assert.deepEqual(math.unaryminus(0), 0);
  });

  it('should perform unary minus of a big number', function() {
    assert.deepEqual(math.unaryminus(bignumber(2)), bignumber(-2));
    assert.deepEqual(math.unaryminus(bignumber(-2)), bignumber(2));
    assert.deepEqual(math.unaryminus(bignumber(0)).valueOf(), bignumber(0).valueOf());
  });

  it('should perform unary minus of a complex number', function() {
    assert.equal(math.unaryminus(math.complex(3, 2)), '-3 - 2i');
    assert.equal(math.unaryminus(math.complex(3, -2)), '-3 + 2i');
    assert.equal(math.unaryminus(math.complex(-3, 2)), '3 - 2i');
    assert.equal(math.unaryminus(math.complex(-3, -2)), '3 + 2i');
  });

  it('should perform unary minus of a unit', function() {
    assert.equal(math.unaryminus(math.unit(5, 'km')).toString(), '-5 km');
  });

  it('should perform element-wise unary minus on a matrix', function() {
    a2 = math.matrix([[1,2],[3,4]]);
    var a7 = math.unaryminus(a2);
    assert.ok(a7 instanceof math.type.Matrix);
    assert.deepEqual(a7.size(), [2,2]);
    assert.deepEqual(a7.valueOf(), [[-1,-2],[-3,-4]]);
    assert.deepEqual(math.unaryminus([[1,2],[3,4]]), [[-1,-2],[-3,-4]]);
  });

  it('should throw an error in case of invalid number of arguments', function() {
    assert.throws(function () {math.unaryminus()}, error.ArgumentsError);
    assert.throws(function () {math.unaryminus(1, 2)}, error.ArgumentsError);
  });

  it('should throw an error in case of invalid type of argument', function() {
    assert.throws(function () {math.unaryminus(new Date())}, error.UnsupportedTypeError);
  });

});