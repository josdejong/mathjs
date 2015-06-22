var assert = require('assert'),
    error = require('../../../lib/error/index'),
    math = require('../../../index'),
    approx = require('../../../tools/approx'),
    pi = math.pi,
    complex = math.complex,
    matrix = math.matrix,
    unit = math.unit,
    cos = math.cos,
    bigmath = math.create({number: 'bignumber', precision: 15}),
    biggermath = math.create({number: 'bignumber', precision: 238});


describe('cos', function() {
  it('should return the cosine of a boolean', function () {
    approx.equal(cos(true), 0.54030230586814);
    approx.equal(cos(false), 1);
  });

  it('should return the cosine of null', function () {
    approx.equal(cos(null), 1);
  });

  it('should return the cosine of a number', function() {
    approx.equal(cos(0), 1);
    approx.equal(cos(pi*1/4), 0.707106781186548);
    approx.equal(cos(pi*1/8), 0.923879532511287);
    approx.equal(cos(pi*2/4), 0);
    approx.equal(cos(pi*3/4), -0.707106781186548);
    approx.equal(cos(pi*4/4), -1);
    approx.equal(cos(pi*5/4), -0.707106781186548);
    approx.equal(cos(pi*6/4), 0);
    approx.equal(cos(pi*7/4), 0.707106781186548);
    approx.equal(cos(pi*8/4), 1);
    approx.equal(cos(pi/4), Math.SQRT1_2);
  });

  it('should return the cosine of a bignumber', function() {
    assert.deepEqual(bigmath.cos(biggermath.bignumber(0)).toString(), '1');

    // 103.64 % tau = 3.109... <- pretty close to the pi boundary
    var result_val = '-0.99947004918247698171247470962484532559534008595265991588' +
                        '25959085696348870383952892132851183764863885182646678036' +
                        '80857263937361947475191126604630777331941809888320749410' +
                        '59494006339537812110786663367929884637840572887762249921' +
                        '8425619255481';
    var cos_val = biggermath.cos(biggermath.bignumber(103.64));
    assert.equal(cos_val.constructor.precision, 238);
    assert.deepEqual(cos_val.toString(), result_val);

    cos_val = biggermath.cos(biggermath.bignumber(-103.64));
    assert.equal(cos_val.constructor.precision, 238);
    assert.deepEqual(cos_val.toString(), result_val);


    biggermath.config({precision: 16});
    var bigPi = biggermath.pi;

    result_val = bigmath.SQRT2.div(2).toString();
    assert.deepEqual(bigmath.cos(bigPi.div(4)).toString(), result_val);
    assert.ok(bigmath.cos(bigPi.div(2)).isZero());
    assert.deepEqual(bigmath.cos(bigPi).toString(), '-1');
    assert.ok(bigmath.cos(bigPi.times(3).div(2)).isZero());
    assert.deepEqual(bigmath.cos(bigPi.times(2)).toString(), '1');
    assert.deepEqual(bigmath.cos(bigmath.tau).toString(), '1');
    assert.deepEqual(bigmath.cos(bigmath.tau.times(2)).toString(), '1');

    /* Pass in an extra digit of pi! Also tests whether pi was changed previously. */
    assert.deepEqual(bigmath.cos(bigPi.times(3).div(4)).toString(), '-'+result_val);
    assert.deepEqual(bigmath.cos(bigPi.times(5).div(4)).toString(), '-'+result_val);
    assert.deepEqual(bigmath.cos(bigPi.times(7).div(4)).toString(), result_val);
  });

  it('should return the cosine of a complex number', function() {
    var re = 4.18962569096881,
        im = 9.10922789375534;
    approx.deepEqual(cos(complex('2+3i')), complex(-re, -im));
    approx.deepEqual(cos(complex('2-3i')), complex(-re, im));
    approx.deepEqual(cos(complex('-2+3i')), complex(-re, im));
    approx.deepEqual(cos(complex('-2-3i')), complex(-re, -im));
    approx.deepEqual(cos(complex('i')), complex(1.54308063481524, 0));
    approx.deepEqual(cos(complex('1')), complex(0.540302305868140, 0));
    approx.deepEqual(cos(complex('1+i')), complex(0.833730025131149, -0.988897705762865));
    assert.ok(cos(complex('1e-50+1e-50i')).im != 0);
  });

  it('should return the cosine of an angle', function() {
    approx.equal(cos(unit('45deg')), 0.707106781186548);
    approx.equal(cos(unit('-135deg')), -0.707106781186548);
  });

  it('should throw an error if called with an invalid unit', function() {
    assert.throws(function () {cos(unit('5 celsius'))});
  });

  it('should throw an error if called with a string', function() {
    assert.throws(function () {cos('string')});
  });

  var cos123 = [0.540302305868140, -0.41614683654714, -0.989992496600445];

  it('should return the cos of each element of a matrix', function() {
    approx.deepEqual(cos(matrix([1,2,3])), matrix(cos123));
  });

  it('should return the cos of each element of an array', function() {
    approx.deepEqual(cos([1,2,3]), cos123);
  });

  it('should throw an error in case of invalid number of arguments', function() {
    assert.throws(function () {cos()}, /TypeError: Too few arguments/);
    assert.throws(function () {cos(1, 2)}, /TypeError: Too many arguments/);
  });

  it('should LaTeX cos', function () {
    var expression = math.parse('cos(1)');
    assert.equal(expression.toTex(), '\\cos\\left(1\\right)');
  });

});
