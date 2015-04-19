var assert = require('assert'),
    error = require('../../../lib/error/index'),
    math = require('../../../index'),
    approx = require('../../../tools/approx'),
    pi = math.pi,
    complex = math.complex,
    matrix = math.matrix,
    unit = math.unit,
    cot = math.cot,
    bigmath = math.create({number: 'bignumber', precision: 20}),
    biggermath = math.create({number: 'bignumber', precision: 22});

describe('cot', function() {
  it('should return the cotan of a boolean', function () {
    approx.equal(cot(true), 0.642092615934331);
    approx.equal(cot(false), Infinity);
  });

  it('should return the cotan of null', function () {
    approx.equal(cot(null), Infinity);
  });

  it('should return the cotan of a number', function() {
    approx.equal(cot(0), Infinity);
    approx.equal(1 / cot(pi*1/8), 0.414213562373095);
    approx.equal(1 / cot(pi*1/4), 1);
    approx.equal(cot(pi*2/4), 0);
    approx.equal(1 / cot(pi*3/4), -1);
    approx.equal(1 / cot(pi*4/4), 0);
    approx.equal(1 / cot(pi*5/4), 1);
    approx.equal(cot(pi*6/4), 0);
    approx.equal(1 / cot(pi*7/4), -1);
    approx.equal(1 / cot(pi*8/4), 0);
  });

  it('should return the cotan of a bignumber', function() {
    var Big = bigmath.bignumber;
    var bigPi = bigmath.pi;
    var sqrt2 = bigmath.SQRT2.toString();

    var arg1 = Big(0);
    var result1 = bigmath.cot(arg1);
    assert.ok(!result1.isFinite());
    assert.equal(result1.constructor.precision, 20);
    assert.deepEqual(arg1, Big(0));

    var result2 = bigmath.cot(bigPi.div(8));
    assert.deepEqual(result2.toString(), '2.4142135623730950488');
    assert.equal(result2.constructor.precision, 20);
    assert.equal(bigPi.constructor.precision, 20);

    assert.ok(bigmath.cot(bigPi.div(2)).isZero());
    assert.ok(!bigmath.cot(bigPi).isFinite());
    assert.ok(bigmath.cot(bigPi.times(3).div(2)).isZero());
    assert.ok(!bigmath.cot(bigPi.times(2)).isFinite());
    assert.ok(!bigmath.cot(bigmath.tau).isFinite());

    /* Pass in more digits of pi. */
    var biggerPi = biggermath.pi;
    console.log(biggerPi.constructor.precision);
    assert.deepEqual(bigmath.cot(biggerPi.div(4)).toString(), '1');
    assert.deepEqual(bigmath.cot(biggerPi.times(3).div(4)).toString(), '-1');
    assert.deepEqual(bigmath.cot(biggerPi.times(5).div(4)).toString(), '1');
    assert.deepEqual(bigmath.cot(biggerPi.times(7).div(4)).toString(), '-1');
  });

  it('should return the cotan of a complex number', function() {
    var re = 0.00373971037633696;
    var im = 0.99675779656935837;
    approx.deepEqual(cot(complex('2+3i')), complex(-re, -im));
    approx.deepEqual(cot(complex('2-3i')), complex(-re, im));
    approx.deepEqual(cot(complex('-2+3i')), complex(re, -im));
    approx.deepEqual(cot(complex('-2-3i')), complex(re, im));
    approx.deepEqual(cot(complex('i')), complex(0, -1.313035285499331));
    approx.deepEqual(cot(complex('1')), complex(0.642092615934331, 0));
    approx.deepEqual(cot(complex('1+i')), complex(0.217621561854403, -0.868014142895925));
  });

  it('should return the cotan of an angle', function() {
    approx.equal(cot(unit('45deg')), 1);
    approx.equal(cot(unit('-45deg')), -1);
  });

  it('should throw an error if called with an invalid unit', function() {
    assert.throws(function () {cot(unit('5 celsius'))});
  });

  it('should throw an error if called with a string', function() {
    assert.throws(function () {cot('string')});
  });

  var cot123 = [0.642092615934331, -0.457657554360286, -7.015252551434534];

  it('should return the cotan of each element of an array', function() {
    approx.deepEqual(cot([1,2,3]), cot123);
  });

  it('should return the cotan of each element of a matrix', function() {
    approx.deepEqual(cot(matrix([1,2,3])), matrix(cot123));
  });

  it('should throw an error in case of invalid number of arguments', function() {
    assert.throws(function () {cot()}, error.ArgumentsError);
    assert.throws(function () {cot(1, 2)}, error.ArgumentsError);
  });

  it('should LaTeX cot', function () {
    var expression = math.parse('cot(1)');
    assert.equal(expression.toTex(), '\\cot\\left(1\\right)');
  });

});
