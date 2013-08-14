// test equal
var assert = require('assert'),
    math = require('../../../index.js'),
    complex = math.complex,
    matrix = math.matrix,
    unit = math.unit,
    equal = math.equal;

describe('equal', function() {

  it('should be parsed correctly', function() {
    assert.equal(math.eval('2 == 3'), false);
    assert.equal(math.eval('2 == 2'), true);
    assert.equal(math.eval('equal(2, 3)'), false);
    assert.equal(math.eval('equal(2, 2)'), true);
  });

  it('should compare two numbers correctly', function() {
    assert.equal(equal(2, 3), false);
    assert.equal(equal(2, 2), true);
    assert.equal(equal(0, 0), true);
    assert.equal(equal(-2, 2), false);
  });

  it('should compare two complex numbers correctly', function() {
    assert.equal(equal(complex(2,3), complex(2,4)), false);
    assert.equal(equal(complex(2,3), complex(2,3)), true);
    assert.equal(equal(complex(1,3), complex(2,3)), false);
    assert.equal(equal(complex(1,3), complex(2,4)), false);
    assert.equal(equal(complex(2,0), 2), true);
    assert.equal(equal(complex(2,1), 2), false);
    assert.equal(equal(2, complex(2, 0)), true);
    assert.equal(equal(2, complex(2, 1)), false);
    assert.equal(equal(complex(2,0), 3), false);
  });

  it('should compare two units correctly', function() {
    assert.equal(equal(unit('100cm'), unit('10inch')), false);
    assert.equal(equal(unit('100cm'), unit('1m')), true);
    //assert.equal(equal(unit('12inch'), unit('1foot')), true); // round-off error :(
    //assert.equal(equal(unit('2.54cm'), unit('1inch')), true); // round-off error :(
  });

  it('should throw an error when comparing a unit with a number', function() {
    assert.throws(function () {equal(unit('100cm'), 22)});
  });

  it('should compare two strings correctly', function() {
    assert.equal(equal('0', 0), true);
    assert.equal(equal('Hello', 'hello'), false);
    assert.equal(equal('hello', 'hello'), true);
  });

  it('should compare two matrices correctly', function() {
    assert.deepEqual(equal([1,4,5], [3,4,5]), [false, true, true]);
    assert.deepEqual(equal([1,4,5], matrix([3,4,5])), matrix([false, true, true]));
  });

  it('should throw an error if matrices have different sizes', function() {
    assert.throws(function () {equal([1,4,5], [3,4])});
  });


});
