'use strict';

module.exports = function (math) {
  var util = require('../../util/index'),

    array = require('../../../lib/util/array'),
          
    BigNumber = math.type.BigNumber,
    Complex = require('../../type/Complex'),
    Matrix = require('../../type/Matrix'),
    collection = require('../../type/collection'),

    isNumber = util.number.isNumber,
    isBoolean = util['boolean'].isBoolean,
    isComplex = Complex.isComplex,
    isArray = Array.isArray;

  /**
   * Cholesky factorization math.chol(x, p). 
   *
   * The second parameter p is optional. If not provided, it defaults to 'upper'.
   *
   *  math.chol(A) produces an upper triangular R so that R'*R = A.
        If A is not positive definite, null is returned.
 
      math.chol(A, 'lower') produces a lower triangular L so that L*L' = A.
        If A is not positive definite, null is returned.
        
   * Reference: http://www.math.sjsu.edu/~foster/m143m/cholesky.pdf
   *
   * Syntax:
   *
   *    math.chol(x)
   *    math.chol(x, p)
   *
   * Examples:
   *
   *    var A = [[3, 3], [5, 8]];               // returns [[3, 3], [5, 8]]
   *    math.chol(A, 'lower');                  // returns [[ 1.7320508075688772, 0 ],
                                                //          [ 1.7320508075688776, 2.2360679774997894 ]]
   *
   *
   * See also:
   *
   *    inv
   *
   * @param  {Array | Matrix} x
   *            Array | Matrix to factor.
   * @param  {String} [p='upper']
   *            'upper' || 'lower', default is 'upper'
   * @return {Array | Matrix} the triangular matrix
   */
  math.chol = function chol(x, p) {
    var size = math.size(x);
    if (size.length !== 2 || size[0] !== size[1]) {
      throw new Error('chol require a nxn square matrix.');
    }
    var n = x.length, A;
    
    if (!p) { p = 'upper';}
    
    if (p === 'lower'){
      var ak, akk, Lk, lk, lkt;
      
      A = math.zeros([n, n]);
      A[0][0] = Math.sqrt(x[0][0]);
      
      for(var k=1; k<n; k++){
        if (k===1){
          ak = [[x[0][1]]];
          Lk = A[0][0];
        }
        else{
          ak = math.subset(x, math.index([0, k], k));
          Lk = math.subset(A, math.index([0, k], [0, k]));
        }

        akk = x[k][k];

        lk = math.multiply(math.inv(Lk), ak);
        lkt = math.transpose(lk);

        A[k][k] = math.sqrt(akk - math.multiply(lkt, lk));
        
        if (k===1){
          A[k][0] = lk[k-1][0];
        }
        else{
          for(var j=0; j<k; j++){
            A[k][j] = lkt[0][j];
          }
        }
      }
    }
    else if (p === 'upper'){
      A = math.transpose(math.chol(x, 'lower'));
    }
    
    return A;
  };
};
