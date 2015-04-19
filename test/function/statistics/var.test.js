var assert = require('assert'),
    math = require('../../../index'),
    bignumber = math.bignumber,
    variance = math['var'];

describe('variance', function() {

  it('should return the variance of numbers', function() {
    assert.equal(variance(5), 0);
    assert.equal(variance(2,4,6), 4);
  });

  it('should return the variance of big numbers', function() {
    assert.deepEqual(variance(bignumber(2),bignumber(4),bignumber(6)),
        bignumber(4));
  });

  it('should return the variance of complex numbers', function() {
    assert.deepEqual(variance(math.complex(2,3), math.complex(-1,2)), math.complex(4,3));
  });

  it('should return the variance of mixed numbers and complex numbers', function() {
    assert.deepEqual(variance(2, math.complex(-1,3)), math.complex(0,-9));
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
    assert.equal(variance(math.matrix([2,4,6])), 4);
    assert.equal(variance(math.matrix([5])), 0);
  });

  it('should return the variance element from a 2d array', function() {
    assert.deepEqual(variance([
      [2,4,6],
      [1,3,5]
    ]), 3.5);
  });

  it('should return the variance element from a 2d matrix', function() {
    assert.deepEqual(variance(math.matrix([
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
    assert.throws(function() {variance(math.unit('5cm'), math.unit('10cm'))}, TypeError);
    assert.throws(function() {variance([2,3,4], 5)}, /String expected/);
  });

  it('should throw an error if called with an empty array', function() {
    assert.throws(function() {variance([])});
  });

  it('should LaTeX var', function () {
    var expression = math.parse('var(1,2,3)');
    assert.equal(expression.toTex(), '\\mathrm{Var}\\left(1,2,3\\right)');
  });

});
