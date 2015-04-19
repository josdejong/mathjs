// test fix
var assert = require('assert'),
    error = require('../../../lib/error/index'),
    approx = require('../../../tools/approx'),
    math = require('../../../index'),
    bignumber = math.bignumber,
    complex = math.complex,
    matrix = math.matrix,
    unit = math.unit,
    range = math.range,
    fix = math.fix;

describe('fix', function() {
  it('should round booleans correctly', function () {
    assert.equal(fix(true), 1);
    assert.equal(fix(false), 0);
  });

  it('should round null', function () {
    assert.equal(math.ceil(null), 0);
  });

  it('should round numbers correctly', function() {
    approx.equal(fix(0), 0);
    approx.equal(fix(1), 1);
    approx.equal(fix(1.3), 1);
    approx.equal(fix(1.8), 1);
    approx.equal(fix(2), 2);
    approx.equal(fix(-1), -1);
    approx.equal(fix(-1.3), -1);
    approx.equal(fix(-1.8), -1);
    approx.equal(fix(-2), -2);
    approx.equal(fix(-2.1), -2);
    approx.deepEqual(fix(math.pi), 3);
  });

  it('should round big numbers correctly', function() {
    assert.deepEqual(fix(bignumber(0)), bignumber(0));
    assert.deepEqual(fix(bignumber(1)), bignumber(1));
    assert.deepEqual(fix(bignumber(1.3)), bignumber(1));
    assert.deepEqual(fix(bignumber(1.8)), bignumber(1));
    assert.deepEqual(fix(bignumber(2)), bignumber(2));
    assert.deepEqual(fix(bignumber(-1)), bignumber(-1));
    assert.deepEqual(fix(bignumber(-1.3)), bignumber(-1));
    assert.deepEqual(fix(bignumber(-1.8)), bignumber(-1));
    assert.deepEqual(fix(bignumber(-2)), bignumber(-2));
    assert.deepEqual(fix(bignumber(-2.1)), bignumber(-2));
  });

  it('should round complex numbers correctly', function() {
    // complex
    approx.deepEqual(fix(complex(0, 0)), complex(0, 0));
    approx.deepEqual(fix(complex(1.3, 1.8)), complex(1, 1));
    approx.deepEqual(fix(math.i), complex(0, 1));
    approx.deepEqual(fix(complex(-1.3, -1.8)), complex(-1, -1));
  });

  it('should throw an error on unit as parameter', function() {
    // unit
    assert.throws(function () {fix(unit('5cm'))}, TypeError, 'Function fix(unit) not supported');
  });

  it('should throw an error on string as parameter', function() {
    // string
    assert.throws(function () {fix('hello world')}, TypeError, 'Function fix(string) not supported');
  });

  it('should correctly round all values of a matrix element-wise', function() {
    // matrix, array, range
    approx.deepEqual(fix([1.2, 3.4, 5.6, 7.8, 10.0]), [1, 3, 5, 7, 10]);
    approx.deepEqual(fix(matrix([1.2, 3.4, 5.6, 7.8, 10.0])), matrix([1, 3, 5, 7, 10]));
  });

  it('should throw an error in case of invalid number of arguments', function() {
    assert.throws(function () {fix()}, error.ArgumentsError);
    assert.throws(function () {fix(1, 2)}, error.ArgumentsError);
  });

  it('should LaTeX fix', function () {
    var expression = math.parse('fix(0.6)');
    assert.equal(expression.toTex(), '\\mathrm{fix}\\left(0.6\\right)');
  });

});
