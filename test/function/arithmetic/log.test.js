// test exp
var assert = require('assert'),
    approx = require('../../../tools/approx'),
    math = require('../../../index')(),
    complex = math.complex,
    matrix = math.matrix,
    unit = math.unit,
    range = math.range,
    log = math.log;

describe('log', function() {
  it('should return the log of a boolean value', function () {
    assert.equal(log(true), 0);
    assert.equal(log(false), -Infinity);
  });

  it('should return the log of a number', function() {
    approx.deepEqual(log(-3), complex('1.098612288668110 + 3.141592653589793i'));
    approx.deepEqual(log(-2), complex('0.693147180559945 + 3.141592653589793i'));
    approx.deepEqual(log(-1), complex('0.000000000000000 + 3.141592653589793i'));
    approx.deepEqual(log(0), -Infinity);
    approx.deepEqual(log(1), 0);
    approx.deepEqual(log(2), 0.693147180559945);
    approx.deepEqual(log(3), 1.098612288668110);
    approx.deepEqual(math.exp(log(100)), 100);
  });

  it('should return the log base N of a number', function() {
    approx.deepEqual(log(100, 10), 2);
    approx.deepEqual(log(1000, 10), 3);
    approx.deepEqual(log(8, 2), 3);
    approx.deepEqual(log(16, 2), 4);
  });

  it('should throw an error if invalid number of arguments', function() {
    assert.throws(function () {log()}, math.error.ArgumentsError, 'Wrong number of arguments in function log (0 provided, 1-2 expected)');
    assert.throws(function () {log(1, 2, 3)}, math.error.ArgumentsError, 'Wrong number of arguments in function log (3 provided, 1-2 expected)');
  });

  it('should return the log of a bignumber', function() {
    approx.deepEqual(log(math.bignumber(2)), 0.693147180559945);
    approx.deepEqual(log(math.bignumber(3)), 1.098612288668110);

  });

  it('should return the log of a complex number', function() {
    approx.deepEqual(log(math.i),          complex('1.570796326794897i'));
    approx.deepEqual(log(complex(0, -1)),  complex('-1.570796326794897i'));
    approx.deepEqual(log(complex(1, 1)),   complex('0.346573590279973 + 0.785398163397448i'));
    approx.deepEqual(log(complex(1, -1)),  complex('0.346573590279973 - 0.785398163397448i'));
    approx.deepEqual(log(complex(-1, -1)), complex('0.346573590279973 - 2.356194490192345i'));
    approx.deepEqual(log(complex(-1, 1)),  complex('0.346573590279973 + 2.356194490192345i'));
    approx.deepEqual(log(complex(1, 0)),   complex(0, 0));
  });

  it('should throw an error when used on a unit', function() {
    assert.throws(function () {log(unit('5cm'))});
  });

  it('should throw an error when used on a string', function() {
    assert.throws(function () {log('text')});
  });

  it('should return the log of each element of a matrix', function() {
    var res = [0, 0.693147180559945, 1.098612288668110, 1.386294361119891];
    approx.deepEqual(log([1,2,3,4]), res);
    approx.deepEqual(log(matrix([1,2,3,4])), matrix(res));
    approx.deepEqual(log(matrix([[1,2],[3,4]])),
        matrix([[0, 0.693147180559945], [1.098612288668110, 1.386294361119891]]));
  });

});