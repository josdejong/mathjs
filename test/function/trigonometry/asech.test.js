var assert = require('assert');
var error = require('../../../lib/error/index');
var math = require('../../../index');
var approx = require('../../../tools/approx');
var pi = math.pi;
var asech = math.asech;
var sech = math.sech;
var complex = math.complex;
var matrix = math.matrix;
var unit = math.unit;
var bigmath = math.create({number: 'BigNumber', precision: 20});
var biggermath = math.create({precision: 22});
var predmath = math.create({predictable: true});
var asechBig = bigmath.asech;
var Big = bigmath.bignumber;

describe('asech', function() {
  it('should return the hyperbolic arcsec of a boolean', function () {
    assert.equal(asech(true), 0);
    assert.equal(asech(false), Infinity);
  });

  it('should return the hyperbolic arcsec of null', function () {
    assert.equal(asech(null), Infinity);
  });

  it('should return the hyperbolic arcsec of a number', function() {
    approx.deepEqual(asech(-0.5), complex(1.3169578969, pi));
    approx.deepEqual(asech(2), complex(0, pi / 3));
    //assert.ok(isNaN(asech(-0.5)));
    //assert.ok(isNaN(asech(2)));

    assert.equal(asech(0), Infinity);
    approx.equal(asech(0.25), 2.0634370688955605467272811726201);
    approx.equal(asech(0.5), 1.31695789692481670862504634730797);
    approx.equal(asech(0.75), 0.7953654612239056305278909331478);
    assert.equal(asech(1), 0);
  });

  it('should return the hyperbolic arcsec of a number when predictable:true', function() {
    assert.equal(typeof predmath.asech(2), 'number');
    assert(isNaN(predmath.asech(2)));
  });

  it('should return the hyperbolic arcsec of a bignumber', function() {
    var arg1 = Big(0);
    var arg2 = Big(0.25);
    assert.deepEqual(asechBig(arg1).toString(), 'Infinity');
    assert.deepEqual(asechBig(arg2), Big('2.0634370688955605467'));
    assert.deepEqual(asechBig(Big(0.5)), Big('1.3169578969248167086'));
    assert.deepEqual(asechBig(Big(0.75)), Big('0.79536546122390563049'));
    assert.deepEqual(asechBig(Big(1)), Big(0));

    //Make sure arg was not changed
    assert.deepEqual(arg1, Big(0));
    assert.deepEqual(arg2, Big(0.25));

    /* out of range */
    assert.ok(asech(Big(-1)).isNaN());
    assert.ok(asech(Big(2)).isNaN());
  });

  it('should be the inverse function of hyperbolic sec', function() {
    approx.equal(asech(sech(-1)), 1);
    approx.equal(asech(sech(0)), 0);
    approx.equal(asech(sech(0.1)), 0.1);
    approx.equal(asech(sech(0.5)), 0.5);
    approx.equal(asech(sech(2)), 2);
  });

  it('should be the inverse function of bignumber sech', function() {
    assert.deepEqual(asechBig(bigmath.sech(Big(-1))), Big(1));
    assert.deepEqual(asechBig(bigmath.sech(Big(0))), Big(0));
    assert.deepEqual(asechBig(bigmath.sech(Big(0.5))), Big('0.49999999999999999995'));
    assert.deepEqual(asechBig(bigmath.sech(Big(2))), Big(2));

    /* Pass in more digits to pi. */
    assert.deepEqual(asechBig(biggermath.sech(Big(0.1))), Big('0.10000000000000000012'));
  });

  it('should return the arcsech of a complex number', function() {
    approx.deepEqual(asech(complex('2+3i')), complex(0.23133469857397, -1.420410722467035));
    approx.deepEqual(asech(complex('2-3i')), complex(0.23133469857397, 1.420410722467035));
    approx.deepEqual(asech(complex('-2+3i')), complex(0.23133469857397, -1.72118193112275858));
    approx.deepEqual(asech(complex('-2-3i')), complex(0.23133469857397, 1.72118193112275858));
    approx.deepEqual(asech(complex('1+i')), complex(0.5306375309525178, -1.11851787964370594));
    approx.deepEqual(asech(complex('i')), complex(0.881373587019543, -1.570796326794897));
    approx.deepEqual(asech(complex('2')), complex(0, pi / 3));
    assert.deepEqual(asech(complex('1')), complex(0, 0));
    approx.deepEqual(asech(complex('0.5')), complex(1.3169578969248, 0));
    assert.deepEqual(asech(complex('0')), complex(Infinity, 0));
    approx.deepEqual(asech(complex('-0.5')), complex(1.3169578969248, pi));
    approx.deepEqual(asech(complex('-1')), complex(0, pi));
  });

  it('should throw an error if called with a unit', function() {
    assert.throws(function () {asech(unit('45deg'))});
    assert.throws(function () {asech(unit('5 celsius'))});
  });

  it('should throw an error if called with a string', function() {
    assert.throws(function () {asech('string')});
  });

  it('should calculate the arcsec element-wise for arrays and matrices', function() {
    var asech01 = [Infinity, 0];
    assert.deepEqual(asech([0,1]), asech01);
    assert.deepEqual(asech(matrix([0,1])), matrix(asech01));
  });

  it('should return the hyperbolic ar secant of a quaternion', function () {
    approx.deepEqual(asech(math.quaternion({r:0})), math.quaternion({i:pi/2}));
    approx.deepEqual(asech(math.quaternion({i:pi})), math.quaternion(-0.3131658804508684,1.5707963267948966,0,0));
    approx.deepEqual(asech(math.quaternion({r:1})), math.quaternion());
    approx.deepEqual(asech(math.quaternion({r:pi, i:1})), math.quaternion(0.09591398081723239,-1.2789707291504853,0,0));
    approx.deepEqual(asech(math.quaternion({r:2, i:3})), math.quaternion(0.23133469857397,-1.420410722467035,0,0));
    approx.deepEqual(asech(math.quaternion(1,2,3,4)), math.quaternion(0.1786503635424272,-0.57119219533443,-0.8567882930016452,-1.14238439066886));
    approx.deepEqual(asech(math.quaternion(-1,-2,-3,-4)), math.quaternion(-0.1786503635424273,-0.5955660251113637,-0.8933490376670458,-1.1911320502227274));
    approx.deepEqual(asech(math.quaternion({i:1})), math.quaternion(-0.8813735870195428,1.5707963267948963,0,0));
    approx.deepEqual(asech(math.quaternion({j:1})), math.quaternion(0.5493061443340549,1.282549830161864,-0.9068996821171088,0));
    approx.deepEqual(asech(math.quaternion({k:1})), math.quaternion(0.5493061443340549,1.282549830161864,0,-0.9068996821171088));
  });

  it('should throw an error in case of invalid number of arguments', function() {
    assert.throws(function () {asech()}, /TypeError: Too few arguments/);
    assert.throws(function () {asech(1, 2)}, /TypeError: Too many arguments/);
  });

  it('should LaTeX asech', function () {
    var expression = math.parse('asech(1)');
    assert.equal(expression.toTex(), '\\mathrm{sech}^{-1}\\left(1\\right)');
  });

});
