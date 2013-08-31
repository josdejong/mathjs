// test smaller
var assert = require('assert'),
    math = require('../../../index.js'),
    complex = math.complex,
    matrix = math.matrix,
    unit = math.unit,
    smallereq = math.smallereq;

describe('smallereq', function() {

  it('should compare two numbers correctly', function() {
    assert.equal(smallereq(2, 3), true);
    assert.equal(smallereq(2, 2), true);
    assert.equal(smallereq(2, 1), false);
    assert.equal(smallereq(0, 0), true);
    assert.equal(smallereq(-2, 2), true);
    assert.equal(smallereq(-2, -3), false);
    assert.equal(smallereq(-2, -2), true);
    assert.equal(smallereq(-3, -2), true);
  });

  it('should compare two complex numbers correctly', function() {
    assert.equal(smallereq(complex(1,1), complex(1,2)), true);
    assert.equal(smallereq(complex(1,1), complex(1,1)), true);
    assert.equal(smallereq(complex(2,4), complex(4,2)), true);
    assert.equal(smallereq(complex(1,1), complex(2,1)), true);
    assert.equal(smallereq(complex(1,6), complex(7,1)), true);
    assert.equal(smallereq(complex(4,1), complex(2,2)), false);
    assert.equal(smallereq(complex(2,0), 3), true);
    assert.equal(smallereq(complex(2,0), 2), true);
    assert.equal(smallereq(complex(2,0), 1), false);
    assert.equal(smallereq(3, complex(2,0)), false);
    assert.equal(smallereq(2, complex(2,0)), true);
    assert.equal(smallereq(1, complex(2,0)), true);
  });

  it('should compare two measures of the same unit correctly', function() {
    assert.equal(smallereq(unit('100cm'), unit('10inch')), false);
    assert.equal(smallereq(unit('99cm'), unit('1m')), true);
    //assert.equal(smallereq(unit('100cm'), unit('1m')), true); // dangerous, round-off errors
    assert.equal(smallereq(unit('101cm'), unit('1m')), false);
  });

  it('should throw an error if comparing a unit with a number', function() {
    assert.throws(function () {smallereq(unit('100cm'), 22)});
  });

  it('should perform lexical comprison of two strings', function() {
    assert.equal(smallereq('0', 0), true);
    assert.equal(smallereq('abd', 'abc'), false);
    assert.equal(smallereq('abc', 'abc'), true);
    assert.equal(smallereq('abc', 'abd'), true);
  });

  it('should perform element-wise comparison on two matrices', function() {
    assert.deepEqual(smallereq([1,4,6], [3,4,5]), [true, true, false]);
    assert.deepEqual(smallereq([1,4,6], matrix([3,4,5])), matrix([true, true, false]));
  });

  it('should throw an error with two matrices of different sizes', function () {
    assert.throws(function () {smallereq([1,4,6], [3,4])});
  });

});