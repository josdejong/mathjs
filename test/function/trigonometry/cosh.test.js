var assert = require('assert'),
    error = require('../../../lib/error/index'),
    math = require('../../../index'),
    approx = require('../../../tools/approx'),
    pi = math.pi,
    complex = math.complex,
    matrix = math.matrix,
    unit = math.unit,
    cosh = math.cosh,
    bigmath = math.create({number: 'bignumber', precision: 20});

describe('cosh', function() {
  it('should return the cosh of a boolean', function () {
    approx.equal(cosh(true), 1.5430806348152);
    approx.equal(cosh(false), 1);
  });

  it('should return the cosh of null', function () {
    approx.equal(cosh(null), 1);
  });

  it('should return the cosh of a number', function() {
    approx.equal(cosh(0), 1);
    approx.equal(cosh(pi), 11.591953275522);
    approx.equal(cosh(1), 1.5430806348152);
    approx.equal(cosh(2), 3.7621956910836);
    approx.equal(cosh(3), 10.067661995778);
  });

  it('should return the cosh of a bignumber', function() {
    var coshBig = bigmath.cosh;
    var Big = bigmath.bignumber;
    var bigInfinity = Big(Infinity);

    var arg1 = Big(-3);
    var arg9 = Big(Infinity);
    var arg10 = Big(-Infinity);
    assert.deepEqual(coshBig(arg1), Big('10.067661995777765842'));
    assert.deepEqual(coshBig(Big(-2)), Big('3.7621956910836314596'));
    assert.deepEqual(coshBig(Big(-1)), Big('1.5430806348152437785'));
    assert.deepEqual(coshBig(Big(0)), Big(1));
    assert.deepEqual(coshBig(Big(1)), Big('1.5430806348152437785'));
    assert.deepEqual(coshBig(Big(2)), Big('3.7621956910836314596'));
    assert.deepEqual(coshBig(Big(3)), Big('10.067661995777765842'));
    assert.deepEqual(coshBig(bigmath.pi).toString(), '11.591953275521520628');
    assert.deepEqual(coshBig(arg9), bigInfinity);
    assert.deepEqual(coshBig(arg10), bigInfinity);

    // Ensure args were not changed
    assert.deepEqual(arg1, Big(-3));
    assert.deepEqual(arg9, bigInfinity);
    assert.deepEqual(arg10, Big(-Infinity));
  });

  it('should return the cosh of a complex number', function() {
    approx.deepEqual(cosh(complex('1')), complex(1.5430806348152, 0));
    approx.deepEqual(cosh(complex('i')), complex(0.54030230586814, 0));
    approx.deepEqual(cosh(complex('2 + i')), complex(2.0327230070197, 3.0518977991518));
  });

  it('should return the cosh of an angle', function() {
    approx.equal(cosh(unit('90deg')), 2.5091784786581);
    approx.equal(cosh(unit('-45deg')), 1.324609089252);
  });

  it('should throw an error if called with an invalid unit', function() {
    assert.throws(function () {cosh(unit('5 celsius'))});
  });

  it('should throw an error if called with a string', function() {
    assert.throws(function () {cosh('string')});
  });

  var cosh123 = [1.5430806348152, 3.7621956910836, 10.067661995778];

  it('should return the cosh of each element of an array', function() {
    approx.deepEqual(cosh([1,2,3]), cosh123);
  });

  it('should return the cosh of each element of a matrix', function() {
    approx.deepEqual(cosh(matrix([1,2,3])), matrix(cosh123));
  });

  it('should throw an error in case of invalid number of arguments', function() {
    assert.throws(function () {cosh()}, error.ArgumentsError);
    assert.throws(function () {cosh(1, 2)}, error.ArgumentsError);
  });
});
