// test equal
var assert = require('assert'),
    mathjs = require('../../../index'),
    math = mathjs(),
    error = require('../../../lib/error/index'),
    bignumber = math.bignumber,
    complex = math.complex,
    matrix = math.matrix,
    unit = math.unit,
    dotEqual = math.dotEqual;

describe('dotEqual', function() {

  it('should compare two scalars correctly', function() {
    assert.equal(dotEqual(2, 3), false);
    assert.equal(dotEqual(2, 2), true);
    assert.equal(dotEqual(0, 0), true);
    assert.equal(dotEqual(-2, 2), false);
  });

  it('should compare a string an matrix elementwise', function() {
    assert.deepEqual(dotEqual('B', ['A', 'B', 'C']), [false, true, false]);
    assert.deepEqual(dotEqual(['A', 'B', 'C'], 'B'), [false, true, false]);
  });

  it('should compare two matrices element wise', function() {
    assert.deepEqual(dotEqual([1,4,5], [3,4,5]), [false, true, true]);
    assert.deepEqual(dotEqual([1,4,5], matrix([3,4,5])), matrix([false, true, true]));
  });

  it('should throw an error if matrices have different sizes', function() {
    assert.throws(function () {dotEqual([1,4,5], [3,4])});
  });

  it('should throw an error in case of invalid number of arguments', function() {
    assert.throws(function () {dotEqual(1)}, error.ArgumentsError);
    assert.throws(function () {dotEqual(1, 2, 3)}, error.ArgumentsError);
  });

});
