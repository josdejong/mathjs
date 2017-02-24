// test resize
var assert = require('assert'),
    error = require('../../../lib/error/index'),
    math = require('../../../index'),
    Matrix = math.type.Matrix;

describe('reshape', function() {

  it('should reshape an array', function() {
    var array = [[0,1,2],[3,4,5]];
    assert.deepEqual(math.reshape(array, [3, 2]), [[0,1], [2,3], [4,5]]);
  });

  it('should reshape an array with bignumbers', function() {
    var zero = math.bignumber(0);
    var one = math.bignumber(1);
    var two = math.bignumber(2);
    var three = math.bignumber(3);
    var array = [zero, one, two, three];
    assert.deepEqual(math.reshape(array, [two, two]),
        [[zero,one], [two, three]]);
  });

  it('should reshape a matrix', function() {
    var matrix = math.matrix([[0,1,2],[3,4,5]]);
    assert.deepEqual(math.reshape(matrix, [3, 2]),
        math.matrix([[0,1], [2,3], [4,5]]));
    assert.deepEqual(math.reshape(matrix, math.matrix([3, 2])),
        math.matrix([[0,1], [2,3], [4,5]]));
  });

  it('should reshape a flat single-element array into multiple dimensions', function() {
    var array = [3];
    assert.deepEqual(math.reshape(array, [1, 1, 1]), [[[3]]]);
  });

  it('should reshape a vector into a 2d matrix', function() {
    var math2 = math.create({matrix: 'Array'});
    assert.deepEqual(math2.reshape([1,2,3,4,5,6], [3,2]), [[1, 2], [3, 4], [5, 6]]);
  });

  it('should reshape 2d matrix into a vector', function() {
    var math2 = math.create({matrix: 'Array'});
    assert.deepEqual(math2.reshape([[1,2],[3,4],[5,6]], [6]), [1,2,3,4,5,6]);
  });

  it('should throw an error on invalid arguments', function() {
    assert.throws(function () {math.reshape()}, /Too few arguments/);
    assert.throws(function () {math.reshape([])}, /Too few arguments/);
    assert.throws(function () {math.reshape([], 2)}, TypeError);
    assert.throws(function () {math.reshape([], [], 4)}, /Too many arguments/);

    assert.throws(function () {math.reshape([], ['no number'])}, /Invalid size/);
    assert.throws(function () {math.reshape([], [2.3])}, /Invalid size/);

    assert.throws(function () {math.reshape([1, 2], [])}, error.DimensionError);
    assert.throws(function () {math.reshape([1, 2], [0])}, error.DimensionError);
    assert.throws(function () {math.reshape([1, 2], [0,0])}, error.DimensionError);
    assert.throws(function () {math.reshape([[1, 2]], [0])}, error.DimensionError);
    assert.doesNotThrow(function () {math.reshape([[1, 2]], [2,1])});
    assert.doesNotThrow(function () {math.reshape([[1, 2]], [2])});
  });

  it('should LaTeX resize', function () {
    var expression = math.parse('reshape([1,2],1)');
    assert.equal(expression.toTex(), '\\mathrm{reshape}\\left(\\begin{bmatrix}1\\\\2\\\\\\end{bmatrix},1\\right)');
  });
});

