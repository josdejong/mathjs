// test expm1
var assert = require('assert'),
    approx = require('../../../tools/approx'),
    math = require('../../../index'),
    complex = math.complex,
    matrix = math.matrix,
    sparse = math.sparse,
    unit = math.unit,
    expm1 = math.expm1;

describe('expm1', function() {

  it('should exponentiate a boolean', function () {
    approx.equal(expm1(true), 1.71828182845905);
    approx.equal(expm1(false), 0);
  });

  it('should exponentiate a number', function() {
    approx.equal(expm1(-3), -0.9502129316321360);
    approx.equal(expm1(-2), -0.8646647167633873);
    approx.equal(expm1(-1), -0.6321205588285577);
    approx.equal(expm1(0), 0);
    approx.equal(expm1(1), 1.71828182845905);
    approx.equal(expm1(2), 6.38905609893065);
    approx.equal(expm1(3), 19.0855369231877);
    approx.equal(expm1(math.log(100)) + 1, 100);

    // function requirements
    assert.ok(isNaN(expm1(NaN)));
    assert.equal(expm1(+0), 0);
    assert.equal(expm1(-0), 0);
    assert.equal(expm1(+Infinity), Infinity);
    assert.equal(expm1(-Infinity), -1);
  });

  it('should exponentiate a bignumber', function() {
    var bigmath = math.create({precision: 100});

    assert.deepEqual(bigmath.expm1(bigmath.bignumber(1)), bigmath.bignumber('1.718281828459045235360287471352662497757247093699959574966967627724076630353547594571382178525166427'));
  });

  it('should throw an error if there\'s wrong number of arguments', function() {
    assert.throws(function () {expm1();}, /TypeError: Too few arguments/);
    assert.throws(function () {expm1(1, 2);}, /TypeError: Too many arguments/);
  });

  it('should exponentiate a complex number correctly', function() {
    approx.deepEqual(expm1(math.i),          complex('-0.45969769413186 + 0.841470984807897i'));
    approx.deepEqual(expm1(complex(0, -1)),  complex('-0.45969769413186 - 0.841470984807897i'));
    approx.deepEqual(expm1(complex(1, 1)),   complex('0.46869393991589 + 2.28735528717884i'));
    approx.deepEqual(expm1(complex(1, -1)),  complex('0.46869393991589 - 2.28735528717884i'));
    approx.deepEqual(expm1(complex(-1, -1)), complex('-0.80123388965359 - 0.309559875653112i'));
    approx.deepEqual(expm1(complex(-1, 1)),  complex('-0.80123388965359 + 0.309559875653112i'));
    approx.deepEqual(expm1(complex(1, 0)),   complex('1.71828182845905'));

    // test some logic identities
    var multiply = math.multiply;
    var pi = math.pi;
    var i = math.i;
    approx.deepEqual(expm1(multiply( 0.5, multiply(pi, i))), complex(-1, 1));
    approx.deepEqual(expm1(multiply( 1,   multiply(pi, i))), complex(-2, 0));
    approx.deepEqual(expm1(multiply( 1.5, multiply(pi, i))), complex(-1, -1));
    approx.deepEqual(expm1(multiply( 2,   multiply(pi, i))), complex(0, 0));
    approx.deepEqual(expm1(multiply(-0.5, multiply(pi, i))), complex(-1, -1));
    approx.deepEqual(expm1(multiply(-1,   multiply(pi, i))), complex(-2, 0));
    approx.deepEqual(expm1(multiply(-1.5, multiply(pi, i))), complex(-1, 1));
  });

  it('should throw an error on a unit', function() {
    assert.throws(function () {expm1(unit('5cm'));});
  });

  it('should throw an error with a string', function() {
    assert.throws(function () {expm1('text');});
  });

  it('should exponentiate matrices, arrays and ranges correctly', function() {
    // array
    approx.deepEqual(expm1([0, 1, 2, 3]), [0, 1.71828182845905, 6.38905609893065, 19.0855369231877]);
    approx.deepEqual(expm1([[0, 1], [2, 3]]), [[0, 1.71828182845905], [6.38905609893065, 19.0855369231877]]);
    // dense matrix
    approx.deepEqual(expm1(matrix([0, 1, 2, 3])), matrix([0, 1.71828182845905, 6.38905609893065, 19.0855369231877]));
    approx.deepEqual(expm1(matrix([[0, 1], [2, 3]])), matrix([[0, 1.71828182845905], [6.38905609893065, 19.0855369231877]]));
    approx.deepEqual(expm1(sparse([[0, 1], [2, 3]])), sparse([[0, 1.71828182845905], [6.38905609893065, 19.0855369231877]]));
  });

  it('should LaTeX expm1', function () {
    var expression = math.parse('expm1(0)');
    assert.equal(expression.toTex(), '\\left(e^{0}-1\\right)');
  });
});
