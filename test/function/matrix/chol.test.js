var assert = require('assert'),
    error = require('../../../lib/error/index'),
    math = require('../../../index'),
    matrix = math.matrix,
    chol = math.chol,
    bignumber = math.bignumber,
    BigNumber = math.type.BigNumbers;

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

  it('should throws exception if not a NxN array or matrix', function () {
    assert.throws(function() { chol([[1,2],[3,4],[5,6]], 'lower');});
  });
  
  it('should produce a lower or upper triangular array or matrix', function () {
    assert.deepEqual(chol(a, 'lower'), b);
    assert.deepEqual(chol(A, 'lower'), B);
  });

  it('should produce a lower or upper triangular array or matrix', function () {
    assert.deepEqual(chol(a, 'lower'), b);
    assert.deepEqual(chol(A, 'lower'), B);
  });
  
  var biga = bignumber([ [1, 2], [2, 13] ]),
    bigb = bignumber([ [1, 0], [2, 3] ]),
    chola = chol(biga, 'lower');
  
  var z = math.multiply(chola, math.transpose(chola));

  it('should get R*R\' === A with bignumber', function () {
    for(var i=0;i<z.length;i++){
      for(var j=0;j<z[i].length;j++){
        assert.equal(bigb[i][j].toString(), chola[i][j].valueOf());
      }
    }
  });

});