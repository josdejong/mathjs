// test exp
var assert = require('assert'),
    approx = require('../../../tools/approx.js'),
    math = require('../../../src/index.js'),
    complex = math.complex,
    matrix = math.matrix,
    unit = math.unit,
    range = math.range,
    exp = math.exp;

describe('exp', function() {

  it('should be parsed correctly', function() {
    approx.equal(math.eval('exp(1)'), Math.E);
    approx.deepEqual(math.eval('1+exp(pi*i)'), complex('0'));
  });

  it('should exponentiate a number correctly', function() {
    // number
    approx.equal(exp(-3), 0.0497870683678639);
    approx.equal(exp(-2), 0.1353352832366127);
    approx.equal(exp(-1), 0.3678794411714423);
    approx.equal(exp(0), 1);
    approx.equal(exp(1), 2.71828182845905);
    approx.equal(exp(2), 7.38905609893065);
    approx.equal(exp(3), 20.0855369231877);
    approx.equal(exp(math.log(100)), 100);
  });

  it('should throw an error if there\'s wrong number of arguments', function() {
    assert.throws(function () {exp()}, SyntaxError, 'Wrong number of arguments in function exp (0 provided, 1 expected)');
    assert.throws(function () {exp(1, 2)}, SyntaxError, 'Wrong number of arguments in function exp (2 provided, 1 expected)');
  });

  it('should exponentiate a complex number correctly', function() {
    approx.deepEqual(exp(math.i),          complex('0.540302305868140 + 0.841470984807897i'));
    approx.deepEqual(exp(complex(0, -1)),  complex('0.540302305868140 - 0.841470984807897i'));
    approx.deepEqual(exp(complex(1, 1)),   complex('1.46869393991589 + 2.28735528717884i'));
    approx.deepEqual(exp(complex(1, -1)),  complex('1.46869393991589 - 2.28735528717884i'));
    approx.deepEqual(exp(complex(-1, -1)), complex('0.198766110346413 - 0.309559875653112i'));
    approx.deepEqual(exp(complex(-1, 1)),  complex('0.198766110346413 + 0.309559875653112i'));
    approx.deepEqual(exp(complex(1, 0)),   2.71828182845905);

    approx.deepEqual(math.eval('exp(0.5 * pi * i)'),  complex(0, 1));
    approx.deepEqual(math.eval('exp(1 * pi * i)'),    complex(-1, 0));
    approx.deepEqual(math.eval('exp(1.5 * pi * i)'),  complex(0, -1));
    approx.deepEqual(math.eval('exp(2 * pi * i)'),    complex(1, 0));
    approx.deepEqual(math.eval('exp(-0.5 * pi * i)'), complex(0, -1));
    approx.deepEqual(math.eval('exp(-1 * pi * i)'),   complex(-1, 0));
    approx.deepEqual(math.eval('exp(-1.5 * pi * i)'), complex(0, 1));
  });

  it('should throw an error on a unit', function() {
    assert.throws(function () {exp(unit('5cm'))});
  });

  it('should throw an error with a string', function() {
    assert.throws(function () {exp('text')});
  });

  it('should exponentiate matrices, arrays and ranges correctly', function() {
    var res = [1, 2.71828182845905, 7.38905609893065, 20.0855369231877];
    approx.deepEqual(exp([0,1,2,3]), res);
    approx.deepEqual(exp(range('0:4')), res);
    approx.deepEqual(exp(matrix([0,1,2,3])), matrix(res));
    approx.deepEqual(exp(matrix([[0,1],[2,3]])),
        matrix([[1, 2.71828182845905], [7.38905609893065, 20.0855369231877]]));
  });


});