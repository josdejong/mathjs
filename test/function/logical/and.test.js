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
    assert.strictEqual(and(1, 1), true);
    assert.strictEqual(and(-1, 1), true);
    assert.strictEqual(and(-1, -1), true);
    assert.strictEqual(and(0, -1), false);
    assert.strictEqual(and(1, 0), false);
    assert.strictEqual(and(1, NaN), false);
    assert.strictEqual(and(NaN, 1), false);
    assert.strictEqual(and(1e10, 0.019209), true);
    assert.strictEqual(and(-1.0e-100, 1.0e-100), true);
    assert.strictEqual(and(Infinity, -Infinity), true);
  });

  it('should and two complex numbers', function () {
    assert.strictEqual(and(complex(1, 1), complex(1, 1)), true);
    assert.strictEqual(and(complex(0, 1), complex(1, 1)), true);
    assert.strictEqual(and(complex(1, 0), complex(1, 1)), true);
    assert.strictEqual(and(complex(1, 1), complex(0, 1)), true);
    assert.strictEqual(and(complex(1, 1), complex(1, 0)), true);
    assert.strictEqual(and(complex(1, 0), complex(1, 0)), true);
    assert.strictEqual(and(complex(0, 1), complex(0, 1)), true);
    assert.strictEqual(and(complex(0, 0), complex(1, 1)), false);
    assert.strictEqual(and(complex(0, 0), complex(0, 1)), false);
    assert.strictEqual(and(complex(0, 0), complex(1, 0)), false);
    assert.strictEqual(and(complex(1, 1), complex(0, 0)), false);
    assert.strictEqual(and(complex(0, 1), complex(0, 0)), false);
    assert.strictEqual(and(complex(1, 0), complex(0, 0)), false);
    assert.strictEqual(and(complex(), complex(1, 1)), false);
    assert.strictEqual(and(complex(0), complex(1, 1)), false);
    assert.strictEqual(and(complex(1), complex(1, 1)), true);
    assert.strictEqual(and(complex(1, 1), complex()), false);
    assert.strictEqual(and(complex(1, 1), complex(0)), false);
    assert.strictEqual(and(complex(1, 1), complex(1)), true);
  });

  it('should and mixed numbers and complex numbers', function () {
    assert.strictEqual(and(complex(1, 1), 1), true);
    assert.strictEqual(and(complex(1, 1), 0), false);
    assert.strictEqual(and(1, complex(1, 1)), true);
    assert.strictEqual(and(0, complex(1, 1)), false);
    assert.strictEqual(and(complex(0, 0), 1), false);
    assert.strictEqual(and(1, complex(0, 0)), false);
  });

  it('should and two booleans', function () {
    assert.strictEqual(and(true, true), true);
    assert.strictEqual(and(true, false), false);
    assert.strictEqual(and(false, true), false);
    assert.strictEqual(and(false, false), false);
  });

  it('should and mixed numbers and booleans', function () {
    assert.strictEqual(and(2, true), true);
    assert.strictEqual(and(2, false), false);
    assert.strictEqual(and(0, true), false);
    assert.strictEqual(and(true, 2), true);
    assert.strictEqual(and(false, 2), false);
  });

  it('should and mixed numbers and null', function () {
    assert.strictEqual(and(2, null), false);
    assert.strictEqual(and(null, 2), false);
  });

  it('should and bignumbers', function () {
    assert.strictEqual(and(bignumber(1), bignumber(1)), true);
    assert.strictEqual(and(bignumber(-1), bignumber(1)), true);
    assert.strictEqual(and(bignumber(-1), bignumber(-1)), true);
    assert.strictEqual(and(bignumber(0), bignumber(-1)), false);
    assert.strictEqual(and(bignumber(1), bignumber(0)), false);
    assert.strictEqual(and(bignumber(1), bignumber(NaN)), false);
    assert.strictEqual(and(bignumber(NaN), bignumber(1)), false);
    assert.strictEqual(and(bignumber('1e+10'), bignumber(0.19209)), true);
    assert.strictEqual(and(bignumber('-1.0e-100'), bignumber('1.0e-100')), true);
    assert.strictEqual(and(bignumber(Infinity), bignumber(-Infinity)), true);
  });

  it('should and mixed numbers and bignumbers', function () {
    assert.strictEqual(and(bignumber(2), 3), true);
    assert.strictEqual(and(2, bignumber(2)), true);
    assert.strictEqual(and(0, bignumber(2)), false);
    assert.strictEqual(and(2, bignumber(0)), false);
    assert.strictEqual(and(bignumber(0), 2), false);
    assert.strictEqual(and(bignumber(2), 0), false);
  });

  it('should and two units', function () {
    assert.strictEqual(and(unit('100cm'), unit('10inch')), true);
    assert.strictEqual(and(unit('100cm'), unit('0 inch')), false);
    assert.strictEqual(and(unit('0cm'), unit('1m')), false);
    assert.strictEqual(and(unit('m'), unit('1m')), false);
    assert.strictEqual(and(unit('1dm'), unit('m')), false);
    assert.strictEqual(and(unit('-100cm'), unit('-10inch')), true);
    assert.strictEqual(and(unit(5, 'km'), unit(100, 'gram')), true);
    assert.strictEqual(and(unit(5, 'km'), unit(0, 'gram')), false);
    assert.strictEqual(and(unit(0, 'km'), unit(100, 'gram')), false);
  });

  it('should and mixed numbers and units', function () {
    assert.strictEqual(and(unit('2m'), 3), true);
    assert.strictEqual(and(2, unit('3m')), true);
    assert.strictEqual(and(0, unit('2m')), false);
    assert.strictEqual(and(2, unit('0m')), false);
    assert.strictEqual(and(unit('0in'), 2), false);
    assert.strictEqual(and(unit('2in'), 0), false);
  });

  it('should and two arrays', function () {
    assert.deepEqual(and([0, 1, 0, 12], [0, 0, 1, 22]), [false, false, false, true]);
    assert.deepEqual(and([], []), []);
  });

  it('should and mixed numbers and arrays', function () {
    assert.deepEqual(and(10, [0, 2]), [false, true]);
    assert.deepEqual(and([0, 2], 10), [false, true]);
  });

  it('should and two matrices', function () {
    assert.deepEqual(and(matrix([0, 1, 0, 12]), matrix([0, 0, 1, 22])), matrix([false, false, false, true]));
    assert.deepEqual(and(matrix([]), matrix([])), matrix([]));
  });

  it('should and mixed numbers and matrices', function () {
    assert.deepEqual(and(10, matrix([0, 2])), matrix([false, true]));
    assert.deepEqual(and(matrix([0, 2]), 10), matrix([false, true]));
  });

  it('should throw an error in case of invalid number of arguments', function () {
    assert.throws(function () {and(1)}, error.ArgumentsError);
    assert.throws(function () {and(1, 2, 3)}, error.ArgumentsError);
  });

  it('should throw an error in case of invalid type of arguments', function () {
    assert.throws(function () {and(new Date(), true)}, error.UnsupportedTypeError);
    assert.throws(function () {and(true, new Date())}, error.UnsupportedTypeError);
    assert.throws(function () {and(true, 'foo')}, error.UnsupportedTypeError);
    assert.throws(function () {and('foo', true)}, error.UnsupportedTypeError);
    assert.throws(function () {and(true, undefined)}, error.UnsupportedTypeError);
    assert.throws(function () {and(undefined, true)}, error.UnsupportedTypeError);
  });

});
