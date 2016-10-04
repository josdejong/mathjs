var assert = require('assert');
var error = require('../../../lib/error/index');
var math = require('../../../index');
var approx = require('../../../tools/approx');
var pi = math.pi;
var acosh = math.acosh;
var cosh = math.cosh;
var complex = math.complex;
var matrix = math.matrix;
var unit = math.unit;
var bigmath = math.create({number: 'BigNumber', precision: 20});
var biggermath = math.create({precision: 22});
var predmath = math.create({predictable: true});
var acoshBig = bigmath.acosh;
var Big = bigmath.bignumber;

describe('acosh', function() {
  it('should return the hyperbolic arccos of a boolean', function () {
    assert.equal(acosh(true), 0);
    approx.deepEqual(acosh(false), complex(0, pi / 2));
    //assert.ok(isNaN(acosh(false)));
  });

  it('should return the hyperbolic arccos of null', function () {
    approx.deepEqual(acosh(null), complex(0, pi / 2));
    //assert.ok(isNaN(acosh(null)));
  });

  it('should return the hyperbolic arccos of a number', function() {
    approx.deepEqual(acosh(-2), complex(1.31695789692481670862504634730797, pi));
    approx.deepEqual(acosh(0), complex(0, pi / 2));
    //assert.ok(isNaN(acosh(-2)));
    //assert.ok(isNaN(acosh(0)));

    approx.equal(acosh(1), 0);
    approx.equal(acosh(2), 1.31695789692481670862504634730797);
    approx.equal(acosh(3), 1.7627471740390860504652186499595);
    approx.equal(acosh(pi), 1.811526272460853107021852049305);
  });

  it('should return NaN for values out of range and predictable:true', function() {
    assert.equal(typeof predmath.acosh(-2), 'number');
    assert(isNaN(predmath.acosh(-2)));
  });

  it('should return the hyperbolic arccos of a bignumber', function() {
    var arg = Big(1);
    assert.deepEqual(acosh(arg), Big(0));
    assert.deepEqual(acoshBig(Big(2)), Big('1.3169578969248167086'));
    assert.deepEqual(acoshBig(Big(3)), Big('1.7627471740390860505'));
    assert.deepEqual(acoshBig(bigmath.pi).toString(), '1.811526272460853107');

    //Make sure arg was not changed
    assert.deepEqual(arg, Big(1));
  });

  it('should be the inverse function of hyperbolic cos', function() {
    approx.equal(acosh(cosh(-1)), 1);
    approx.equal(acosh(cosh(0)), 0);
    approx.equal(acosh(cosh(0.1)), 0.1);
    approx.equal(acosh(cosh(0.5)), 0.5);
    approx.equal(acosh(cosh(2)), 2);
  });

  it('should be the inverse function of bignumber cosh', function() {
    assert.deepEqual(acoshBig(bigmath.cosh(Big(-1))), Big(1));
    assert.deepEqual(acoshBig(bigmath.cosh(Big(0))), Big(0));
    assert.deepEqual(acoshBig(bigmath.cosh(Big(2))), Big(2));

    // Pass in extra digit
    var arg = Big(0.1);
    assert.deepEqual(acoshBig(biggermath.cosh(arg)), Big('0.10000000000000000012'));
    assert.deepEqual(acoshBig(biggermath.cosh(Big(0.5))), Big('0.49999999999999999995'));
    assert.deepEqual(arg, Big(0.1));
  });

  it('should throw an error if the bignumber result is complex', function() {
    assert.ok(acosh(Big(0.5).isNaN()));
    assert.ok(acosh(Big(-0.5).isNaN()));
  });

  it('should return the arccosh of a complex number', function() {
    approx.deepEqual(acosh(complex('2+3i')), complex(1.9833870299165, 1.000143542473797));
    approx.deepEqual(acosh(complex('2-3i')), complex(1.9833870299165, -1.000143542473797));
    approx.deepEqual(acosh(complex('-2+3i')), complex(1.9833870299165, 2.14144911111600));
    approx.deepEqual(acosh(complex('-2-3i')), complex(1.9833870299165, -2.14144911111600));
    approx.deepEqual(acosh(complex('1+i')), complex(1.061275061905036, 0.904556894302381));
    approx.deepEqual(acosh(complex('i')), complex(0.881373587019543, 1.570796326794897));
    assert.deepEqual(acosh(complex('1')), complex(0, 0));
    approx.deepEqual(acosh(complex('0')), complex(0, pi / 2));
  });

  it('should throw an error if called with a unit', function() {
    assert.throws(function () {acosh(unit('45deg'))});
    assert.throws(function () {acosh(unit('5 celsius'))});
  });

  it('should throw an error if called with a string', function() {
    assert.throws(function () {acosh('string')});
  });

  it('should calculate the arccos element-wise for arrays and matrices', function() {
    var acosh123 = [0, 1.3169578969248167, 1.7627471740390860504];
    approx.deepEqual(acosh([1,2,3]), acosh123);
    approx.deepEqual(acosh(matrix([1,2,3])), matrix(acosh123));
  });

  it('should return the hyperbolic ar cosine of a quaternion', function () {
    approx.deepEqual(acosh(math.quaternion({r:0})), math.quaternion({i:1.5707963267948966}));
    approx.deepEqual(acosh(math.quaternion({i:pi})), math.quaternion(1.8622957433108482,1.5707963267948966,0,0));
    approx.deepEqual(acosh(math.quaternion({i:pi/2})), math.quaternion(1.233403117511217,1.5707963267948966,0,0));
    approx.deepEqual(acosh(math.quaternion({r:pi, i:1})), math.quaternion(1.8671143931602596,0.32225329398145874,0,0));
    approx.deepEqual(acosh(math.quaternion({r:2, i:3})), math.quaternion(1.9833870299165, 1.000143542473797,0,0));
    approx.deepEqual(acosh(math.quaternion(1,2,3,4)), math.quaternion(2.401447202007401,0.5162761016176176,0.7744141524264265,1.0325522032352352));
    approx.deepEqual(acosh(math.quaternion(-1,-2,-3,-4)), math.quaternion(-2.4014472020073967,0.6504821188281815,0.9757231782422722,1.300964237656363));
    approx.deepEqual(acosh(math.quaternion({i:1})), math.quaternion(0.881373587019543,1.5707963267948966,0,0));
    approx.deepEqual(acosh(math.quaternion({j:1})), math.quaternion(0.5493061443340549,1.282549830161864,0.9068996821171088,0));
    approx.deepEqual(acosh(math.quaternion({k:1})), math.quaternion(0.5493061443340549,1.282549830161864,0,0.9068996821171088));
  });

  it('should throw an error in case of invalid number of arguments', function() {
    assert.throws(function () {acosh()}, /TypeError: Too few arguments/);
    assert.throws(function () {acosh(1, 2)}, /TypeError: Too many arguments/);
  });

  it('should LaTeX acosh', function () {
    var expression = math.parse('acosh(1)');
    assert.equal(expression.toTex(), '\\cosh^{-1}\\left(1\\right)');
  });

});
