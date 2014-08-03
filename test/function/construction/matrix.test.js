// test matrix construction
var assert = require('assert'),
    error = require('../../../lib/error/index'),
    math = require('../../../index'),
    matrix = math.matrix;

describe('matrix', function() {

  it('should create an empty matrix with one dimension if called without argument', function() {
    var a = matrix();
    assert.ok(a instanceof math.type.Matrix);
    assert.deepEqual(math.size(a), matrix([0])); // TODO: wouldn't it be nicer if an empty matrix has zero dimensions?
  });

  it('should create a matrix from an array', function() {
    var b = matrix([[1,2],[3,4]]);
    assert.ok(b instanceof math.type.Matrix);
    assert.deepEqual(b, new math.type.Matrix([[1,2],[3,4]]));
    assert.deepEqual(math.size(b), matrix([2,2]));
  });

  it('should be the identity if called with a matrix', function() {
    var b = matrix([[1,2],[3,4]]);
    var c = matrix(b);
    assert.ok(c._data != b._data); // data should be cloned
    assert.deepEqual(c, new math.type.Matrix([[1,2],[3,4]]));
    assert.deepEqual(math.size(c), matrix([2,2]));
  });

  it('should create a matrix from a range correctly', function() {
    var d = matrix(math.range(1,6));
    assert.ok(d instanceof math.type.Matrix);
    assert.deepEqual(d, new math.type.Matrix([1,2,3,4,5]));
    assert.deepEqual(math.size(d), matrix([5]));
  });

  it('should throw an error if called with a single number', function() {
    assert.throws(function () {matrix(123)}, TypeError);
  });

  it('should throw an error if called with a unit', function() {
    assert.throws(function () {matrix(math.unit('5cm'))}, TypeError);
  });

  it('should throw an error if called with 2 numbers', function() {
    assert.throws(function () {matrix(2, 3)}, error.ArgumentsError);
  });

});