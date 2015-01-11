var assert = require('assert'),
    error = require('../../../lib/error/index'),
    math = require('../../../index'),
    matrix = math.matrix,
    chol = math.chol;

describe('chol', function() {
  
  var a = [ [16, 4, 4, -4],
            [4, 10, 4, 2],
            [4, 4, 6, -2],
            [-4, 2, -2, 4] ],
    b = [ [4, 0, 0, 0],
            [1, 3, 0, 0],
            [1, 1, 2, 0],
            [-1, 1, -1, 1] ];
  var A = matrix(a),
    B = matrix(b);

  it('should produce a lower or upper triangular array or matrix', function () {
    assert.deepEqual(chol(a, 'lower'), b);
    assert.deepEqual(chol(A, 'lower'), B);
  });

  it('should produce a lower or upper triangular array or matrix', function () {
    assert.deepEqual(chol(a), b);
    assert.deepEqual(chol(A, 'lower'), B);
  });

});