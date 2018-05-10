'use strict';

var format = require('../../utils/string').format;

function factory (type, config, load, typed) {

  var abs = load(require('../arithmetic/abs'));
  var add = load(require('../arithmetic/add'));
  var eye = load(require('./eye'));
  var inv = load(require('./inv'));
  var multiply = load(require('../arithmetic/multiply'));

  var SparseMatrix = type.SparseMatrix;

  /**
   * Compute the matrix exponential, expm(A) = e^A. The matrix must be square.
   * Not to be confused with exp(a), which performs element-wise
   * exponentiation.
   *
   * The exponential is calculated using the Padé approximant with scaling and
   * squaring; see "Nineteen Dubious Ways to Compute the Exponential of a
   * Matrix," by Moler and Van Loan.
   *
   * Syntax:
   *
   *     math.expm(x)
   *
   * Examples:
   *
   *     var A = [[0,2],[0,0]]
   *     math.expm(A);        // returns [[1,2],[0,1]]
   *
   * See also:
   *
   *     exp
   *
   * @param {Matrix} x  A square Matrix
   * @return {Matrix}   The exponential of x
   */
  var expm = typed('expm', {

    'Matrix': function (A) {

      // Check matrix size
      var size = A.size();
      
      if(size.length !== 2 || size[0] !== size[1]) {
        throw new RangeError('Matrix must be square ' +
          '(size: ' + format(size) + ')');
      }
      
      var n = size[0];

      // Desired accuracy of the approximant (The actual accuracy
      // will be affected by round-off error)
      var eps = 1e-15;
      
      // The Padé approximant is not so accurate when the values of A
      // are "large", so scale A by powers of two. Then compute the
      // exponential, and square the result repeatedly according to
      // the identity e^A = (e^(A/m))^m 
      
      // Compute infinity-norm of A, ||A||, to see how "big" it is
      var infNorm = infinityNorm(A);
      
      // Find the optimal scaling factor and number of terms in the 
      // Padé approximant to reach the desired accuracy
      var params = findParams(infNorm, eps);
      var q = params.q;
      var j = params.j;
      
      // The Pade approximation to e^A is:
      // Rqq(A) = Dqq(A) ^ -1 * Nqq(A)
      // where
      // Nqq(A) = sum(i=0, q, (2q-i)!p! / [ (2q)!i!(q-i)! ] A^i
      // Dqq(A) = sum(i=0, q, (2q-i)!q! / [ (2q)!i!(q-i)! ] (-A)^i
     
      // Scale A by 1 / 2^j
      var Apos = multiply(A, Math.pow(2, -j));
     
      // The i=0 term is just the identity matrix
      var N = eye(n);
      var D = eye(n);
     
      // Initialization (i=0)
      var factor = 1;
     
      // Initialization (i=1)
      var Apos_to_i = Apos; // Cloning not necessary
      var alternate = -1;
     
      for(var i=1; i<=q; i++) {
        if(i>1) {
          Apos_to_i = multiply(Apos_to_i, Apos);
          alternate = -alternate;
        }
        factor = factor*(q-i+1)/((2*q-i+1)*i);
        
        N = add(N, multiply(factor, Apos_to_i));
        D = add(D, multiply(factor*alternate, Apos_to_i));
      }
      
      var R = multiply(inv(D), N);      
      
      // Square j times
      for(var i=0; i<j; i++) {
        R = multiply(R, R);
      }

      return type.isSparseMatrix(A)
          ? new SparseMatrix(R)
          : R;
    }
    
  });
  
  function infinityNorm(A) {
    var n = A.size()[0];  
    var infNorm = 0;  
    for(var i=0; i<n; i++) {
      var rowSum = 0;
      for(var j=0; j<n; j++) {
        rowSum += abs(A.get([i,j]));
      }
      infNorm = Math.max(rowSum, infNorm);
    }
    return infNorm;
  }

  /**
   * Find the best parameters for the Pade approximant given
   * the matrix norm and desired accuracy. Returns the first acceptable
   * combination in order of increasing computational load.
   */
  function findParams(infNorm, eps) {
    var maxSearchSize = 30;
    for(var k=0; k<maxSearchSize; k++) {
      for(var q=0; q<=k; q++) {
        var j = k - q;
        if(errorEstimate(infNorm, q, j) < eps) {
          return {q: q, j: j};
        }
      }
    }
    throw new Error("Could not find acceptable parameters to compute the matrix exponential (try increasing maxSearchSize in expm.js)");
  }
  
  /**
   * Returns the estimated error of the Pade approximant for the given
   * parameters.
   */
  function errorEstimate(infNorm, q, j) {
    
    var qfac = 1;
    for(var i=2; i<=q; i++) {
      qfac *= i;
    }
    var twoqfac = qfac;
    for(var i=q+1; i<=2*q; i++) {
      twoqfac *= i;
    }
    var twoqp1fac = twoqfac * (2*q+1);
    
    return 8.0 *
      Math.pow(infNorm / Math.pow(2, j), 2*q) *
      qfac*qfac / (twoqfac*twoqp1fac);
  }
  
  expm.toTex = {1: '\\exp\\left(${args[0]}\\right)'};

  return expm;
}

exports.name = 'expm';
exports.factory = factory;
