// test equal
var assert = require('assert'),
    mathjs = require('../../../index'),
    math = mathjs(),
    error = require('../../../lib/error/index'),
    bignumber = math.bignumber,
    complex = math.complex,
    matrix = math.matrix,
    unit = math.unit,
    dotUnequal = math.dotUnequal;

describe('dotUnequal', function() {

  it('should compare two scalars correctly', function() {
    assert.equal(dotUnequal(2, 3), true);
    assert.equal(dotUnequal(2, 2), false);
    assert.equal(dotUnequal(0, 0), false);
    assert.equal(dotUnequal(-2, 2), true);
    assert.equal(dotUnequal(true, 1), false);
  });

  it('should compare a string an matrix elementwise', function() {
    assert.deepEqual(dotUnequal('B', ['A', 'B', 'C']), [true, false, true]);
    assert.deepEqual(dotUnequal(['A', 'B', 'C'], 'B'), [true, false, true]);
  });

  it('should compare two matrices element wise', function() {
    assert.deepEqual(dotUnequal([1,4,5], [3,4,5]), [true, false, false]);
    assert.deepEqual(dotUnequal([1,4,5], matrix([3,4,5])), matrix([true, false, false]));
  });

  it('should throw an error if matrices have different sizes', function() {
    assert.throws(function () {dotUnequal([1,4,5], [3,4])});
  });

  it('should throw an error in case of invalid number of arguments', function() {
    assert.throws(function () {dotUnequal(1)}, error.ArgumentsError);
    assert.throws(function () {dotUnequal(1, 2, 3)}, error.ArgumentsError);
  });

});
