// test log1p
var assert = require('assert');
var approx = require('../../../tools/approx');
var error = require('../../../lib/error/index');
var math = require('../../../index');
var mathPredictable = math.create({predictable: true});
var complex = math.complex;
var matrix = math.matrix;
var unit = math.unit;
var range = math.range;
var log1p = math.log1p;

describe('log1p', function() {
  it('should return the log1p of a boolean value', function () {
    approx.equal(log1p(true), 0.6931471805599);
    assert.equal(log1p(false), 0);
    assert.equal(log1p(1,false), 0);
  });

  it('should return the log1p of positive numbers', function() {
    assert.equal(log1p(-1), -Infinity);
    assert.equal(log1p(-0), -0);
    assert.equal(log1p(+0), +0);
    approx.deepEqual(log1p(1), 0.693147180559945);
    approx.deepEqual(log1p(2), 1.098612288668110);
    approx.deepEqual(math.exp(log1p(99)), 100);
  });

  it('should return the log1p of negative numbers', function() {
    approx.deepEqual(log1p(-2), complex('0.000000000000000 + 3.141592653589793i'));
    approx.deepEqual(log1p(-3), complex('0.693147180559945 + 3.141592653589793i'));
    approx.deepEqual(log1p(-4), complex('1.098612288668110 + 3.141592653589793i'));
  });

  it('should return the log1p of negative numbers with predictable: true', function() {
    assert.equal(typeof mathPredictable.log1p(-2), 'number');
    assert(isNaN(mathPredictable.log1p(-2)));
  });

  it('should return the log1p base N of a number', function() {
    approx.deepEqual(log1p(99, 10), 2);
    approx.deepEqual(log1p(999, 10), 3);
    approx.deepEqual(log1p(7, 2), 3);
    approx.deepEqual(log1p(15, 2), 4);
  });

  it('should throw an error if invalid number of arguments', function() {
    assert.throws(function () {log1p()}, /TypeError: Too few arguments in function log1p \(expected: any, index: 0\)/);
    assert.throws(function () {log1p(1, 2, 3)}, /TypeError: Too many arguments in function log1p \(expected: 2, actual: 3\)/);
  });

  it('should return the log1p of positive bignumbers', function() {
    var bigmath = math.create({precision: 100});

    assert.deepEqual(bigmath.log1p(bigmath.bignumber(-1)).toString(), '-Infinity');
    assert.deepEqual(bigmath.log1p(bigmath.bignumber(0)), bigmath.bignumber('0'));
    assert.deepEqual(bigmath.log1p(bigmath.bignumber(1)), bigmath.bignumber('0.6931471805599453094172321214581765680755001343602552541206800094933936219696947156058633269964186875'));
    assert.deepEqual(bigmath.log1p(bigmath.bignumber(2)), bigmath.bignumber('1.098612288668109691395245236922525704647490557822749451734694333637494293218608966873615754813732089'));

    // note: the following gives a round-off error with regular numbers
    assert.deepEqual(bigmath.log1p(bigmath.bignumber(999), bigmath.bignumber(10)), bigmath.bignumber(3));
  });

  it('should return the log1p of negative bignumbers', function() {
    var bigmath = math.create({precision: 100});

    approx.deepEqual(bigmath.log1p(bigmath.bignumber(-2)), complex('0.000000000000000 + 3.141592653589793i'));
    approx.deepEqual(bigmath.log1p(bigmath.bignumber(-3)), complex('0.693147180559945 + 3.141592653589793i'));
    approx.deepEqual(bigmath.log1p(bigmath.bignumber(-4)), complex('1.098612288668110 + 3.141592653589793i'));
  });

  it('should return the log1p of negative bignumbers with predictable:true', function() {
    assert(mathPredictable.log1p(math.bignumber(-2)).isNaN(), 'should be NaN');
  });

  it('should return the log1p of a complex number', function() {
    approx.deepEqual(log1p(math.i),          complex('0.346573590279973 + 0.785398163397448i'));
    approx.deepEqual(log1p(complex(0, -1)),  complex('0.346573590279973 - 0.785398163397448i'));
    approx.deepEqual(log1p(complex(1, 1)),   complex('0.80471895621705 + 0.463647609000806i'));
    approx.deepEqual(log1p(complex(1, -1)),  complex('0.80471895621705 - 0.463647609000806i'));
    approx.deepEqual(log1p(complex(-1, -1)), complex('-1.570796326794897i'));
    approx.deepEqual(log1p(complex(-1, 1)),  complex('1.570796326794897i'));
    approx.deepEqual(log1p(complex(1, 0)),   complex('0.693147180559945'));
  });

  it('should throw an error when used on a unit', function() {
    assert.throws(function () {log1p(unit('5cm'))});
  });

  it('should throw an error when used on a string', function() {
    assert.throws(function () {log1p('text')});
  });

  it('should return the log1p of each element of a matrix', function() {
    var res = [0, 0.693147180559945, 1.098612288668110, 1.386294361119891];
    approx.deepEqual(log1p([0,1,2,3]), res);
    approx.deepEqual(log1p(matrix([0,1,2,3])), matrix(res));
    approx.deepEqual(log1p(matrix([[0,1],[2,3]])),
        matrix([[0, 0.693147180559945], [1.098612288668110, 1.386294361119891]]));
  });

  it('should LaTeX log1p', function () {
    var expr1 = math.parse('log1p(e)');
    var expr2 = math.parse('log1p(32,2)');

    assert.equal(expr1.toTex(), '\\ln\\left( e+1\\right)');
    assert.equal(expr2.toTex(), '\\log_{2}\\left(32+1\\right)');
  });

});
