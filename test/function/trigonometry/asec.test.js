var assert = require('assert'),
    error = require('../../../lib/error/index'),
    math = require('../../../index'),
    approx = require('../../../tools/approx'),
    pi = math.pi,
    asec = math.asec,
    sec = math.sec,
    complex = math.complex,
    matrix = math.matrix,
    unit = math.unit,
    bigmath = math.create({number: 'bignumber', precision: 20}),
    biggermath = math.create({precision: 21}),
    asecBig = bigmath.asec,
    Big = bigmath.bignumber;

describe('asec', function() {
  it('should return the arcsec of a boolean', function () {
    assert.equal(asec(true), 0);
    assert.deepEqual(asec(false), complex(0, Infinity));
    //assert.ok(isNaN(asec(false)));
  });

  it('should return the arcsec of null', function () {
    assert.deepEqual(asec(null), complex(0, Infinity));
    //assert.ok(isNaN(asec(null)));
  });

  it('should return the arcsec of a number', function() {
    approx.equal(asec(-2) / pi, 2 / 3);
    approx.equal(asec(-1) / pi, 1);
    approx.equal(asec(1) / pi, 0);
    approx.equal(asec(2) / pi, 1 / 3);

    approx.deepEqual(asec(-0.5), complex(pi, -1.3169578969248));
    approx.deepEqual(asec(0.5), complex(0, 1.3169578969248));
  });

  it('should return the arcsec of a bignumber', function() {
    var arg1 = Big(-2);
    var arg2 = Big(-1);
    assert.deepEqual(asecBig(arg1).toString(), bigmath.tau.div(3).toString());
    assert.deepEqual(asecBig(arg2).toString(), bigmath.pi.toString());
    assert.deepEqual(asecBig(Big(1)), Big(0));
    assert.deepEqual(asecBig(Big(2)).toString(), bigmath.pi.div(3).toString());

    //Make sure arg was not changed
    assert.deepEqual(arg1, Big(-2));
    assert.deepEqual(arg2, Big(-1));

    // Hit Newton's method case
    bigmath.config({precision: 61});
    var arg = Big(3.00000001);
    assert.deepEqual(asecBig(arg), Big('1.230959418519285979938614206185297709155969929825366328254265'));
    assert.deepEqual(arg, Big(3.00000001));
  });

  it('should be the inverse function of sec', function() {
    approx.equal(asec(sec(-1)), 1);
    approx.equal(asec(sec(0)), 0);
    approx.equal(asec(sec(0.1)), 0.1);
    approx.equal(asec(sec(0.5)), 0.5);
    approx.equal(asec(sec(2)), 2);
  });

  it('should be the inverse function of bignumber sec', function() {
    bigmath.config({precision: 20});
    assert.deepEqual(asecBig(bigmath.sec(Big(-1))), Big(1));
    assert.deepEqual(asecBig(bigmath.sec(Big(0))), Big(0));
    assert.deepEqual(asecBig(bigmath.sec(Big(0.5))), Big(0.5));
    assert.deepEqual(asecBig(bigmath.sec(Big(2))), Big(2));

    // Pass in extra digit
    assert.deepEqual(asecBig(biggermath.sec(Big(0.1))), Big(0.1));
  });

  it('should throw an error if the bignumber result is complex', function() {
    assert.throws(function () {
      asec(Big(0.5));
    }, /asec() only has non-complex values for |x| >= 1./);
    assert.throws(function () {
      asec(Big(0));
    }, /asec() only has non-complex values for |x| >= 1./);
    assert.throws(function () {
      asec(Big(-0.5));
    }, /asec() only has non-complex values for |x| >= 1./);
  });

  it('should return the arcsec of a complex number', function() {
    approx.deepEqual(asec(complex('2+3i')), complex(1.42041072246703,  0.23133469857397));
    approx.deepEqual(asec(complex('2-3i')), complex(1.42041072246703, -0.23133469857397));
    approx.deepEqual(asec(complex('-2+3i')), complex(1.7211819311228, 0.2313346985739733));
    approx.deepEqual(asec(complex('-2-3i')), complex(1.7211819311228, -0.2313346985739733));
    approx.deepEqual(asec(complex('i')), complex(1.570796326794897, 0.881373587019543));
    approx.deepEqual(asec(complex('1+i')), complex(1.1185178796437059, 0.530637530952517826));
    approx.deepEqual(asec(complex('1')), complex(0, 0));
    approx.deepEqual(asec(complex('0.5')), complex(0, 1.3169578969248));
    approx.deepEqual(asec(complex('0')), complex(0, Infinity));
    approx.deepEqual(asec(complex('-0.5')), complex(pi, -1.3169578969248));
  });

  it('should throw an error if called with a unit', function() {
    assert.throws(function () {asec(unit('45deg'))});
    assert.throws(function () {asec(unit('5 celsius'))});
  });

  it('should throw an error if called with a string', function() {
    assert.throws(function () {asec('string')});
  });

  it('should calculate the arcsec element-wise for arrays and matrices', function() {
    var asec123 = [0, pi / 3, 1.23095941734077468];
    approx.deepEqual(asec([1,2,3]), asec123);
    approx.deepEqual(asec(matrix([1,2,3])), matrix(asec123));
  });

  it('should throw an error in case of invalid number of arguments', function() {
    assert.throws(function () {asec()}, error.ArgumentsError);
    assert.throws(function () {asec(1, 2)}, error.ArgumentsError);
  });

});
