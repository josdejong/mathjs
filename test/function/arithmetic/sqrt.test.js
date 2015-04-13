// test sqrt
var assert = require('assert'),
    approx = require('../../../tools/approx'),
    error = require('../../../lib/error/index'),
    math = require('../../../index'),
    sqrt = math.sqrt,
    bignumber = math.bignumber;

describe('sqrt', function() {
  it('should return the square root of a boolean', function () {
    assert.equal(sqrt(true), 1);
    assert.equal(sqrt(false), 0);
  });

  it('should return the square root of null', function () {
    assert.equal(sqrt(null), 0);
  });

  it('should return the square root of a positive number', function() {
    assert.equal(sqrt(0), 0);
    assert.equal(sqrt(1), 1);
    assert.equal(sqrt(4), 2);
    assert.equal(sqrt(9), 3);
    assert.equal(sqrt(16), 4);
    assert.equal(sqrt(25), 5);
  });

  it('should return the square root of a negative number', function() {
    assert.deepEqual(sqrt(-4), math.complex(0, 2));
    assert.deepEqual(sqrt(-16), math.complex(0, 4));
  });

  it('should return the square root of a positive bignumber', function() {
    assert.deepEqual(sqrt(bignumber(0)), bignumber(0));
    assert.deepEqual(sqrt(bignumber(1)), bignumber(1));
    assert.deepEqual(sqrt(bignumber(4)), bignumber(2));
    assert.deepEqual(sqrt(bignumber(9)), bignumber(3));
    assert.deepEqual(sqrt(bignumber(16)), bignumber(4));
    assert.deepEqual(sqrt(bignumber(25)), bignumber(5));

    // validate whether we are really working at high precision
    var bigmath = math.create({precision: 100});
    assert.deepEqual(bigmath.sqrt(bigmath.bignumber(2)), bigmath.bignumber('1.414213562373095048801688724209698078569671875376948073176679737990732478462107038850387534327641573'));
  });

  it('should return the square root of a negative bignumber', function() {
    assert.deepEqual(sqrt(bignumber(-4)), math.complex(0, 2));
  });

  it('should return the square root of a complex number', function() {
    assert.deepEqual(sqrt(math.complex(3, -4)), math.complex(2, -1));
    assert.deepEqual(sqrt(math.complex(1e10, 1e-10)), math.complex(1e5, 5e-16));
  });

  it('should throw an error when used with a unit', function() {
    assert.throws(function () {
      sqrt(math.unit(5, 'km'));
    });
  });

  it('should throw an error when used with a string', function() {
    assert.throws(function () {
      sqrt('a string');
    });
  });

  it('should return the square root of each element of a matrix', function() {
    assert.deepEqual(sqrt([4,9,16,25]), [2,3,4,5]);
    assert.deepEqual(sqrt([[4,9],[16,25]]), [[2,3],[4,5]]);
    assert.deepEqual(sqrt(math.matrix([[4,9],[16,25]])), math.matrix([[2,3],[4,5]]));
  });

  it('should throw an error in case of invalid number of arguments', function() {
    assert.throws(function () {sqrt()}, error.ArgumentsError);
    assert.throws(function () {sqrt(1, 2)}, error.ArgumentsError);
  });

  it('should LaTeX sqrt', function () {
    var expression = math.parse('sqrt(2)');
    assert.equal(expression.toTex(), '\\sqrt{2}');
  });

});
