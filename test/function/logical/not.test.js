// test not
var assert = require('assert'),
    math = require('../../../index'),
    error = require('../../../lib/error/index'),
    bignumber = math.bignumber,
    complex = math.complex,
    matrix = math.matrix,
    unit = math.unit,
    not = math.not;

describe('not', function () {

  it('should not numbers correctly', function () {
    assert.equal(not(1), false);
    assert.equal(not(-1), false);
    assert.equal(not(1.23e+100), false);
    assert.equal(not(-1.0e-100), false);
    assert.equal(not(1.0e-100), false);
    assert.equal(not(Infinity), false);
    assert.equal(not(-Infinity), false);
    assert.equal(not(0), true);
    assert.equal(not(NaN), true);
  });

  it('should not complex numbers', function () {
    assert.equal(not(complex(1, 1)), false);
    assert.equal(not(complex(0, 1)), false);
    assert.equal(not(complex(1, 0)), false);
    assert.equal(not(complex(0, 0)), true);
    assert.equal(not(complex()), true);
    assert.equal(not(complex(0)), true);
    assert.equal(not(complex(1)), false);
  });

  it('should not booleans', function () {
    assert.equal(not(true), false);
    assert.equal(not(false), true);
  });

  it('should not null/undefined values', function () {
    assert.equal(not(null), true);
    assert.equal(not(undefined), true);
  });

  it('should not bignumbers', function () {
    assert.equal(not(bignumber(1)), false);
    assert.equal(not(bignumber(-1)), false);
    assert.equal(not(bignumber(0)), true);
    assert.equal(not(bignumber(NaN)), true);
    assert.equal(not(bignumber('1e+10')), false);
    assert.equal(not(bignumber('-1.0e-100')), false);
    assert.equal(not(bignumber('1.0e-100')), false);
    assert.equal(not(bignumber(Infinity)), false);
    assert.equal(not(bignumber(-Infinity)), false);
  });

  it('should not units', function () {
    assert.equal(not(unit('100cm')), false);
    assert.equal(not(unit('0 inch')), true);
    assert.equal(not(unit('1m')), false);
    assert.equal(not(unit('m')), true);
    assert.equal(not(unit('-10inch')), false);
  });

  it('should not strings', function () {
    assert.equal(not('0'), false);
    assert.equal(not('NaN'), false);

    assert.equal(not('abd'), false);
    assert.equal(not(''), true);
    assert.equal(not('\0'), false);
    assert.equal(not(' '), false);
  });

  it('should not arrays', function () {
    assert.deepEqual(not([0, 10]), [true, false]);
    assert.deepEqual(not([]), []);
  });

  it('should not matrices', function () {
    assert.deepEqual(not(matrix([0, 10])), matrix([true, false]));
    assert.deepEqual(not(matrix([])), matrix([]));
  });

  it('should not object', function () {
    assert.equal(not(new Date()), false);
  });

  it('should throw an error in case of invalid number of arguments', function () {
    assert.throws(function () {not()}, error.ArgumentsError);
    assert.throws(function () {not(1, 2)}, error.ArgumentsError);
  });

});
