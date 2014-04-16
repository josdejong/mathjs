// test edivide (element-wise divide)
var assert = require('assert'),
    math = require('../../../index')(),
    error = require('../../../lib/error/index'),
    approx = require('../../../tools/approx'),
    edivide = math.edivide,
    complex = math.complex;

describe('edivide', function() {
  it('should divide two numbers', function() {
    assert.equal(edivide(4, 2), 2);
    assert.equal(edivide(-4, 2), -2);
    assert.equal(edivide(4, -2), -2);
    assert.equal(edivide(-4, -2), 2);
    assert.equal(edivide(4, 0), Infinity);
    assert.equal(edivide(0, -5), 0);
    assert.ok(isNaN(edivide(0, 0)));
  });

  it('should divide booleans', function() {
    assert.equal(edivide(true, true), 1);
    assert.equal(edivide(true, false), Infinity);
    assert.equal(edivide(false, true), 0);
    assert.ok(isNaN(edivide(false, false)));
  });

  it('should add mixed numbers and booleans', function() {
    assert.equal(edivide(2, true), 2);
    assert.equal(edivide(2, false), Infinity);
    approx.equal(edivide(true, 2), 0.5);
    assert.equal(edivide(false, 2), 0);
  });

  it('should throw an error if there\'s wrong number of arguments', function() {
    assert.throws(function () {edivide(2,3,4); });
    assert.throws(function () {edivide(2); });
  });

  it('should divide two complex numbers', function() {
    approx.deepEqual(edivide(complex('2+3i'), 2), complex('1+1.5i'));
    approx.deepEqual(edivide(complex('2+3i'), complex('4i')), complex('0.75 - 0.5i'));
    approx.deepEqual(edivide(complex('2i'), complex('4i')), 0.5);
    approx.deepEqual(edivide(4, complex('1+2i')), complex('0.8 - 1.6i'));
  });

  it('should divide a unit by a number', function() {
    assert.equal(edivide(math.unit('5 m'), 10).toString(), '500 mm');
  });

  it('should throw an error if dividing a number by a unit', function() {
    assert.throws(function () {edivide(10, math.unit('5 m')).toString()});
  });

  it('should divide all the elements of a matrix by one number', function() {
    assert.deepEqual(edivide([2,4,6], 2), [1,2,3]);
    var a = math.matrix([[1,2],[3,4]]);
    assert.deepEqual(edivide(a, 2), math.matrix([[0.5,1],[1.5,2]]));
    assert.deepEqual(edivide(a.valueOf(), 2), [[0.5,1],[1.5,2]]);
    assert.deepEqual(edivide([], 2), []);
    assert.deepEqual(edivide([], 2), []);
  });

  it('should divide 1 over a matrix element-wise', function() {
    approx.deepEqual(math.format(edivide(1, [
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
    assert.deepEqual(edivide(a, b), math.matrix([[1/5, 2/6], [3/7,4/8]]));
  });

  it('should throw an error when dividing element-wise by a matrix with differing size', function() {
    assert.throws(function () {edivide(a, [[1]])});
  });

});
