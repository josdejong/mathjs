// test and
var assert = require('assert'),
    math = require('../../../index'),
    error = require('../../../lib/error/index'),
    bignumber = math.bignumber,
    complex = math.complex,
    matrix = math.matrix,
    unit = math.unit,
    and = math.and;

describe('and', function () {

  it('should and two numbers correctly', function () {
    assert.equal(and(1, 1), true);
    assert.equal(and(-1, 1), true);
    assert.equal(and(-1, -1), true);
    assert.equal(and(0, -1), false);
    assert.equal(and(1, 0), false);
    assert.equal(and(1, NaN), false);
    assert.equal(and(NaN, 1), false);
    assert.equal(and(1e10, 0.019209), true);
    assert.equal(and(-1.0e-100, 1.0e-100), true);
    assert.equal(and(Infinity, -Infinity), true);
  });

  it('should and two complex numbers', function () {
    assert.equal(and(complex(1, 1), complex(1, 1)), true);
    assert.equal(and(complex(0, 1), complex(1, 1)), true);
    assert.equal(and(complex(1, 0), complex(1, 1)), true);
    assert.equal(and(complex(1, 1), complex(0, 1)), true);
    assert.equal(and(complex(1, 1), complex(1, 0)), true);
    assert.equal(and(complex(1, 0), complex(1, 0)), true);
    assert.equal(and(complex(0, 1), complex(0, 1)), true);
    assert.equal(and(complex(0, 0), complex(1, 1)), false);
    assert.equal(and(complex(0, 0), complex(0, 1)), false);
    assert.equal(and(complex(0, 0), complex(1, 0)), false);
    assert.equal(and(complex(1, 1), complex(0, 0)), false);
    assert.equal(and(complex(0, 1), complex(0, 0)), false);
    assert.equal(and(complex(1, 0), complex(0, 0)), false);
    assert.equal(and(complex(), complex(1, 1)), false);
    assert.equal(and(complex(0), complex(1, 1)), false);
    assert.equal(and(complex(1), complex(1, 1)), true);
    assert.equal(and(complex(1, 1), complex()), false);
    assert.equal(and(complex(1, 1), complex(0)), false);
    assert.equal(and(complex(1, 1), complex(1)), true);
  });

  it('should and mixed numbers and complex numbers', function () {
    assert.equal(and(complex(1, 1), 1), true);
    assert.equal(and(complex(1, 1), 0), false);
    assert.equal(and(1, complex(1, 1)), true);
    assert.equal(and(0, complex(1, 1)), false);
    assert.equal(and(complex(0, 0), 1), false);
    assert.equal(and(1, complex(0, 0)), false);
  });

  it('should and two booleans', function () {
    assert.equal(and(true, true), true);
    assert.equal(and(true, false), false);
    assert.equal(and(false, true), false);
    assert.equal(and(false, false), false);
  });

  it('should and mixed numbers and booleans', function () {
    assert.equal(and(2, true), true);
    assert.equal(and(2, false), false);
    assert.equal(and(0, true), false);
    assert.equal(and(true, 2), true);
    assert.equal(and(false, 2), false);
  });

  it('should and mixed numbers and null', function () {
    assert.equal(and(2, null), false);
    assert.equal(and(null, 2), false);
  });

  it('should and mixed numbers and undefined', function () {
    assert.equal(and(2, undefined), false);
    assert.equal(and(undefined, 2), false);
  });

  it('should and bignumbers', function () {
    assert.equal(and(bignumber(1), bignumber(1)), true);
    assert.equal(and(bignumber(-1), bignumber(1)), true);
    assert.equal(and(bignumber(-1), bignumber(-1)), true);
    assert.equal(and(bignumber(0), bignumber(-1)), false);
    assert.equal(and(bignumber(1), bignumber(0)), false);
    assert.equal(and(bignumber(1), bignumber(NaN)), false);
    assert.equal(and(bignumber(NaN), bignumber(1)), false);
    assert.equal(and(bignumber('1e+10'), bignumber(0.19209)), true);
    assert.equal(and(bignumber('-1.0e-100'), bignumber('1.0e-100')), true);
    assert.equal(and(bignumber(Infinity), bignumber(-Infinity)), true);
  });

  it('should and mixed numbers and bignumbers', function () {
    assert.equal(and(bignumber(2), 3), true);
    assert.equal(and(2, bignumber(2)), true);
    assert.equal(and(0, bignumber(2)), false);
    assert.equal(and(2, bignumber(0)), false);
    assert.equal(and(bignumber(0), 2), false);
    assert.equal(and(bignumber(2), 0), false);
  });

  it('should and two units', function () {
    assert.equal(and(unit('100cm'), unit('10inch')), true);
    assert.equal(and(unit('100cm'), unit('0 inch')), false);
    assert.equal(and(unit('0cm'), unit('1m')), false);
    assert.equal(and(unit('m'), unit('1m')), false);
    assert.equal(and(unit('1dm'), unit('m')), false);
    assert.equal(and(unit('-100cm'), unit('-10inch')), true);
    assert.equal(and(unit(5, 'km'), unit(100, 'gram')), true);
    assert.equal(and(unit(5, 'km'), unit(0, 'gram')), false);
    assert.equal(and(unit(0, 'km'), unit(100, 'gram')), false);
  });

  it('should and mixed numbers and units', function () {
    assert.equal(and(unit('2m'), 3), true);
    assert.equal(and(2, unit('3m')), true);
    assert.equal(and(0, unit('2m')), false);
    assert.equal(and(2, unit('0m')), false);
    assert.equal(and(unit('0in'), 2), false);
    assert.equal(and(unit('2in'), 0), false);
  });

  it('should and two strings', function () {
    assert.equal(and('0', 'NaN'), true);

    assert.equal(and('abd', ' '), true);
    assert.equal(and('abc', ''), false);
    assert.equal(and('', 'abd'), false);
    assert.equal(and('', ''), false);
  });

  it('should and mixed numbers and strings', function () {
    assert.equal(and(1, 'NaN'), true);
    assert.equal(and('abd', 1), true);
    assert.equal(and(1, ''), false);
    assert.equal(and('', 1), false);
  });

  it('should and two arrays', function () {
    assert.equal(and([0], [0, 0, 0]), true);
    assert.equal(and([], [0, 0, 0]), false);
    assert.equal(and(['A', 'B', 'C'], []), false);
    assert.equal(and([], []), false);
    assert.equal(and([[]], [[]]), true);
    assert.equal(and([[[]]], [[]]), true);
  });

  it('should and mixed numbers and arrays', function () {
    assert.equal(and(1, [0, 0, 0]), true);
    assert.equal(and([0], 1), true);
    assert.equal(and(0, [0, 0, 0]), false);
    assert.equal(and(['A', 'B', 'C'], 0), false);
    assert.equal(and(1, []), false);
    assert.equal(and([[]], 1), true);
    assert.equal(and([[], []], 1), true);
  });

  it('should and two matrices', function () {
    assert.equal(and(matrix([0]), matrix([0, 0, 0])), true);
    assert.equal(and(matrix([]), matrix([0, 0, 0])), false);
    assert.equal(and(matrix(['A', 'B', 'C']), matrix([])), false);
    assert.equal(and(matrix([]), matrix([])), false);
    assert.equal(and(matrix([]), matrix([[]])), false);
    assert.equal(and(matrix([[]]), matrix([[]])), true);
    assert.equal(and(matrix([[[]]]), matrix([[]])), true);
  });

  it('should and mixed numbers and matrices', function () {
    assert.equal(and(1, matrix([0, 0, 0])), true);
    assert.equal(and(matrix([0]), 1), true);
    assert.equal(and(0, matrix([0, 0, 0])), false);
    assert.equal(and(matrix(['A', 'B', 'C']), 0), false);
    assert.equal(and(1, matrix([])), false);
    assert.equal(and(matrix([]), 1), false);
    assert.equal(and(matrix([[]]), 1), true);
    assert.equal(and(matrix([[], []]), 1), true);
  });

  it('should and two objects', function () {
    assert.equal(and(new Date(), new Date()), true);
  });

  it('should throw an error in case of invalid number of arguments', function () {
    assert.throws(function () {and(1)}, error.ArgumentsError);
    assert.throws(function () {and(1, 2, 3)}, error.ArgumentsError);
  });

});
