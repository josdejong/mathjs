// test vector construction
var assert = require('assert'),
    math = require('../../../index'),
    vector = math.vector;

describe('vector', function() {

  it('should create an empty vector if called without argument', function() {
    var a = vector();
    assert.ok(a instanceof math.type.Vector);
    assert.deepEqual(math.size(a), vector([0]));
  });

  it('should create empty vector, dense format', function() {
    var a = vector('dense');
    assert.ok(a instanceof math.type.Vector);
    assert.deepEqual(math.size(a), vector([0]));
  });

  it('should create a vector from an array', function() {
    var b = vector([1, 2, 3, 4]);
    assert.ok(b instanceof math.type.Vector);
    assert.deepEqual(b, vector([1, 2, 3, 4]));
    assert.deepEqual(math.size(b), vector([4]));
  });

  it('should be the identity if called with a vector, dense format', function() {
    var b = vector([1, 2, 3, 4], 'dense');
    var c = vector(b, 'dense');
    assert.ok(c._data != b._data); // data should be cloned
    assert.deepEqual(c, vector([1, 2, 3, 4], 'dense'));
  });

  it('should create a vector from a range correctly', function() {
    var d = vector(math.range(1,6));
    assert.ok(d instanceof math.type.Vector);
    assert.deepEqual(d, vector([1,2,3,4,5]));
    assert.deepEqual(math.size(d), vector([5]));
  });

  it('should throw an error if called with an invalid argument', function() {
    assert.throws(function () { vector(new Date()); }, TypeError);
  });

  it('should throw an error if called with a unit', function() {
    assert.throws(function () { vector(math.unit('5cm')); }, TypeError);
  });

  it('should throw an error if called with too many arguments', function() {
    assert.throws(function () {vector([], 3, 3);}, /TypeError: Too many arguments/);
  });

  it('should throw an error when called with an invalid storage format', function () {
    assert.throws(function () { math.vector([], 1); }, /Unsupported vector storage format: 1/);
  });

  it('should throw an error when called with an unknown storage format', function () {
    assert.throws(function () { math.vector([], '123'); }, /Unsupported vector storage format: 123/);
  });
});