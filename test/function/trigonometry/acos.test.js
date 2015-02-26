var assert = require('assert'),
    error = require('../../../lib/error/index'),
    math = require('../../../index'),
    approx = require('../../../tools/approx'),
    pi = math.pi,
    acos = math.acos,
    cos = math.cos,
    complex = math.complex,
    matrix = math.matrix,
    unit = math.unit,
    bigmath = math.create({number: 'bignumber', precision: 20}),
    acosBig = bigmath.acos,
    cosBig = bigmath.cos,
    Big = bigmath.bignumber;

describe('acos', function() {
  it('should return the arccos of a boolean', function () {
    approx.equal(acos(true), 0);
    approx.equal(acos(false), 0.5 * pi);
  });

  it('should return the arccos of null', function () {
    approx.equal(acos(null), 0.5 * pi);
  });

  it('should return the arccos of a number', function() {
    approx.equal(acos(-1) / pi, 1);
    approx.equal(acos(-0.5) / pi, 2 / 3);
    approx.equal(acos(0) / pi, 0.5);
    approx.equal(acos(0.5) / pi, 1 / 3);
    approx.equal(acos(1) / pi, 0);
  });

  it('should return the arccos of a bignumber', function() {
    var arg = Big(-1);
    assert.deepEqual(acosBig(arg).toString(), bigmath.pi.toString());
    assert.deepEqual(acosBig(Big(-0.5)), Big('2.0943951023931954923'));
    assert.deepEqual(acosBig(Big(0)), Big('1.5707963267948966192'));
    assert.deepEqual(acosBig(Big(0.5)), Big('1.0471975511965977462'));
    assert.deepEqual(acosBig(Big(1)), Big(0));

    // Hit Newton's method case
    bigmath.config({precision: 61});
    assert.deepEqual(acosBig(Big(0.00000001)), Big('1.5707963167948966192313' +
                                                     '2152497308477543191053' +
                                                     '3020886243820359'));
    //Make sure arg was not changed
    assert.deepEqual(arg, Big(-1));
  });

  it('should be the inverse function of cos', function() {
    approx.equal(acos(cos(-1)), 1);
    approx.equal(acos(cos(0)), 0);
    approx.equal(acos(cos(0.1)), 0.1);
    approx.equal(acos(cos(0.5)), 0.5);
    approx.equal(acos(cos(2)), 2);
  });

  it('should be the inverse function of bignumber cos', function() {
    bigmath.config({precision: 20});
    assert.deepEqual(acosBig(cosBig(Big(-1))), Big(1));
    assert.deepEqual(acosBig(cosBig(Big(0))), Big(0));
    assert.deepEqual(acosBig(cosBig(Big(0.1))), Big(0.1));
    assert.deepEqual(acosBig(cosBig(Big(0.5))), Big(0.5));
    assert.deepEqual(acosBig(cosBig(Big(2))), Big(2));
  });

  it('should throw an error if the bignumber result is complex', function() {
    assert.throws(function () {
      acos(Big(1.1));
    }, /acos() only has non-complex values for |x| <= 1./);
    assert.throws(function () {
      acos(Big(-1.1));
    }, /acos() only has non-complex values for |x| <= 1./);
  });

  it('should return the arccos of a complex number', function() {
    approx.deepEqual(acos(complex('2+3i')), complex(1.00014354247380, -1.98338702991654));
    approx.deepEqual(acos(complex('2-3i')), complex(1.00014354247380, 1.98338702991654));
    approx.deepEqual(acos(complex('-2+3i')), complex(2.14144911111600, -1.98338702991654));
    approx.deepEqual(acos(complex('-2-3i')), complex(2.14144911111600, 1.98338702991654));
    approx.deepEqual(acos(complex('i')), complex(1.570796326794897, -0.881373587019543));
    approx.deepEqual(acos(complex('1')), complex(0, 0));
    approx.deepEqual(acos(complex('1+i')), complex(0.904556894302381, -1.061275061905036));
  });

  it('should throw an error if called with a unit', function() {
    assert.throws(function () {acos(unit('45deg'))});
    assert.throws(function () {acos(unit('5 celsius'))});
  });

  it('should throw an error if called with a string', function() {
    assert.throws(function () {acos('string')});
  });

  it('should calculate the arccos element-wise for arrays and matrices', function() {
    // note: the results of acos(2) and acos(3) differs in octave
    // the next tests are verified with mathematica
    var acos123 = [0, complex(0, 1.316957896924817), complex(0, 1.762747174039086)];
    approx.deepEqual(acos([1,2,3]), acos123);
    approx.deepEqual(acos(matrix([1,2,3])), matrix(acos123));
  });

  it('should throw an error in case of invalid number of arguments', function() {
    assert.throws(function () {acos()}, error.ArgumentsError);
    assert.throws(function () {acos(1, 2)}, error.ArgumentsError);
  });

});
