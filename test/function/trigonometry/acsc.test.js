var assert = require('assert');
var error = require('../../../lib/error/index');
var math = require('../../../index');
var approx = require('../../../tools/approx');
var pi = math.pi;
var complex = math.complex;
var matrix = math.matrix;
var unit = math.unit;
var acsc = math.acsc;
var csc = math.csc;
var bigmath = math.create({number: 'bignumber', precision: 20});
var biggermath = math.create({precision: 21});
var predmath = math.create({predictable: true});
var acscBig = bigmath.acsc;
var Big = bigmath.bignumber;

describe('acsc', function() {
  it('should return the arccsc of a boolean', function () {
    approx.equal(acsc(true), pi / 2);
    assert.deepEqual(acsc(false), complex(pi / 2, Infinity));
    //assert.ok(isNaN(acsc(false)));
  });

  it('should return the arccsc of null', function () {
    assert.deepEqual(acsc(null), complex(pi / 2, Infinity));
    //assert.ok(isNaN(acsc(null)));
  });

  it('should return the arccsc of a number', function() {
    approx.equal(acsc(-2) / pi, -1/6);
    approx.equal(acsc(-1) / pi, -0.5);
    assert.deepEqual(acsc(0), complex(pi / 2, Infinity));
    //assert.ok(isNaN(acsc(0)));
    approx.equal(acsc(1) / pi, 0.5);
    approx.equal(acsc(2) / pi, 1/6);
  });

  it('should return the arccsc of a number when predictable:true', function() {
    assert.equal(typeof predmath.acsc(0), 'number');
    assert(isNaN(predmath.acsc(0)));
  });

  it('should return the arccsc of a bignumber', function() {
    var arg1 = Big(-2);
    var arg2 = Big(-1.71);
    var arg3 = Big(-1);

    assert.deepEqual(acscBig(arg1), Big('-0.5235987755982988731'));
    assert.deepEqual(acscBig(arg2), Big('-0.624627713324716013'));
    assert.deepEqual(acscBig(arg3), Big('-1.5707963267948966192'));
    assert.deepEqual(acscBig(Big(1)), Big('1.5707963267948966192'));
    assert.deepEqual(acscBig(Big(1.71)), Big('0.624627713324716013'));
    assert.deepEqual(acscBig(Big(2)), Big('0.5235987755982988731'));

    // Make sure args were not changed
    assert.deepEqual(arg1, Big(-2));
    assert.deepEqual(arg2, Big(-1.71));
    assert.deepEqual(arg3, Big(-1));

    // Hit Newton's method case
    bigmath.config({precision: 61});

    var arg4 = Big(1.00000001);
    assert.deepEqual(acscBig(arg4), Big('1.570654905439248565373629613450057180739125884090554026623514'));
    assert.deepEqual(arg4, Big(1.00000001));
  });

  it('should be the inverse function of csc', function() {
    approx.equal(acsc(csc(-1)), -1);
    approx.equal(acsc(csc(0)), 0);
    approx.equal(acsc(csc(0.1)), 0.1);
    approx.equal(acsc(csc(0.5)), 0.5);
    approx.equal(acsc(csc(2)), 1.14159265358979);
  });

  it('should be the inverse function of bignumber csc', function() {
    // More Newton's method test cases
    assert.deepEqual(acscBig(bigmath.csc(Big(-2))), Big('-1.141592653589793238462643383279502884197169399375105820974945'));
    assert.deepEqual(acscBig(bigmath.csc(Big(-0.5))), Big(-0.5));
    assert.deepEqual(acscBig(bigmath.csc(Big(-0.1))), Big(-0.1));
    assert.deepEqual(acscBig(bigmath.csc(Big(0.1))), Big(0.1));
    assert.deepEqual(acscBig(bigmath.csc(Big(0.5))), Big(0.5));
    assert.deepEqual(acscBig(bigmath.csc(Big(2))), Big('1.141592653589793238462643383279502884197169399375105820974945'));

    // Full decimal Taylor test cases
    bigmath.config({precision: 20});
    assert.deepEqual(acscBig(bigmath.csc(Big(0))), Big(0));
    assert.deepEqual(acscBig(bigmath.csc(Big(0.1))), Big(0.1));
    assert.deepEqual(acscBig(bigmath.csc(Big(0.5))), Big(0.5));

    // Pass in an extra digit
    assert.deepEqual(acscBig(biggermath.csc(Big(-1))), Big('-1'));
    assert.deepEqual(acscBig(biggermath.csc(Big(2))), Big('1.1415926535897932385'));
  });

  it('should throw an error if the bignumber result is complex', function() {
    assert.throws(function () {
      acsc(Big(0.5));
    }, /acsc() only has non-complex values for |x| >= 1./);
    assert.throws(function () {
      acsc(Big(0));
    }, /acsc() only has non-complex values for |x| >= 1./);
    assert.throws(function () {
      acsc(Big(-0.5));
    }, /acsc() only has non-complex values for |x| >= 1./);
  });

  it('should return the arccsc of a complex number', function() {
    var re = 0.150385604327861963;
    var im = 0.231334698573973315;
    approx.deepEqual(acsc(complex('2+3i')), complex(re, -im));
    approx.deepEqual(acsc(complex('2-3i')), complex(re, im));
    approx.deepEqual(acsc(complex('-2+3i')), complex(-re, -im));
    approx.deepEqual(acsc(complex('-2-3i')), complex(-re, im));
    approx.deepEqual(acsc(complex('1+i')), complex(0.4522784471511907,-0.53063753095251783));
    approx.deepEqual(acsc(complex('i')), complex(0, -0.881373587019543));

    approx.deepEqual(acsc(complex('-1')), complex(-pi / 2, 0));
    approx.deepEqual(acsc(complex('-0.5')), complex(-pi / 2, 1.3169578969248));
    assert.deepEqual(acsc(complex('0')), complex(pi / 2, Infinity));
    approx.deepEqual(acsc(complex('0.5')), complex(pi / 2, -1.3169578969248));
    approx.deepEqual(acsc(complex('1')), complex(pi / 2, 0));
  });

  it('should throw an error if called with a unit', function() {
    assert.throws(function () {acsc(unit('45deg'))});
    assert.throws(function () {acsc(unit('5 celsius'))});
  });

  it('should throw an error if called with a string', function() {
    assert.throws(function () {acsc('string')});
  });

  it('should calculate the arccsc element-wise for arrays and matrices', function() {
    var acsc123 = [pi / 2, pi / 6, 0.339836909454];
    approx.deepEqual(acsc([1,2,3]), acsc123);
    approx.deepEqual(acsc(matrix([1,2,3])), matrix(acsc123));
  });

  it('should throw an error in case of invalid number of arguments', function() {
    assert.throws(function () {acsc()}, /TypeError: Too few arguments/);
    assert.throws(function () {acsc(1, 2)}, /TypeError: Too many arguments/);
  });

  it('should LaTex acsc', function () {
    var expression = math.parse('acsc(2)');
    assert.equal(expression.toTex(), '\\csc^{-1}\\left(2\\right)');
  });

});
