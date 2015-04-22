// test dotDivide (element-wise divide)
var assert = require('assert'),
    math = require('../../../index'),
    error = require('../../../lib/error/index'),
    approx = require('../../../tools/approx'),
    dotDivide = math.dotDivide,
    complex = math.complex;

describe('dotDivide', function() {
  it('should divide two numbers', function() {
    assert.equal(dotDivide(4, 2), 2);
    assert.equal(dotDivide(-4, 2), -2);
    assert.equal(dotDivide(4, -2), -2);
    assert.equal(dotDivide(-4, -2), 2);
    assert.equal(dotDivide(4, 0), Infinity);
    assert.equal(dotDivide(0, -5), 0);
    assert.ok(isNaN(dotDivide(0, 0)));
  });

  it('should divide booleans', function() {
    assert.equal(dotDivide(true, true), 1);
    assert.equal(dotDivide(true, false), Infinity);
    assert.equal(dotDivide(false, true), 0);
    assert.ok(isNaN(dotDivide(false, false)));
  });

  it('should add mixed numbers and booleans', function() {
    assert.equal(dotDivide(2, true), 2);
    assert.equal(dotDivide(2, false), Infinity);
    approx.equal(dotDivide(true, 2), 0.5);
    assert.equal(dotDivide(false, 2), 0);
  });

  it('should divide numbers and null', function () {
    assert.equal(dotDivide(1, null), Infinity);
    assert.equal(dotDivide(null, 1), 0);
  });

  it('should throw an error if there\'s wrong number of arguments', function() {
    assert.throws(function () {dotDivide(2,3,4); });
    assert.throws(function () {dotDivide(2); });
  });

  it('should divide two complex numbers', function() {
    approx.deepEqual(dotDivide(complex('2+3i'), 2), complex('1+1.5i'));
    approx.deepEqual(dotDivide(complex('2+3i'), complex('4i')), complex('0.75 - 0.5i'));
    approx.deepEqual(dotDivide(complex('2i'), complex('4i')), 0.5);
    approx.deepEqual(dotDivide(4, complex('1+2i')), complex('0.8 - 1.6i'));
  });

  it('should divide a unit by a number', function() {
    assert.equal(dotDivide(math.unit('5 m'), 10).toString(), '500 mm');
  });

  it('should throw an error if dividing a number by a unit', function() {
    assert.throws(function () {dotDivide(10, math.unit('5 m')).toString()});
  });

  it('should divide all the elements of a matrix by one number', function() {
    assert.deepEqual(dotDivide([2,4,6], 2), [1,2,3]);
    var a = math.matrix([[1,2],[3,4]]);
    assert.deepEqual(dotDivide(a, 2), math.matrix([[0.5,1],[1.5,2]]));
    assert.deepEqual(dotDivide(a.valueOf(), 2), [[0.5,1],[1.5,2]]);
    assert.deepEqual(dotDivide([], 2), []);
    assert.deepEqual(dotDivide([], 2), []);
  });

  it('should divide 1 over a matrix element-wise', function() {
    approx.deepEqual(math.format(dotDivide(1, [
      [ 1, 4,  7],
      [ 3, 0,  5],
      [-1, 9, 11]
    ])), math.format([
      [ 1, 0.25, 1/7],
      [ 1/3,  Infinity,  0.2],
      [-1,  1/9,  1/11]
    ]));
  });

  it('should perform matrix element-wise matrix division', function() {
    a = math.matrix([[1,2],[3,4]]);
    b = math.matrix([[5,6],[7,8]]);
    assert.deepEqual(dotDivide(a, b), math.matrix([[1/5, 2/6], [3/7,4/8]]));
  });

  it('should throw an error when dividing element-wise by a matrix with differing size', function() {
    assert.throws(function () {dotDivide(a, [[1]])});
  });

  it('should LaTeX dotDivide', function () {
    var expression = math.parse('dotDivide([1,2],[3,4])');
    assert.equal(expression.toTex(), '\\left(\\begin{bmatrix}1\\\\2\\\\\\end{bmatrix}.:\\begin{bmatrix}3\\\\4\\\\\\end{bmatrix}\\right)');
  });

});
