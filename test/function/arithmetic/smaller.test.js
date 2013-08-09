// test smaller
var assert = require('assert'),
    math = require('../../../src/index.js'),
    complex = math.complex,
    matrix = math.matrix,
    unit = math.unit,
    smaller = math.smaller;

describe('smaller', function() {

  it('should be parsed correctly', function() {
    assert.equal(math.eval('2 < 3'), true);
    assert.equal(math.eval('2 < 2'), false);
    assert.equal(math.eval('2 < 1'), false);
    assert.equal(math.eval('smaller(2, 3)'), true);
    assert.equal(math.eval('smaller(2, 2)'), false);
    assert.equal(math.eval('smaller(2, 1)'), false);
  });

  it('should compare two numbers correctly', function() {
    assert.equal(smaller(2, 3), true);
    assert.equal(smaller(2, 2), false);
    assert.equal(smaller(2, 1), false);
    assert.equal(smaller(0, 0), false);
    assert.equal(smaller(-2, 2), true);
    assert.equal(smaller(-2, -3), false);
    assert.equal(smaller(-3, -2), true);
  });

  it('should compare two complex numbers correctly', function() {
    assert.equal(smaller(complex(1,1), complex(1,2)), true);
    assert.equal(smaller(complex(1,1), complex(1,1)), false);
    assert.equal(smaller(complex(1,1), complex(2,1)), true);
    assert.equal(smaller(complex(1,6), complex(7,1)), true);
    assert.equal(smaller(complex(4,1), complex(2,2)), false);
    assert.equal(smaller(complex(2,0), 3), true);
    assert.equal(smaller(complex(2,0), 2), false);
    assert.equal(smaller(complex(2,0), 1), false);
    assert.equal(smaller(3, complex(2,0)), false);
    assert.equal(smaller(2, complex(2,0)), false);
    assert.equal(smaller(1, complex(2,0)), true);
  });

  it('should compare two measures of the same unit correctly', function() {
    assert.equal(smaller(unit('100cm'), unit('10inch')), false);
    assert.equal(smaller(unit('99cm'), unit('1m')), true);
    //assert.equal(smaller(unit('100cm'), unit('1m')), false); // dangerous, round-off errors
    assert.equal(smaller(unit('101cm'), unit('1m')), false);
  });

  it('should throw an error if comparing a unit and a number', function() {
    assert.throws(function () {smaller(unit('100cm'), 22)});
  })

  it('should perform lexical comparison on two strings', function() {
    assert.equal(smaller('0', 0), false);
    assert.equal(smaller('abd', 'abc'), false);
    assert.equal(smaller('abc', 'abc'), false);
    assert.equal(smaller('abc', 'abd'), true);
  });

  it('should perform element-wise comparison on two matrices of same size', function() {
    assert.deepEqual(smaller([1,4,6], [3,4,5]), [true, false, false]);
    assert.deepEqual(smaller([1,4,6], matrix([3,4,5])), matrix([true, false, false]));
  });

  it('should throw an error with two matrices of different sizes', function () {
    assert.throws(function () {smaller([1,4,6], [3,4])});
  });

});
