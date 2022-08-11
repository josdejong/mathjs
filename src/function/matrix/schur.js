import { factory } from '../../utils/factory.js'

const name = 'schur'
const dependencies = ['typed', 'isMatrix', 'matrix', 'identity', 'multiply', 'qr', 'norm', 'subtract']


export const createSchur = /* #__PURE__ */ factory(name, dependencies, ({ typed, isMatrix, matrix, identity, multiply, qr, norm, subtract }) => {
 /**
   * 
   * Performs a real Schur decomposition of the real matrix A = UTU' where U is orthogonal
   * and T is upper quasi-triangular. 
   * https://en.wikipedia.org/wiki/Schur_decomposition
   * 
   * Syntax:
   *
   *     math.schur(A)
   *
   * Examples:
   *
   *     const A = [[1, 2], [2, 1]]
   *     const res = math.schur(A)        
   *     res.U
   *     res.T
   *
   * See also:
   *
   *     sylvester, lyap
   *
   * @param {Matrix} A  Matrix A
   * @return {{U: Matrix, T: Matrix}} Object containing both matrix U and T of the Schur Decomposition A=UTU'
   */
  return typed(name, {
    'Matrix': function (X){
        if(!isMatrix(X)){
          X = matrix(X)
        }
        let n = X.size()[0];
        let A = X
        let U = identity(n)
        do {
            var A0 = A
            let QR = qr(A)
            let Q = QR.Q
            let R = QR.R
            A = multiply(R,Q)
            U = multiply(U,Q)
            if((k++)>100)
                break
        } while (norm(subtract(A,A0))>1e-4);
        return {U: U, T: A}
    }
  })
})



    