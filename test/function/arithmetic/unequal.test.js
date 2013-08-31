// test equal
var assert = require('assert'),
    math = require('../../../index.js'),
    complex = math.complex,
    matrix = math.matrix,
    unit = math.unit,
    unequal = math.unequal;

describe('unequal', function() {

  it('should compare two numbers correctly', function() {
    assert.equal(unequal(2, 3), true);
    assert.equal(unequal(2, 2), false);
    assert.equal(unequal(0, 0), false);
    assert.equal(unequal(-2, 2), true);
  });

  it('should compare two complex numbers correctly', function() {
    assert.equal(unequal(complex(2,3), complex(2,4)), true);
    assert.equal(unequal(complex(2,3), complex(2,3)), false);
    assert.equal(unequal(complex(1,3), complex(2,3)), true);
    assert.equal(unequal(complex(1,3), complex(2,4)), true);
    assert.equal(unequal(complex(2,0), 2), false);
    assert.equal(unequal(complex(2,1), 2), true);
    assert.equal(unequal(2, complex(2, 0)), false);
    assert.equal(unequal(2, complex(2, 1)), true);
    assert.equal(unequal(complex(2,0), 3), true);
  });

  it('should compare two quantitites of the same unit correctly', function() {
    assert.equal(unequal(unit('100cm'), unit('10inch')), true);
    assert.equal(unequal(unit('100cm'), unit('1m')), false);
    //assert.equal(unequal(unit('12inch'), unit('1foot')), false); // round-off error :(
    //assert.equal(unequal(unit('2.54cm'), unit('1inch')), false); // round-off error :(
  });

  it('should throw an error when compating two different units', function() {
    assert.throws(function () {unequal(unit('100cm'), 22)});
  });

  it('should compare two strings correctly', function() {
    assert.equal(unequal('0', 0), false);
    assert.equal(unequal('Hello', 'hello'), true);
    assert.equal(unequal('hello', 'hello'), false);
  });

  it('should perform element-wise comparison of two matrices of the same size', function() {
    assert.deepEqual(unequal([1,4,5], [3,4,5]), [true, false, false]);
    assert.deepEqual(unequal([1,4,5], matrix([3,4,5])), matrix([true, false, false]));
  });

  it('should throw an error when comparing two matrices of different sizes', function() {
    assert.throws(function () {unequal([1,4,5], [3,4])});
  });

});
