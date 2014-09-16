var assert = require('assert'),
    approx = require('../../../tools/approx'),
    math = require('../../../index'),
    bignumber = math.bignumber,
    std = math.std;

describe('std', function() {

  it('should return the standard deviation of numbers', function() {
    assert.equal(std(5), 0);
    assert.equal(std(2,4,6), 2);
  });

  it('should return the standard deviation of big numbers', function() {
    assert.deepEqual(std(bignumber(2),bignumber(4),bignumber(6)),
        bignumber(2));
  });

  it('should return the standard deviation of complex numbers', function() {
    //
    approx.deepEqual(std(math.complex(2,4), math.complex(4,2)), math.complex(1.41421,-1.41421));
  });

  it('should return the standard deviation of mixed numbers and complex numbers', function() {
    approx.deepEqual(std(2, math.complex(6,4)), math.complex(2.82842,2.82842));
  });

  it('should return the standard deviation from an array', function() {
    assert.equal(std([2,4,6]), 2);
    assert.equal(std([5]), 0);
  });

  it('should return the uncorrected variance from an array', function() {
    assert.equal(std([2,4], 'uncorrected'), 1);
    assert.equal(std([2,4,6,8], 'uncorrected'), Math.sqrt(5));
  });

  it('should return the biased standard deviation from an array', function() {
    assert.equal(std([2,8], 'biased'), Math.sqrt(6));
    assert.equal(std([2,4,6,8], 'biased'), 2);
  });

  it('should throw an error in case of unknown type of normalization', function() {
    assert.throws(function () {std([2,8], 'foo')}, /Unknown normalization/);
  });

  it('should return the standard deviation from an 1d matrix', function() {
    assert.equal(std(math.matrix([2,4,6])), 2);
    assert.equal(std(math.matrix([5])), 0);
  });

  it('should return the standard deviation element from a 2d array', function() {
    assert.deepEqual(std([
      [2,4,6],
      [1,3,5]
    ]), Math.sqrt(3.5));
  });

  it('should return the standard deviation element from a 2d matrix', function() {
    assert.deepEqual(std(math.matrix([
      [2,4,6],
      [1,3,5]
    ])), Math.sqrt(3.5));
  });

  it('should throw an error if called with invalid number of arguments', function() {
    assert.throws(function() {std()});
    assert.throws(function() {std([], 2, 3)});
  });

  it('should throw an error if called with invalid type of arguments', function() {
    assert.throws(function() {std('a', 'b')}, TypeError);
    assert.throws(function() {std(math.unit('5cm'), math.unit('10cm'))}, TypeError);
    assert.throws(function() {std([2,3,4], 5)}, /String expected/);
  });

  it('should throw an error if called with an empty array', function() {
    assert.throws(function() {std([])});
  });

});
