var assert = require('assert');
var BigNumber = require('decimal.js');
var Complex = require('../../../lib/type/Complex');
var Matrix = require('../../../lib/type/Matrix');
var Unit = require('../../../lib/type/Unit');
var math = require('../../../index');
var variance = math['var'];

describe('variance', function() {

  it('should return the variance of numbers', function() {
    assert.equal(variance(5), 0);
    assert.equal(variance(2,4,6), 4);
  });

  it('should return the variance of big numbers', function() {
    assert.deepEqual(variance(new BigNumber(2),new BigNumber(4),new BigNumber(6)),
        new math.type.BigNumber(4));
  });

  it('should return the variance of complex numbers', function() {
    assert.deepEqual(variance(new Complex(2,3), new Complex(-1,2)), new Complex(4,3));
  });

  it('should return the variance of mixed numbers and complex numbers', function() {
    assert.deepEqual(variance(2, new Complex(-1,3)), new Complex(0,-9));
  });

  it('should return the variance from an array', function() {
    assert.equal(variance([2,4,6]), 4);
    assert.equal(variance([5]), 0);
  });

  it('should return the uncorrected variance from an array', function() {
    assert.equal(variance([2,4], 'uncorrected'), 1);
    assert.equal(variance([2,4,6,8], 'uncorrected'), 5);
  });

  it('should return the biased variance from an array', function() {
    assert.equal(variance([2,8], 'biased'), 6);
    assert.equal(variance([2,4,6,8], 'biased'), 4);
  });

  it('should throw an error in case of unknown type of normalization', function() {
    assert.throws(function () {variance([2,8], 'foo')}, /Unknown normalization/);
  });

  it('should return the variance from an 1d matrix', function() {
    assert.equal(variance(new Matrix([2,4,6])), 4);
    assert.equal(variance(new Matrix([5])), 0);
  });

  it('should return the variance element from a 2d array', function() {
    assert.deepEqual(variance([
      [2,4,6],
      [1,3,5]
    ]), 3.5);
  });

  it('should return the variance element from a 2d matrix', function() {
    assert.deepEqual(variance(new Matrix([
      [2,4,6],
      [1,3,5]
    ])), 3.5);
  });

  it('should throw an error if called with invalid number of arguments', function() {
    assert.throws(function() {variance()});
    assert.throws(function() {variance([], 2, 3)});
  });

  it('should throw an error if called with invalid type of arguments', function() {
    assert.throws(function() {variance('a', 'b')}, TypeError);
    assert.throws(function() {variance(new Unit('5cm'), new Unit('10cm'))}, TypeError);
    assert.throws(function() {variance([2,3,4], 5)}, /String expected/);
  });

  it('should throw an error if called with an empty array', function() {
    assert.throws(function() {variance([])});
  });

});
