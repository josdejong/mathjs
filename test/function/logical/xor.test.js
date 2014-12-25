// test xor
var assert = require('assert'),
    math = require('../../../index'),
    error = require('../../../lib/error/index'),
    bignumber = math.bignumber,
    complex = math.complex,
    matrix = math.matrix,
    unit = math.unit,
    xor = math.xor;

describe('xor', function () {

  it('should xor two numbers correctly', function () {
    assert.equal(xor(1, 1), false);
    assert.equal(xor(-1, 1), false);
    assert.equal(xor(-1, -1), false);
    assert.equal(xor(0, -1), true);
    assert.equal(xor(1, 0), true);
    assert.equal(xor(1, NaN), true);
    assert.equal(xor(NaN, 1), true);
    assert.equal(xor(1e10, 0.019209), false);
    assert.equal(xor(-1.0e-100, 1.0e-100), false);
    assert.equal(xor(Infinity, -Infinity), false);
    assert.equal(xor(NaN, NaN), false);
    assert.equal(xor(NaN, 0), false);
    assert.equal(xor(0, NaN), false);
    assert.equal(xor(0, 0), false);
  });

  it('should xor two complex numbers', function () {
    assert.equal(xor(complex(1, 1), complex(1, 1)), false);
    assert.equal(xor(complex(0, 1), complex(1, 1)), false);
    assert.equal(xor(complex(1, 0), complex(1, 1)), false);
    assert.equal(xor(complex(1, 1), complex(0, 1)), false);
    assert.equal(xor(complex(1, 1), complex(1, 0)), false);
    assert.equal(xor(complex(1, 0), complex(1, 0)), false);
    assert.equal(xor(complex(0, 1), complex(0, 1)), false);
    assert.equal(xor(complex(0, 0), complex(1, 1)), true);
    assert.equal(xor(complex(0, 0), complex(0, 1)), true);
    assert.equal(xor(complex(0, 0), complex(1, 0)), true);
    assert.equal(xor(complex(1, 1), complex(0, 0)), true);
    assert.equal(xor(complex(0, 1), complex(0, 0)), true);
    assert.equal(xor(complex(1, 0), complex(0, 0)), true);
    assert.equal(xor(complex(), complex(1, 1)), true);
    assert.equal(xor(complex(0), complex(1, 1)), true);
    assert.equal(xor(complex(1), complex(1, 1)), false);
    assert.equal(xor(complex(1, 1), complex()), true);
    assert.equal(xor(complex(1, 1), complex(0)), true);
    assert.equal(xor(complex(1, 1), complex(1)), false);
    assert.equal(xor(complex(0, 0), complex(0, 0)), false);
    assert.equal(xor(complex(), complex()), false);
  });

  it('should xor mixed numbers and complex numbers', function () {
    assert.equal(xor(complex(1, 1), 1), false);
    assert.equal(xor(complex(1, 1), 0), true);
    assert.equal(xor(1, complex(1, 1)), false);
    assert.equal(xor(0, complex(1, 1)), true);
    assert.equal(xor(complex(0, 0), 1), true);
    assert.equal(xor(1, complex(0, 0)), true);
    assert.equal(xor(0, complex(0, 0)), false);
    assert.equal(xor(complex(0, 0), 0), false);
  });

  it('should xor two booleans', function () {
    assert.equal(xor(true, true), false);
    assert.equal(xor(true, false), true);
    assert.equal(xor(false, true), true);
    assert.equal(xor(false, false), false);
  });

  it('should xor mixed numbers and booleans', function () {
    assert.equal(xor(2, true), false);
    assert.equal(xor(2, false), true);
    assert.equal(xor(0, true), true);
    assert.equal(xor(true, 2), false);
    assert.equal(xor(false, 2), true);
    assert.equal(xor(false, 0), false);
  });

  it('should xor mixed numbers and null', function () {
    assert.equal(xor(2, null), true);
    assert.equal(xor(null, 2), true);
  });

  it('should xor bignumbers', function () {
    assert.equal(xor(bignumber(1), bignumber(1)), false);
    assert.equal(xor(bignumber(-1), bignumber(1)), false);
    assert.equal(xor(bignumber(-1), bignumber(-1)), false);
    assert.equal(xor(bignumber(0), bignumber(-1)), true);
    assert.equal(xor(bignumber(1), bignumber(0)), true);
    assert.equal(xor(bignumber(1), bignumber(NaN)), true);
    assert.equal(xor(bignumber(NaN), bignumber(1)), true);
    assert.equal(xor(bignumber('1e+10'), bignumber(0.19209)), false);
    assert.equal(xor(bignumber('-1.0e-400'), bignumber('1.0e-400')), false);
    assert.equal(xor(bignumber(Infinity), bignumber(-Infinity)), false);
    assert.equal(xor(bignumber(NaN), bignumber(NaN)), false);
    assert.equal(xor(bignumber(NaN), bignumber(0)), false);
    assert.equal(xor(bignumber(0), bignumber(NaN)), false);
    assert.equal(xor(bignumber(0), bignumber(0)), false);
  });

  it('should xor mixed numbers and bignumbers', function () {
    assert.equal(xor(bignumber(2), 3), false);
    assert.equal(xor(2, bignumber(2)), false);
    assert.equal(xor(0, bignumber(2)), true);
    assert.equal(xor(2, bignumber(0)), true);
    assert.equal(xor(bignumber(0), 2), true);
    assert.equal(xor(bignumber(2), 0), true);
    assert.equal(xor(bignumber(0), 0), false);
  });

  it('should xor two units', function () {
    assert.equal(xor(unit('100cm'), unit('10inch')), false);
    assert.equal(xor(unit('100cm'), unit('0 inch')), true);
    assert.equal(xor(unit('0cm'), unit('1m')), true);
    assert.equal(xor(unit('m'), unit('1m')), true);
    assert.equal(xor(unit('1dm'), unit('m')), true);
    assert.equal(xor(unit('-100cm'), unit('-10inch')), false);
    assert.equal(xor(unit(5, 'km'), unit(100, 'gram')), false);
    assert.equal(xor(unit(5, 'km'), unit(0, 'gram')), true);
    assert.equal(xor(unit(0, 'km'), unit(100, 'gram')), true);
    assert.equal(xor(unit(0, 'km'), unit(0, 'gram')), false);
  });

  it('should xor mixed numbers and units', function () {
    assert.equal(xor(unit('2m'), 3), false);
    assert.equal(xor(2, unit('3m')), false);
    assert.equal(xor(0, unit('2m')), true);
    assert.equal(xor(2, unit('0m')), true);
    assert.equal(xor(unit('0in'), 2), true);
    assert.equal(xor(unit('2in'), 0), true);
    assert.equal(xor(unit('0in'), 0), false);
  });

  it('should xor two arrays', function () {
    assert.deepEqual(xor([0, 1, 0, 12], [0, 0, 1, 22]), [false, true, true, false]);
    assert.deepEqual(xor([], []), []);
  });

  it('should xor mixed numbers and arrays', function () {
    assert.deepEqual(xor(10, [0, 2]), [true, false]);
    assert.deepEqual(xor([0, 2], 10), [true, false]);
    assert.deepEqual(xor(0, [0, 2]), [false, true]);
    assert.deepEqual(xor([0, 2], 0), [false, true]);
  });

  it('should xor two matrices', function () {
    assert.deepEqual(xor(matrix([0, 1, 0, 12]), matrix([0, 0, 1, 22])), matrix([false, true, true, false]));
    assert.deepEqual(xor(matrix([]), matrix([])), matrix([]));
  });

  it('should xor mixed numbers and matrices', function () {
    assert.deepEqual(xor(10, matrix([0, 2])), matrix([true, false]));
    assert.deepEqual(xor(matrix([0, 2]), 10), matrix([true, false]));
    assert.deepEqual(xor(0, matrix([0, 2])), matrix([false, true]));
    assert.deepEqual(xor(matrix([0, 2]), 0), matrix([false, true]));
  });

  it('should throw an error in case of invalid type if arguments', function () {
    assert.throws(function () {xor(new Date(), new Date())}, TypeError);
    assert.throws(function () {xor(2, '23')}, TypeError);
    assert.throws(function () {xor(2, undefined)}, TypeError);
  });

  it('should throw an error in case of invalid number of arguments', function () {
    assert.throws(function () {xor(1)}, error.ArgumentsError);
    assert.throws(function () {xor(1, 2, 3)}, error.ArgumentsError);
  });

});
