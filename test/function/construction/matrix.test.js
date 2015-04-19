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

  it('should create empty matrix, dense format', function() {
    var a = matrix('dense');
    assert.ok(a instanceof math.type.Matrix);
    assert.deepEqual(math.size(a), matrix([0]));
  });
  
  it('should create empty matrix, ccs format', function() {
    var a = matrix('ccs');
    assert.ok(a instanceof math.type.Matrix);
  });
  
  it('should create empty matrix, crs format', function() {
    var a = matrix('crs');
    assert.ok(a instanceof math.type.Matrix);
  });
  
  it('should create a matrix from an array', function() {
    var b = matrix([[1,2],[3,4]]);
    assert.ok(b instanceof math.type.Matrix);
    assert.deepEqual(b, matrix([[1,2],[3,4]]));
    assert.deepEqual(math.size(b), matrix([2,2]));
  });

  it('should be the identity if called with a matrix, dense format', function() {
    var b = matrix([[1,2],[3,4]], 'dense');
    var c = matrix(b, 'dense');
    assert.ok(c._data != b._data); // data should be cloned
    assert.deepEqual(c, matrix([[1,2],[3,4]], 'dense'));
    assert.deepEqual(math.size(c), matrix([2,2], 'dense'));
  });
  
  it('should be the identity if called with a matrix, CCS format', function() {
    var b = matrix([[1,2],[3,4]], 'ccs');
    var c = matrix(b, 'ccs');
    assert.ok(c._values != b._values); // data should be cloned
    assert.deepEqual(c, matrix([[1,2],[3,4]], 'ccs'));
  });
  
  it('should be the identity if called with a matrix, CRS format', function() {
    var b = matrix([[1,2],[3,4]], 'crs');
    var c = matrix(b, 'crs');
    assert.ok(c._values != b._values); // data should be cloned
    assert.deepEqual(c, matrix([[1,2],[3,4]], 'crs'));
  });

  it('should create a matrix from a range correctly', function() {
    var d = matrix(math.range(1,6));
    assert.ok(d instanceof math.type.Matrix);
    assert.deepEqual(d, matrix([1,2,3,4,5]));
    assert.deepEqual(math.size(d), matrix([5]));
  });

  it('should throw an error if called with a single number', function() {
    assert.throws(function () { matrix(123); }, TypeError);
  });

  it('should throw an error if called with a unit', function() {
    assert.throws(function () { matrix(math.unit('5cm')); }, TypeError);
  });

  it('should throw an error if called with 3 numbers', function() {
    assert.throws(function () { matrix(2, 3, 4); }, error.ArgumentsError);
  });

  it('should throw an error when called with an invalid storage format', function () {
    assert.throws(function () { math.matrix([], 1); }, /format must be a string value/);
  });
  
  it('should throw an error when called with an unknown storage format', function () {
    assert.throws(function () { math.matrix([], '123'); }, /Unsupported matrix storage format: 123/);
  });

  it('should LaTeX matrix', function () {
    var expr1 = math.parse('matrix()');
    var expr2 = math.parse('matrix([1])');

    assert.equal(expr1.toTex(), '\\begin{bmatrix}\\end{bmatrix}');
    assert.equal(expr2.toTex(), '\\left(\\begin{bmatrix}1\\\\\\end{bmatrix}\\right)');
  });
});
