// test or
var assert = require('assert'),
    math = require('../../../index'),
    error = require('../../../lib/error/index'),
    bignumber = math.bignumber,
    complex = math.complex,
    matrix = math.matrix,
    unit = math.unit,
    or = math.or;

describe('or', function () {

  it('should or two numbers correctly', function () {
    assert.equal(or(1, 1), true);
    assert.equal(or(-1, 1), true);
    assert.equal(or(-1, -1), true);
    assert.equal(or(0, -1), true);
    assert.equal(or(1, 0), true);
    assert.equal(or(1, NaN), true);
    assert.equal(or(NaN, 1), true);
    assert.equal(or(1e10, 0.019209), true);
    assert.equal(or(-1.0e-100, 1.0e-100), true);
    assert.equal(or(Infinity, -Infinity), true);
    assert.equal(or(NaN, NaN), false);
    assert.equal(or(NaN, 0), false);
    assert.equal(or(0, NaN), false);
    assert.equal(or(0, 0), false);
  });

  it('should or two complex numbers', function () {
    assert.equal(or(complex(1, 1), complex(1, 1)), true);
    assert.equal(or(complex(0, 1), complex(1, 1)), true);
    assert.equal(or(complex(1, 0), complex(1, 1)), true);
    assert.equal(or(complex(1, 1), complex(0, 1)), true);
    assert.equal(or(complex(1, 1), complex(1, 0)), true);
    assert.equal(or(complex(1, 0), complex(1, 0)), true);
    assert.equal(or(complex(0, 1), complex(0, 1)), true);
    assert.equal(or(complex(0, 0), complex(1, 1)), true);
    assert.equal(or(complex(0, 0), complex(0, 1)), true);
    assert.equal(or(complex(0, 0), complex(1, 0)), true);
    assert.equal(or(complex(1, 1), complex(0, 0)), true);
    assert.equal(or(complex(0, 1), complex(0, 0)), true);
    assert.equal(or(complex(1, 0), complex(0, 0)), true);
    assert.equal(or(complex(), complex(1, 1)), true);
    assert.equal(or(complex(0), complex(1, 1)), true);
    assert.equal(or(complex(1), complex(1, 1)), true);
    assert.equal(or(complex(1, 1), complex()), true);
    assert.equal(or(complex(1, 1), complex(0)), true);
    assert.equal(or(complex(1, 1), complex(1)), true);
    assert.equal(or(complex(0, 0), complex(0, 0)), false);
    assert.equal(or(complex(), complex()), false);
  });

  it('should or mixed numbers and complex numbers', function () {
    assert.equal(or(complex(1, 1), 1), true);
    assert.equal(or(complex(1, 1), 0), true);
    assert.equal(or(1, complex(1, 1)), true);
    assert.equal(or(0, complex(1, 1)), true);
    assert.equal(or(complex(0, 0), 1), true);
    assert.equal(or(1, complex(0, 0)), true);
    assert.equal(or(0, complex(0, 0)), false);
    assert.equal(or(complex(0, 0), 0), false);
  });

  it('should or two booleans', function () {
    assert.equal(or(true, true), true);
    assert.equal(or(true, false), true);
    assert.equal(or(false, true), true);
    assert.equal(or(false, false), false);
  });

  it('should or mixed numbers and booleans', function () {
    assert.equal(or(2, true), true);
    assert.equal(or(2, false), true);
    assert.equal(or(0, true), true);
    assert.equal(or(0, false), false);
    assert.equal(or(true, 2), true);
    assert.equal(or(false, 2), true);
    assert.equal(or(false, 0), false);
  });

  it('should or mixed numbers and null', function () {
    assert.equal(or(2, null), true);
    assert.equal(or(null, 2), true);
    assert.equal(or(null, null), false);
  });

  it('should or mixed numbers and undefined', function () {
    assert.equal(or(2, undefined), true);
    assert.equal(or(undefined, 2), true);
    assert.equal(or(undefined, undefined), false);
  });

  it('should or bignumbers', function () {
    assert.equal(or(bignumber(1), bignumber(1)), true);
    assert.equal(or(bignumber(-1), bignumber(1)), true);
    assert.equal(or(bignumber(-1), bignumber(-1)), true);
    assert.equal(or(bignumber(0), bignumber(-1)), true);
    assert.equal(or(bignumber(1), bignumber(0)), true);
    assert.equal(or(bignumber(1), bignumber(NaN)), true);
    assert.equal(or(bignumber(NaN), bignumber(1)), true);
    assert.equal(or(bignumber('1e+10'), bignumber(0.19209)), true);
    assert.equal(or(bignumber('-1.0e-100'), bignumber('1.0e-100')), true);
    assert.equal(or(bignumber(Infinity), bignumber(-Infinity)), true);
    assert.equal(or(bignumber(NaN), bignumber(NaN)), false);
    assert.equal(or(bignumber(NaN), bignumber(0)), false);
    assert.equal(or(bignumber(0), bignumber(NaN)), false);
    assert.equal(or(bignumber(0), bignumber(0)), false);
  });

  it('should or mixed numbers and bignumbers', function () {
    assert.equal(or(bignumber(2), 3), true);
    assert.equal(or(2, bignumber(2)), true);
    assert.equal(or(0, bignumber(2)), true);
    assert.equal(or(2, bignumber(0)), true);
    assert.equal(or(bignumber(0), 2), true);
    assert.equal(or(bignumber(0), 0), false);
    assert.equal(or(bignumber(2), 0), true);
    assert.equal(or(bignumber(0), 0), false);
  });

  it('should or two units', function () {
    assert.equal(or(unit('100cm'), unit('10inch')), true);
    assert.equal(or(unit('100cm'), unit('0 inch')), true);
    assert.equal(or(unit('0cm'), unit('1m')), true);
    assert.equal(or(unit('m'), unit('1m')), true);
    assert.equal(or(unit('1dm'), unit('m')), true);
    assert.equal(or(unit('dm'), unit('m')), false);
    assert.equal(or(unit('-100cm'), unit('-10inch')), true);
    assert.equal(or(unit(5, 'km'), unit(100, 'gram')), true);
    assert.equal(or(unit(5, 'km'), unit(0, 'gram')), true);
    assert.equal(or(unit(0, 'km'), unit(100, 'gram')), true);
    assert.equal(or(unit(0, 'km'), unit(0, 'gram')), false);
  });

  it('should or mixed numbers and units', function () {
    assert.equal(or(2, unit('3m')), true);
    assert.equal(or(0, unit('2m')), true);
    assert.equal(or(2, unit('0m')), true);
    assert.equal(or(0, unit('0m')), false);
    assert.equal(or(unit('0in'), 2), true);
    assert.equal(or(unit('2in'), 0), true);
    assert.equal(or(unit('0in'), 0), false);
  });

  it('should or two strings', function () {
    assert.equal(or('0', 'NaN'), true);

    assert.equal(or('abd', ' '), true);
    assert.equal(or('abc', ''), true);
    assert.equal(or('', 'abd'), true);
    assert.equal(or('', ''), false);
    assert.equal(or(' ', ''), true);
  });

  it('should or mixed numbers and strings', function () {
    assert.equal(or(1, 'NaN'), true);
    assert.equal(or('abd', 1), true);
    assert.equal(or(1, ''), true);
    assert.equal(or(0, ''), false);
    assert.equal(or('', 1), true);
    assert.equal(or('', 0), false);
  });

  it('should or two arrays', function () {
    assert.deepEqual(or([0, 1, 0, 12], [0, 0, 1, 22]), [false, true, true, true]);
    assert.deepEqual(or([], []), []);
  });

  it('should or mixed numbers and arrays', function () {
    assert.deepEqual(or(10, [0, 2]), [true, true]);
    assert.deepEqual(or([0, 2], 10), [true, true]);
    assert.deepEqual(or(0, [0, 2]), [false, true]);
    assert.deepEqual(or([0, 2], 0), [false, true]);
  });

  it('should or two matrices', function () {
    assert.deepEqual(or(matrix([0, 1, 0, 12]), matrix([0, 0, 1, 22])), matrix([false, true, true, true]));
    assert.deepEqual(or(matrix([]), matrix([])), matrix([]));
  });

  it('should or mixed numbers and matrices', function () {
    assert.deepEqual(or(10, matrix([0, 2])), matrix([true, true]));
    assert.deepEqual(or(matrix([0, 2]), 10), matrix([true, true]));
    assert.deepEqual(or(0, matrix([0, 2])), matrix([false, true]));
    assert.deepEqual(or(matrix([0, 2]), 0), matrix([false, true]));
  });

  it('should or two objects', function () {
    assert.equal(or(new Date(), new Date()), true);
  });

  it('should throw an error in case of invalid number of arguments', function () {
    assert.throws(function () {or(1)}, error.ArgumentsError);
    assert.throws(function () {or(1, 2, 3)}, error.ArgumentsError);
  });

});
