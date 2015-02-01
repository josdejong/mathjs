var assert = require('assert'),
    error = require('../../../lib/error/index'),
    math = require('../../../index'),
    approx = require('../../../tools/approx'),
    pi = math.pi,
    complex = math.complex,
    matrix = math.matrix,
    unit = math.unit,
    csch = math.csch;

describe('csch', function() {
  it('should return the csch of a boolean', function () {
    approx.equal(csch(true), 0.85091812823932);
    approx.equal(csch(false), Number.NaN);
  });

  it('should return the csch of null', function () {
    approx.equal(csch(null), Number.NaN);
  });

  it('should return the csch of a number', function() {
    approx.equal(csch(0), Number.NaN);
    approx.equal(csch(pi), 0.086589537530047);
    approx.equal(csch(1), 0.85091812823932);
    approx.equal(csch(2), 0.27572056477178);
    approx.equal(csch(3), 0.099821569668823);
    approx.equal(csch(1e-22), Number.POSITIVE_INFINITY);
    approx.equal(csch(-1e-22), Number.NEGATIVE_INFINITY);
  });

  it('should return the csch of a bignumber (downgrades to number)', function() {
    approx.equal(csch(math.bignumber(1)), 0.85091812823932);
  });

  it('should return the csch of a complex number', function() {
    approx.deepEqual(csch(complex('1')), complex(0.85091812823932, 0));
    approx.deepEqual(csch(complex('i')), complex(0, -1.1883951057781));
    approx.deepEqual(csch(complex('2 + i')), complex(0.14136302161241, -0.22837506559969));
  });

  it('should return the csch of an angle', function() {
    approx.equal(csch(unit('90deg')), 0.4345372080947);
    approx.equal(csch(unit('-45deg')), -1.1511838709208);
  });

  it('should throw an error if called with an invalid unit', function() {
    assert.throws(function () {csch(unit('5 celsius'))});
  });

  it('should throw an error if called with a string', function() {
    assert.throws(function () {csch('string')});
  });

  var csch123 = [0.85091812823932, 0.27572056477178, 0.099821569668823];

  it('should return the csch of each element of an array', function() {
    approx.deepEqual(csch([1,2,3]), csch123);
  });

  it('should return the csch of each element of a matrix', function() {
    approx.deepEqual(csch(matrix([1,2,3])), matrix(csch123));
  });

  it('should throw an error in case of invalid number of arguments', function() {
    assert.throws(function () {csch()}, error.ArgumentsError);
    assert.throws(function () {csch(1, 2)}, error.ArgumentsError);
  });
});
