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
    assert.strictEqual(not(1), false);
    assert.strictEqual(not(-1), false);
    assert.strictEqual(not(1.23e+100), false);
    assert.strictEqual(not(-1.0e-100), false);
    assert.strictEqual(not(1.0e-100), false);
    assert.strictEqual(not(Infinity), false);
    assert.strictEqual(not(-Infinity), false);
    assert.strictEqual(not(0), true);
    assert.strictEqual(not(NaN), true);
  });

  it('should not complex numbers', function () {
    assert.strictEqual(not(complex(1, 1)), false);
    assert.strictEqual(not(complex(0, 1)), false);
    assert.strictEqual(not(complex(1, 0)), false);
    assert.strictEqual(not(complex(0, 0)), true);
    assert.strictEqual(not(complex()), true);
    assert.strictEqual(not(complex(0)), true);
    assert.strictEqual(not(complex(1)), false);
  });

  it('should not booleans', function () {
    assert.strictEqual(not(true), false);
    assert.strictEqual(not(false), true);
  });

  it('should not null', function () {
    assert.strictEqual(not(null), true);
  });

  it('should not bignumbers', function () {
    assert.strictEqual(not(bignumber(1)), false);
    assert.strictEqual(not(bignumber(-1)), false);
    assert.strictEqual(not(bignumber(0)), true);
    assert.strictEqual(not(bignumber(NaN)), true);
    assert.strictEqual(not(bignumber('1e+10')), false);
    assert.strictEqual(not(bignumber('-1.0e-100')), false);
    assert.strictEqual(not(bignumber('1.0e-100')), false);
    assert.strictEqual(not(bignumber(Infinity)), false);
    assert.strictEqual(not(bignumber(-Infinity)), false);
  });

  it('should not units', function () {
    assert.strictEqual(not(unit('100cm')), false);
    assert.strictEqual(not(unit('0 inch')), true);
    assert.strictEqual(not(unit('1m')), false);
    assert.strictEqual(not(unit('m')), true);
    assert.strictEqual(not(unit('-10inch')), false);
  });

  it('should not arrays', function () {
    assert.deepEqual(not([0, 10]), [true, false]);
    assert.deepEqual(not([]), []);
  });

  it('should not matrices', function () {
    assert.deepEqual(not(matrix([0, 10])), matrix([true, false]));
    assert.deepEqual(not(matrix([])), matrix([]));
  });

  it('should throw an error in case of invalid number of arguments', function () {
    assert.throws(function () {not()}, error.ArgumentsError);
    assert.throws(function () {not(1, 2)}, error.ArgumentsError);
  });

  it('should throw an error in case of invalid type if arguments', function () {
    assert.throws(function () {not(new Date())}, error.UnsupportedTypeError);
    assert.throws(function () {not('23')}, error.UnsupportedTypeError);
    assert.throws(function () {not({})}, error.UnsupportedTypeError);
  });

});
