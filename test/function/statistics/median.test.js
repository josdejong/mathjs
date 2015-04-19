var assert = require('assert'),
    approx = require('../../../tools/approx'),
    math = require('../../../index'),
    bignumber = math.bignumber,
    median = math.median;

describe('median', function() {

  it('should return the median of an even number of numbers', function() {
    assert.equal(median(3,1), 2);
    assert.equal(median(1,3), 2);
    approx.equal(median(1,3,5,2), 2.5);
    assert.equal(median(0,0,0,0), 0);
  });

  it('should return the median of an odd number of numbers', function() {
    assert.equal(median(0), 0);
    assert.equal(median(5), 5);
    approx.equal(median(1,3,5,2,-1), 2);
    assert.equal(median(0,0,0), 0);
  });

  it('should return the median of an even number of bignumbers', function() {
    assert.deepEqual(median(bignumber(1),bignumber(4),bignumber(5),bignumber(2)),
        bignumber(3));
  });

  it('should return the median of an odd number of bignumbers', function() {
    assert.deepEqual(median(bignumber(1),bignumber(4),bignumber(2)),
        bignumber(2));
  });

  it('should return the median from an array', function() {
    assert.equal(median([1,3,5,2,-5]), 2);
  });

  it('should return the median of units', function() {
    assert.deepEqual(median([math.unit('5mm'), math.unit('15mm'), math.unit('10mm')]), math.unit('10mm'));
    assert.deepEqual(median([math.unit('5mm'), math.unit('30mm'), math.unit('20mm'), math.unit('10mm')]), math.unit('15mm'));
  });

  it('should return the median from an 1d matrix', function() {
    assert.equal(median(math.matrix([1,3,5,2,-5])), 2);
  });

  it('should return the median from a 2d array', function() {
    approx.equal(median([
      [ 1, 4,  7],
      [ 3, 0,  5]
    ]), 3.5);
  });

  it('should return the median from a 2d matrix', function() {
    approx.equal(median(math.matrix([
      [ 1, 4,  7],
      [ 3, 0,  5]
    ])), 3.5);
  });

  it('should throw an error if called with invalid number of arguments', function() {
    assert.throws(function() {median()});
    assert.throws(function() {median([], 2, 3)});
  });

  it('should throw an error if called with not yet supported argument dim', function() {
    assert.throws(function() {median([], 2)}, /not yet supported/);
  });

  it('should throw an error if called with unsupported type of arguments', function() {
    assert.throws(function () {median('A', 'C', 'D', 'B')}, math.error.UnsupportedTypeError);
    assert.throws(function () {median('A', 'C', 'B')}, math.error.UnsupportedTypeError);
    assert.throws(function () {median(true, false, true)}, math.error.UnsupportedTypeError);
    assert.throws(function () {median(0, 'B')}, math.error.UnsupportedTypeError);
    assert.throws(function () {median(math.complex(2,3), math.complex(-1,2))}, TypeError); // TODO: for some reason the test fails when expecting math.error.UnsupportedTypeError
  });

  it('should throw an error if called with an empty array', function() {
    assert.throws(function() {median([])});
  });
  
  it('should LaTeX median', function () {
    var expression = math.parse('median(1,2,3,4)');
    assert.equal(expression.toTex(), '\\mathrm{median}\\left(1,2,3,4\\right)');
  });

});
