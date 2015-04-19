var assert = require('assert'),
    error = require('../../../lib/error/index'),
    approx = require('../../../tools/approx'),
    math = require('../../../index');

describe('det', function() {

  it('should calculate correctly the determinant of a NxN matrix', function() {
    assert.equal(math.det([5]), 5);
    assert.equal(math.det([[1,2],[3,4]]), -2);
    assert.equal(math.det(math.matrix([[1,2],[3,4]])), -2);
    approx.equal(math.det([
      [-2, 2,  3],
      [-1, 1,  3],
      [ 2, 0, -1]
    ]), 6);
    approx.equal(math.det([
      [ 1, 4,  7],
      [ 3, 0,  5],
      [-1, 9, 11]
    ]), -8);
    approx.equal(math.det([
      [1,7,4,3,7], 
      [0,7,0,3,7], 
      [0,7,4,3,0], 
      [1,7,5,9,7], 
      [2,7,4,3,7]
    ]), -1176);
    approx.equal(math.det(math.diag([4,-5,6])), -120);
  });

  it('should return 1 for the identity matrix',function() {
    assert.equal(math.det(math.eye(7)), 1);
    assert.equal(math.det(math.eye(2)), 1);
    assert.equal(math.det(math.eye(1)), 1);
  });

  it('should return 0 for a singular matrix',function() {
    assert.equal(math.det([
      [1, 0],
      [0, 0]
    ]), 0);
    assert.equal(math.det([
      [1, 0],
      [1, 0]
    ]), 0);
    assert.equal(math.det([
      [2, 6],
      [1, 3]
    ]), 0);
    assert.equal(math.det([
      [1, 0, 0],
      [0, 0, 0],
      [1, 0, 0]
    ]), 0);
  });

  it('should calculate the determinant for a scalar',function() {
    assert.equal(math.det(7), 7);

    var c1 = math.complex(2, 3);
    var c2 = math.det(c1);
    assert.deepEqual(c1, c2);

    // c2 should be a clone
    c1.re = 0;
    assert.equal(c1.re, 0);
    assert.equal(c2.re, 2);
  });

  it('should calculate the determinant for a 1x1 matrix',function() {
    var c1 = math.complex(2, 3);
    var c2 = math.det([[c1]]);
    assert.deepEqual(c1, c2);

    // c2 should be a clone
    c1.re = 0;
    assert.equal(c1.re, 0);
    assert.equal(c2.re, 2);
  });

  it('should calculate correctly the determinant of a matrix with bignumbers', function() {
    var bignumber = math.bignumber;

    // 1x1
    assert.deepEqual(math.det([bignumber(5)]), bignumber(5));

    // 2x2
    assert.deepEqual(math.det([
      [bignumber(1), bignumber(2)],
      [bignumber(3), bignumber(4)]
    ]), bignumber(-2));

    // 3x3
    assert.deepEqual(math.det([
      [bignumber(-2), bignumber(2), bignumber( 3)],
      [bignumber(-1), bignumber(1), bignumber( 3)],
      [bignumber( 2), bignumber(0), bignumber(-1)]
    ]), bignumber(6));

    // the following would fail with regular Numbers due to a precision overflow
    assert.deepEqual(math.det([
      [bignumber(1e10+1), bignumber(1e10)],
      [bignumber(1e10), bignumber(1e10-1)]
    ]), bignumber(-1));
  });

  it('should calculate the determinant of a matrix with mixed numbers and bignumbers', function() {
    var bignumber = math.bignumber;
    assert.deepEqual(math.det([
      [1, bignumber(2)],
      [bignumber(3), 4]
    ]), bignumber(-2));
  });

  it('should not change the value of the initial matrix', function() {
    var m_test = [[1,2,3],[4,5,6],[7,8,9]];
    math.det(m_test);
    assert.deepEqual(m_test, [[1,2,3],[4,5,6],[7,8,9]]);
  });

  it('should not accept a non-square matrix', function() {
    assert.throws(function() { math.det([1,2]); });
    assert.throws(function() { math.det([[1,2,3],[1,2,3]]); });
    assert.throws(function() { math.det([0,1],[0,1],[0,1]); });
  });

  it('should not accept arrays with dimensions higher than 2', function() {
    assert.throws(function() { math.det([[[1]]]); }, RangeError);
    assert.throws(function() { math.det(math.matrix([[[1]]])); }, RangeError);
  });

  it('should LaTeX det', function () {
    var expression = math.parse('det([1])');
    assert.equal(expression.toTex(), '\\det\\left(\\begin{bmatrix}1\\\\\\end{bmatrix}\\right)');
  });

});
