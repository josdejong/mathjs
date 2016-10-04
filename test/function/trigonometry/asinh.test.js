var assert = require('assert'),
    error = require('../../../lib/error/index'),
    math = require('../../../index'),
    approx = require('../../../tools/approx'),
    pi = math.pi,
    asinh = math.asinh,
    sinh = math.sinh,
    complex = math.complex,
    matrix = math.matrix,
    unit = math.unit,
    bigmath = math.create({number: 'BigNumber', precision: 20}),
    biggermath = math.create({precision: 21}),
    asinhBig = bigmath.asinh,
    Big = bigmath.bignumber;

describe('asinh', function() {
  it('should return the hyperbolic arcsin of a boolean', function () {
    approx.equal(asinh(true), 0.8813735870195430);
    assert.equal(asinh(false), 0);
  });

  it('should return the hyperbolic arcsin of null', function () {
    assert.equal(asinh(null), 0);
  });

  it('should return the hyperbolic arcsin of a number', function() {
    approx.equal(asinh(-2), -1.44363547517881034249327674027311);
    approx.equal(asinh(-1), -0.88137358701954302523260932497979);
    approx.equal(asinh(0), 0);
    approx.equal(asinh(1), 0.88137358701954302523260932497979);
    approx.equal(asinh(2), 1.44363547517881034249327674027311);
    approx.equal(asinh(pi), 1.8622957433108482198883613251826);
  });

  it('should return the hyperbolic arcsin of a bignumber', function() {
    var arg = Big(-2);
    assert.deepEqual(asinhBig(arg), Big('-1.4436354751788103425'));
    assert.deepEqual(asinhBig(Big(-1)), Big('-0.88137358701954302523'));
    assert.deepEqual(asinhBig(Big(0)), Big(0));
    assert.deepEqual(asinhBig(Big(1)), Big('0.88137358701954302523'));
    assert.deepEqual(asinhBig(Big(2)), Big('1.4436354751788103425'));
    assert.deepEqual(asinhBig(bigmath.pi).toString(), '1.8622957433108482199');

    //Make sure arg was not changed
    assert.deepEqual(arg, Big(-2));
  });

  it('should be the inverse function of hyperbolic sin', function() {
    approx.equal(asinh(sinh(-1)), -1);
    approx.equal(asinh(sinh(0)), 0);
    approx.equal(asinh(sinh(0.1)), 0.1);
    approx.equal(asinh(sinh(0.5)), 0.5);
    approx.equal(asinh(sinh(2)), 2);
  });

  it('should be the inverse function of bignumber sinh', function() {
    assert.deepEqual(asinhBig(bigmath.sinh(Big(-1))), Big(-1));
    assert.deepEqual(asinhBig(bigmath.sinh(Big(0))), Big(0));
    assert.deepEqual(asinhBig(bigmath.sinh(Big(0.5))), Big(0.5));
    assert.deepEqual(asinhBig(bigmath.sinh(Big(2))), Big(2));

    /* Pass in more digits to pi. */
    assert.deepEqual(asinhBig(biggermath.sinh(Big(0.1))), Big('0.099999999999999999996'));
  });

  it('should return the arcsinh of a complex number', function() {
    approx.deepEqual(asinh(complex('2+3i')), complex(1.9686379257931, 0.9646585044076028));
    approx.deepEqual(asinh(complex('2-3i')), complex(1.9686379257931, -0.9646585044076028));
    approx.deepEqual(asinh(complex('-2+3i')), complex(-1.9686379257931, 0.9646585044076028));
    approx.deepEqual(asinh(complex('-2-3i')), complex(-1.9686379257931, -0.9646585044076028));
    approx.deepEqual(asinh(complex('1+i')), complex(1.0612750619050357, 0.6662394324925153));
    approx.deepEqual(asinh(complex('i')), complex(0, pi / 2));
    approx.deepEqual(asinh(complex('1')), complex(0.881373587019543025, 0));
    assert.deepEqual(asinh(complex('0')), complex(0, 0));
  });

  it('should throw an error if called with a unit', function() {
    assert.throws(function () {asinh(unit('45deg'))});
    assert.throws(function () {asinh(unit('5 celsius'))});
  });

  it('should throw an error if called with a string', function() {
    assert.throws(function () {asinh('string')});
  });

  it('should calculate the arcsin element-wise for arrays and matrices', function() {
    var asinh123 = [0.881373587019543025, 1.4436354751788103, 1.8184464592320668];
    approx.deepEqual(asinh([1,2,3]), asinh123);
    approx.deepEqual(asinh(matrix([1,2,3])), matrix(asinh123));
  });

  it('should return the ar hyperbolic sine of a quaternion', function () {
    approx.deepEqual(asinh(math.quaternion({r:0})), math.quaternion());
    approx.deepEqual(asinh(math.quaternion({i:pi})), math.quaternion(1.811526272460853,1.5707963267948966,0,0));
    approx.deepEqual(asinh(math.quaternion({i:pi/2})), math.quaternion(1.0232274785475506,1.5707963267948966,0,0));
    approx.deepEqual(asinh(math.quaternion({r:pi, i:1})), math.quaternion(1.904627686970658,0.2955850342116299,0,0));
    approx.deepEqual(asinh(math.quaternion({r:2, i:3})), math.quaternion(1.9686379257931, 0.9646585044076028,0,0));
    approx.deepEqual(asinh(math.quaternion(1,2,3,4)), math.quaternion(2.385889902585242,0.514052600662788,0.7710789009941821,1.028105201325576));
    approx.deepEqual(asinh(math.quaternion(-1,-2,-3,-4)), math.quaternion(-2.385889902585234,-0.5140526006627896,-0.7710789009941861,-1.0281052013255791));
    approx.deepEqual(asinh(math.quaternion({i:1})), math.quaternion({i:1.5707963267948966}));
    approx.deepEqual(asinh(math.quaternion({j:1})), math.quaternion({j:1.5707963267948966}));
    approx.deepEqual(asinh(math.quaternion({k:1})), math.quaternion({k:1.5707963267948966}));
  });

  it('should throw an error in case of invalid number of arguments', function() {
    assert.throws(function () {asinh()}, /TypeError: Too few arguments/);
    assert.throws(function () {asinh(1, 2)}, /TypeError: Too many arguments/);
  });

  it('should LaTeX asinh', function () {
    var expression = math.parse('asinh(2)');
    assert.equal(expression.toTex(), '\\sinh^{-1}\\left(2\\right)');
  });

});
