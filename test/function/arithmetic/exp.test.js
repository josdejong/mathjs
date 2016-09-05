// test exp
var assert = require('assert'),
    approx = require('../../../tools/approx'),
    math = require('../../../index'),
    complex = math.complex,
    matrix = math.matrix,
    sparse = math.sparse,
    unit = math.unit,
    exp = math.exp;

describe('exp', function() {

  it('should exponentiate a boolean', function () {
    approx.equal(exp(true), 2.71828182845905);
    approx.equal(exp(false), 1);
  });

  it('should exponentiate null', function () {
    assert.equal(exp(null), 1);
  });

  it('should exponentiate a number', function() {
    approx.equal(exp(-3), 0.0497870683678639);
    approx.equal(exp(-2), 0.1353352832366127);
    approx.equal(exp(-1), 0.3678794411714423);
    approx.equal(exp(0), 1);
    approx.equal(exp(1), 2.71828182845905);
    approx.equal(exp(2), 7.38905609893065);
    approx.equal(exp(3), 20.0855369231877);
    approx.equal(exp(math.log(100)), 100);
  });

  it('should exponentiate a bignumber', function() {
    var bigmath = math.create({precision: 100});

    assert.deepEqual(bigmath.exp(bigmath.bignumber(1)), bigmath.bignumber('2.718281828459045235360287471352662497757247093699959574966967627724076630353547594571382178525166427'));
  });

  it('should throw an error if there\'s wrong number of arguments', function() {
    assert.throws(function () {exp();}, /TypeError: Too few arguments/);
    assert.throws(function () {exp(1, 2);}, /TypeError: Too many arguments/);
  });

  it('should exponentiate a complex number correctly', function() {
    approx.deepEqual(exp(math.i),          complex('0.540302305868140 + 0.841470984807897i'));
    approx.deepEqual(exp(complex(0, -1)),  complex('0.540302305868140 - 0.841470984807897i'));
    approx.deepEqual(exp(complex(1, 1)),   complex('1.46869393991589 + 2.28735528717884i'));
    approx.deepEqual(exp(complex(1, -1)),  complex('1.46869393991589 - 2.28735528717884i'));
    approx.deepEqual(exp(complex(-1, -1)), complex('0.198766110346413 - 0.309559875653112i'));
    approx.deepEqual(exp(complex(-1, 1)),  complex('0.198766110346413 + 0.309559875653112i'));
    approx.deepEqual(exp(complex(1, 0)),   complex('2.71828182845905'));

    // test some logic identities
    var multiply = math.multiply,
        pi = math.pi,
        i = math.i;
    approx.deepEqual(exp(multiply( 0.5, multiply(pi, i))), complex(0, 1));
    approx.deepEqual(exp(multiply( 1,   multiply(pi, i))), complex(-1, 0));
    approx.deepEqual(exp(multiply( 1.5, multiply(pi, i))), complex(0, -1));
    approx.deepEqual(exp(multiply( 2,   multiply(pi, i))), complex(1, 0));
    approx.deepEqual(exp(multiply(-0.5, multiply(pi, i))), complex(0, -1));
    approx.deepEqual(exp(multiply(-1,   multiply(pi, i))), complex(-1, 0));
    approx.deepEqual(exp(multiply(-1.5, multiply(pi, i))), complex(0, 1));
  });

  it('should throw an error on a unit', function() {
    assert.throws(function () {exp(unit('5cm'));});
  });

  it('should throw an error with a string', function() {
    assert.throws(function () {exp('text');});
  });

  it('should exponentiate matrices, arrays and ranges correctly', function() {
    // array
    approx.deepEqual(exp([0, 1, 2, 3]), [1, 2.71828182845905, 7.38905609893065, 20.0855369231877]);
    approx.deepEqual(exp([[0, 1], [2, 3]]), [[1, 2.71828182845905], [7.38905609893065, 20.0855369231877]]);
    // dense matrix
    approx.deepEqual(exp(matrix([0, 1, 2, 3])), matrix([1, 2.71828182845905, 7.38905609893065, 20.0855369231877]));
    approx.deepEqual(exp(matrix([[0, 1], [2, 3]])), matrix([[1, 2.71828182845905], [7.38905609893065, 20.0855369231877]]));
    // sparse matrix, TODO: it should return a dense matrix
    approx.deepEqual(exp(sparse([[0, 1], [2, 3]])), sparse([[1, 2.71828182845905], [7.38905609893065, 20.0855369231877]]));
  });

  it('should LaTeX exp', function () {
    var expression = math.parse('exp(0)');
    assert.equal(expression.toTex(), '\\exp\\left(0\\right)');
  });

  it('should rase e to the power of a Quaternion', function () {
    var A = exp(new math.quaternion({i:Math.PI}));
    approx.equal(A.r, -1);
    approx.equal(A.i, 0);
    approx.equal(A.j, 0);
    approx.equal(A.k, 0);

    var B = exp(new math.quaternion());

    assert.equal(B.r, 1);
    assert.equal(B.i, 0);
    assert.equal(B.j, 0);
    assert.equal(B.k, 0);

    var C = exp(new math.quaternion(1,2,3,4));
    approx.equal(C.r, 1.6939227236832994);
    approx.equal(C.i, -0.7895596245415588);
    approx.equal(C.j, -1.184339436812338);
    approx.equal(C.k, -1.5791192490831176);

    var D = exp(new math.quaternion({i:1}));
    var E = exp(new math.quaternion({k:1}));
    var F = exp(new math.quaternion({j:1}));
    assert.equal(D.r === 0.5403023058681398 && D.r === E.r && D.r === F.r, true);
    assert.equal(D.i === 0.8414709848078965 && D.i === E.k && D.i === F.j, true);

    var G = exp(new math.quaternion(3,-2,1,-3));
    approx.equal(G.r, -16.57657478398476);
    approx.equal(G.i, 6.062671780746171);
    approx.equal(G.j, -3.0313358903730854);
    approx.equal(G.k, 9.094007671119256);
  });
});
