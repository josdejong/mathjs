var assert = require('assert'),
    error = require('../../../lib/error/index'),
    math = require('../../../index'),
    approx = require('../../../tools/approx'),
    pi = math.pi,
    complex = math.complex,
    matrix = math.matrix,
    unit = math.unit,
    atan = math.atan,
    tan = math.tan,
    bigmath = math.create({number: 'bignumber', precision: 20}),
    Big = bigmath.bignumber;

describe('atan', function() {
  it('should return the arctan of a boolean', function () {
    approx.equal(atan(true), 0.25 * pi);
    approx.equal(atan(false), 0);
  });

  it('should return the arctan of null', function () {
    approx.equal(atan(null), 0);
  });

  it('should return the arctan of a number', function() {
    approx.equal(atan(-1) / pi, -0.25);
    approx.equal(atan(-0.5) / pi, -0.147583617650433);
    approx.equal(atan(0) / pi, 0);
    approx.equal(atan(0.5) / pi, 0.147583617650433);
    approx.equal(atan(1) / pi, 0.25);
  });

  it('should return the arctan of a bignumber', function() {
    var arg1 = Big(-1);
    var arg2 = Big(-0.5);
    var arg3 = Big(0);
    var arg6 = Big(2);
    assert.deepEqual(atan(arg1), Big('-0.7853981633974483096'));
    assert.deepEqual(atan(arg2), Big('-0.4636476090008061162'));
    assert.deepEqual(atan(arg3), Big(0));
    assert.deepEqual(atan(Big(0.5)), Big('0.4636476090008061162'));
    assert.deepEqual(atan(Big(1)), Big('0.7853981633974483096'));
    assert.deepEqual(atan(arg6), Big('1.107148717794090503'));

    // Ensure the arguments where not changed
    assert.deepEqual(arg1, Big(-1));
    assert.deepEqual(arg2, Big(-0.5));
    assert.deepEqual(arg3, Big(0));
    assert.deepEqual(arg6, Big(2));

    // Hit Newton's method case
    bigmath.config({precision: 61});
    assert.deepEqual(atan(Big(0.9)).toString(), '0.732815101786506591640792072734280251985755679358256086310506');
  });

  it('should be the inverse function of tan', function() {
    approx.equal(atan(tan(-1)), -1);
    approx.equal(atan(tan(0)), 0);
    approx.equal(atan(tan(0.1)), 0.1);
    approx.equal(atan(tan(0.5)), 0.5);
    approx.equal(atan(tan(2)), -1.14159265358979);
  });

  it('should be the inverse function of bignumber tan', function() {
    bigmath.config({precision: 20});
    assert.deepEqual(atan(bigmath.tan(Big(-1))).toString(), '-1');
    assert.ok(atan(bigmath.tan(Big(0))).isZero());
    assert.deepEqual(atan(bigmath.tan(Big(0.1))).toString(), '0.1');
    assert.deepEqual(atan(bigmath.tan(Big(0.5))).toString(), '0.5');
    assert.deepEqual(atan(bigmath.tan(Big(2))).toString(), '-1.1415926535897932385');
    assert.deepEqual(atan(bigmath.tan(bigmath.pi.div(2))).toString(), '-1.5707963267948966192');
  });

  it('should return the arctan of a complex number', function() {
    var re = 1.409921049596575,
        im = 0.229072682968539;
    approx.deepEqual(atan(complex('2+3i')), complex(re, im));
    approx.deepEqual(atan(complex('2-3i')), complex(re, -im));
    approx.deepEqual(atan(complex('-2+3i')), complex(-re, im));
    approx.deepEqual(atan(complex('-2-3i')), complex(-re, -im));
    approx.deepEqual(atan(complex('i')), complex(NaN, NaN)); // TODO: should return NaN + Infi instead
    approx.deepEqual(atan(complex('1')), complex(0.785398163397448, 0));
    approx.deepEqual(atan(complex('1+i')), complex(1.017221967897851, 0.402359478108525));
  });

  it('should throw an error if called with a unit', function() {
    assert.throws(function () {atan(unit('45deg'))});
    assert.throws(function () {atan(unit('5 celsius'))});
  });

  it('should throw an error if called with a string', function() {
    assert.throws(function () {atan('string')});
  });

  it('should calculate the arctan element-wise for arrays and matrices', function() {
    // matrix, array, range
    var atan123 = [0.785398163397448, 1.107148717794090, 1.249045772398254];
    approx.deepEqual(atan([1,2,3]), atan123);
    approx.deepEqual(atan(matrix([1,2,3])), matrix(atan123));
  });

  it('should throw an error in case of invalid number of arguments', function() {
    assert.throws(function () {atan()}, error.ArgumentsError);
    assert.throws(function () {atan(1, 2)}, error.ArgumentsError);
  });

});
