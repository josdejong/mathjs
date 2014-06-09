// test dotmultiply (element-wise multiply)
var assert = require('assert'),
    math = require('../../../index')(),
    approx = require('../../../tools/approx'),
    error = require('../../../lib/error/index'),
    dotmultiply = math.dotmultiply,
    divide = math.divide,
    matrix = math.matrix,
    complex = math.complex,
    range = math.range,
    i = math.i,
    unit = math.unit;

describe('dotmultiply', function() {

  it('should multiply 2 numbers', function() {
    // number
    approx.equal(dotmultiply(2, 3), 6);
    approx.equal(dotmultiply(-2, 3), -6);
    approx.equal(dotmultiply(-2, -3), 6);
    approx.equal(dotmultiply(5, 0), 0);
    approx.equal(dotmultiply(0, 5), 0);
  });

  it('should multiply booleans', function() {
    assert.equal(dotmultiply(true, true), 1);
    assert.equal(dotmultiply(true, false), 0);
    assert.equal(dotmultiply(false, true), 0);
    assert.equal(dotmultiply(false, false), 0);
  });

  it('should multiply mixed numbers and booleans', function() {
    assert.equal(dotmultiply(2, true), 2);
    assert.equal(dotmultiply(2, false), 0);
    assert.equal(dotmultiply(true, 2), 2);
    assert.equal(dotmultiply(false, 2), 0);
  });

  it('should multiply 2 complex numbers', function() {
    // complex
    approx.deepEqual(dotmultiply(complex(2, 3), 2), complex(4, 6));
    approx.deepEqual(dotmultiply(complex(2, -3), 2), complex(4, -6));
    approx.deepEqual(dotmultiply(complex(0, 1), complex(2, 3)), complex(-3, 2));
    approx.deepEqual(dotmultiply(complex(2, 3), complex(2, 3)), complex(-5, 12));
    approx.deepEqual(dotmultiply(2, complex(2, 3)), complex(4, 6));
    approx.deepEqual(divide(complex(-5, 12), complex(2, 3)), complex(2, 3));
  });

  it('should multiply a unit by a number', function() {
    // unit
    assert.equal(dotmultiply(2, unit('5 mm')).toString(), '10 mm');
    assert.equal(dotmultiply(2, unit('5 mm')).toString(), '10 mm');
    assert.equal(dotmultiply(unit('5 mm'), 2).toString(), '10 mm');
    assert.equal(dotmultiply(unit('5 mm'), 0).toString(), '0 m');
  });

  it('should throw an error with strings', function() {
    // string
    assert.throws(function () {dotmultiply("hello", "world")});
    assert.throws(function () {dotmultiply("hello", 2)});
  });

  var a = matrix([[1,2],[3,4]]);
  var b = matrix([[5,6],[7,8]]);
  var c = matrix([[5],[6]]);
  var d = matrix([[5,6]]);

  it('should multiply a all elements in a matrix by a number', function() {
    // matrix, array, range
    approx.deepEqual(dotmultiply(a, 3), matrix([[3,6],[9,12]]));
    approx.deepEqual(dotmultiply(3, a), matrix([[3,6],[9,12]]));
  });

  it('should perform element-wise matrix multiplication', function() {
    approx.deepEqual(dotmultiply(a, b), matrix([[5,12],[21,32]]));
    approx.deepEqual(dotmultiply([[1,2],[3,4]], [[5,6],[7,8]]), [[5,12],[21,32]]);
    approx.deepEqual(dotmultiply([1,2,3,4], 2), [2, 4, 6, 8]);
  });

  it('should throw an error if matrices are of different sizes', function() {
    assert.throws(function () {dotmultiply(a, c)});
    assert.throws(function () {dotmultiply(d, a)});
    assert.throws(function () {dotmultiply(d, b)});
    assert.throws(function () {dotmultiply(d, c)});
    assert.throws(function () {dotmultiply(c, b)});
  });

  it('should throw an error in case of invalid number of arguments', function() {
    assert.throws(function () {dotmultiply(1)}, error.ArgumentsError);
    assert.throws(function () {dotmultiply(1, 2, 3)}, error.ArgumentsError);
  });

});
