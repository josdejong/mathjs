var assert = require('assert'),
    error = require('../../../lib/error/index'),
    math = require('../../../index'),
    approx = require('../../../tools/approx'),
    pi = math.pi,
    complex = math.complex,
    matrix = math.matrix,
    unit = math.unit,
    asin = math.asin,
    sin = math.sin,
    bigmath = math.create({number: 'bignumber', precision: 20}),
    Big = bigmath.bignumber;

describe('asin', function() {
  it('should return the arcsin of a boolean', function () {
    approx.equal(asin(true), 0.5 * pi);
    approx.equal(asin(false), 0);
  });

  it('should return the arcsin of null', function () {
    approx.equal(asin(null), 0);
  });

  it('should return the arcsin of a number', function() {
    approx.equal(asin(-1) / pi, -0.5);
    approx.equal(asin(-0.5) / pi, -1/6);
    approx.equal(asin(0) / pi, 0);
    approx.equal(asin(0.5) / pi, 1/6);
    approx.equal(asin(1) / pi, 0.5);
  });

  it('should return the arcsin of a bignumber', function() {
    var arg1 = Big(-1);
    var arg2 = Big(-0.581);
    var arg3 = Big(-0.5);

    assert.deepEqual(asin(Big(-1)), Big('-1.5707963267948966192'));
    assert.deepEqual(asin(Big(-0.581)), Big('-0.6199567994522537004'));
    assert.deepEqual(asin(Big(-0.5)), Big('-0.5235987755982988731'));
    assert.deepEqual(asin(Big(0)), Big(0));
    assert.deepEqual(asin(Big(0.5)), Big('0.5235987755982988731'));
    assert.deepEqual(asin(Big(0.581)), Big('0.6199567994522537004'));
    assert.deepEqual(asin(Big(1)), Big('1.5707963267948966192'));

    // Make sure args were not changed
    assert.deepEqual(arg1, Big(-1));
    assert.deepEqual(arg2, Big(-0.581));
    assert.deepEqual(arg3, Big(-0.5));

    // Hit Newton's method case
    bigmath.config({precision: 61});

    var arg4 = Big(0.00000001);
    assert.deepEqual(asin(arg4).toString(), '1.0000000000000000166666666666666674166666666666667113e-8');
    assert.deepEqual(arg4, Big(0.00000001));
  });

  it('should be the inverse function of sin', function() {
    approx.equal(asin(sin(-1)), -1);
    approx.equal(asin(sin(0)), 0);
    approx.equal(asin(sin(0.1)), 0.1);
    approx.equal(asin(sin(0.5)), 0.5);
    approx.equal(asin(sin(2)), 1.14159265358979);
  });

  it('should be the inverse function of bignumber sin', function() {
    // More Newton's method test cases
    assert.deepEqual(asin(bigmath.sin(Big(-2))).toString(), '-1.141592653589793238462643383279502884197169399375105820974945');
    assert.deepEqual(asin(bigmath.sin(Big(-0.5))).toString(), '-0.5');
    assert.deepEqual(asin(bigmath.sin(Big(-0.1))).toString(), '-0.1');
    assert.deepEqual(asin(bigmath.sin(Big(0.1))).toString(), '0.1');
    assert.deepEqual(asin(bigmath.sin(Big(0.5))).toString(), '0.5');
    assert.deepEqual(asin(bigmath.sin(Big(2))).toString(), '1.141592653589793238462643383279502884197169399375105820974945');

    bigmath.config({precision: 20});
    // Full decimal Taylor test cases
    /* sin(-1) =                      -0.8414709848078965067
       asin(-0.8414709848078965067) = -1.00000000000000000008 => (rounding up) -1.0000000000000000001
    assert.deepEqual(asin(bigmath.sin(Big(-1))), Big('-1')); */

    assert.ok(asin(bigmath.sin(Big(0))).isZero());
    assert.deepEqual(asin(bigmath.sin(Big(0.1))).toString(), '0.1');
    assert.deepEqual(asin(bigmath.sin(Big(0.5))).toString(), '0.5');
    assert.deepEqual(asin(bigmath.sin(Big(2))).toString(), '1.1415926535897932385');
  });

  it('should return the arcsin of a complex number', function() {
    var re = 0.570652784321099;
    var im = 1.983387029916536;
    approx.deepEqual(asin(complex('2+3i')), complex(re, im));
    approx.deepEqual(asin(complex('2-3i')), complex(re, -im));
    approx.deepEqual(asin(complex('-2+3i')), complex(-re, im));
    approx.deepEqual(asin(complex('-2-3i')), complex(-re, -im));
    approx.deepEqual(asin(complex('i')), complex(0, 0.881373587019543));
    approx.deepEqual(asin(complex('1')), complex(1.57079632679490, 0));
    approx.deepEqual(asin(complex('1+i')), complex(0.666239432492515, 1.061275061905036));
  });

  it('should throw an error if called with a unit', function() {
    assert.throws(function () {asin(unit('45deg'))});
    assert.throws(function () {asin(unit('5 celsius'))});
  });

  it('should throw an error if called with a string', function() {
    assert.throws(function () {asin('string')});
  });

  it('should calculate the arcsin element-wise for arrays and matrices', function() {
    // note: the results of asin(2) and asin(3) differs in octave
    // the next tests are verified with mathematica
    var asin123 = [
      1.57079632679490,
      complex(1.57079632679490, -1.31695789692482),
      complex(1.57079632679490, -1.76274717403909)];
    approx.deepEqual(asin([1,2,3]), asin123);
    approx.deepEqual(asin(matrix([1,2,3])), matrix(asin123));
  });

  it('should throw an error in case of invalid number of arguments', function() {
    assert.throws(function () {asin()}, error.ArgumentsError);
    assert.throws(function () {asin(1, 2)}, error.ArgumentsError);
  });

});
