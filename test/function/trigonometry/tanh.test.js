var assert = require('assert'),
    error = require('../../../lib/error/index'),
    math = require('../../../index'),
    approx = require('../../../tools/approx'),
    pi = math.pi,
    complex = math.complex,
    matrix = math.matrix,
    unit = math.unit,
    tanh = math.tanh;

describe('tanh', function() {
  it('should return the tanh of a boolean', function () {
    approx.equal(tanh(true), 0.76159415595576);
    approx.equal(tanh(false), 0);
  });

  it('should return the tanh of null', function () {
    approx.equal(tanh(null), 0);
  });

  it('should return the tanh of a number', function() {
    approx.equal(tanh(0), 0);
    approx.equal(tanh(pi), 0.99627207622075);
    approx.equal(tanh(1), 0.76159415595576);
    approx.equal(tanh(2), 0.96402758007582);
    approx.equal(tanh(3), 0.99505475368673);
  });

  it('should return the tanh of a bignumber (downgrades to number)', function() {
    approx.equal(tanh(math.bignumber(1)), 0.76159415595576);
  });

  it('should return the tanh of a complex number', function() {
    approx.deepEqual(tanh(complex('1')), complex(0.76159415595576, 0));
    approx.deepEqual(tanh(complex('i')), complex(0, 1.5574077246549));
    approx.deepEqual(tanh(complex('2 + i')), complex(1.0147936161466, 0.033812826079897));
  });

  it('should return the tanh of an angle', function() {
    approx.equal(tanh(unit('90deg')), 0.91715233566727);
    approx.equal(tanh(unit('-45deg')), -0.65579420263267);
  });

  it('should throw an error if called with an invalid unit', function() {
    assert.throws(function () {tanh(unit('5 celsius'))});
  });

  it('should throw an error if called with a string', function() {
    assert.throws(function () {tanh('string')});
  });

  var tanh123 = [0.76159415595576, 0.96402758007582, 0.99505475368673];

  it('should return the tanh of each element of an array', function() {
    approx.deepEqual(tanh([1,2,3]), tanh123);
  });

  it('should return the tanh of each element of a matrix', function() {
    approx.deepEqual(tanh(matrix([1,2,3])), matrix(tanh123));
  });

  it('should throw an error in case of invalid number of arguments', function() {
    assert.throws(function () {tanh()}, error.ArgumentsError);
    assert.throws(function () {tanh(1, 2)}, error.ArgumentsError);
  });
});
