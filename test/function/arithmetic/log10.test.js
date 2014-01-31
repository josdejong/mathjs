// test exp
var assert = require('assert'),
    approx = require('../../../tools/approx'),
    math = require('../../../index')(),
    complex = math.complex,
    matrix = math.matrix,
    unit = math.unit,
    range = math.range,
    log10 = math.log10;

describe('log10', function() {
  it('should return the log base 10 of a boolean', function () {
    assert.equal(log10(true), 0);
    assert.equal(log10(false), -Infinity);
  });

  it('should return the log base 10 of a number', function() {
    approx.deepEqual(log10(-3), complex('0.477121254719662 + 1.364376353841841i'));
    approx.deepEqual(log10(-2), complex('0.301029995663981 + 1.364376353841841i'));
    approx.deepEqual(log10(-1), complex('0.000000000000000 + 1.364376353841841i'));
    approx.deepEqual(log10(0), -Infinity);
    approx.deepEqual(log10(1), 0);
    approx.deepEqual(log10(2), 0.301029995663981);
    approx.deepEqual(log10(3), 0.477121254719662);

    approx.deepEqual(log10(0.01), -2);
    approx.deepEqual(log10(0.1), -1);
    approx.deepEqual(log10(1), 0);
    approx.deepEqual(log10(10), 1);
    approx.deepEqual(log10(100), 2);
    approx.deepEqual(log10(1000), 3);
  });

  it('should return the log of a bignumber', function() {
    approx.deepEqual(log10(math.bignumber(2)), 0.301029995663981);
    approx.deepEqual(log10(math.bignumber(3)), 0.477121254719662);

  });

  it('should throw an error if used with a wrong number of arguments', function() {
    assert.throws(function () {log10()}, math.error.ArgumentsError, 'Wrong number of arguments in function log10 (0 provided, 1 expected)');
    assert.throws(function () {log10(1, 2)}, math.error.ArgumentsError, 'Wrong number of arguments in function log10 (2 provided, 1 expected)');
  });

  it('should return the log base 10 of a complex number', function() {
    approx.deepEqual(log10(complex(0, 1)),   complex('0.000000000000000 + 0.682188176920921i'));
    approx.deepEqual(log10(complex(0, -1)),  complex('0.000000000000000 - 0.682188176920921i'));
    approx.deepEqual(log10(complex(1, 1)),   complex('0.150514997831991 + 0.341094088460460i'));
    approx.deepEqual(log10(complex(1, -1)),  complex('0.150514997831991 - 0.341094088460460i'));
    approx.deepEqual(log10(complex(-1, -1)), complex('0.150514997831991 - 1.023282265381381i'));
    approx.deepEqual(log10(complex(-1, 1)),  complex('0.150514997831991 + 1.023282265381381i'));
    approx.deepEqual(log10(complex(1, 0)),   complex(0, 0));
  });

  it('should throw an error when used on a unit', function() {
    assert.throws(function () {log10(unit('5cm'))});
  });

  it('should throw an error when used on a string', function() {
    assert.throws(function () {log10('text')});
  });

  it('should return the log base 10 of each element of a matrix', function() {
    var res = [0, 0.301029995663981, 0.477121254719662, 0.602059991327962];
    approx.deepEqual(log10([1,2,3,4]), res);
    approx.deepEqual(log10(matrix([1,2,3,4])), matrix(res));
    approx.deepEqual(math.divide(log10(matrix([1,2,3,4])), math.LOG10E),
        matrix([0, 0.693147180559945, 1.098612288668110, 1.386294361119891]));
    approx.deepEqual(log10(matrix([[1,2],[3,4]])),
        matrix([[0, 0.301029995663981], [0.477121254719662, 0.602059991327962]]));
  });

});
