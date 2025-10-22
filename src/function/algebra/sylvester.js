import { factory } from '../../utils/factory.js'

const name = 'sylvester'
const dependencies = [
  'typed',
  'schur',
  'matrixFromColumns',
  'matrix',
  'multiply',
  'range',
  'concat',
  'transpose',
  'index',
  'subset',
  'add',
  'subtract',
  'identity',
  'lusolve',
  'abs'
]

export const createSylvester = /* #__PURE__ */ factory(name, dependencies, (
  {
    typed,
    schur,
    matrixFromColumns,
    matrix,
    multiply,
    range,
    concat,
    transpose,
    index,
    subset,
    add,
    subtract,
    identity,
    lusolve,
    abs,
    config
  }
) => {
  /**
   *
   * Solves the real-valued Sylvester equation AX+XB=C for X, where A, B and C are
   * matrices of appropriate dimensions, being A and B squared. Notice that other
   * equivalent definitions for the Sylvester equation exist and this function
   * assumes the one presented in the original publication of the the Bartels-
   * Stewart algorithm, which is implemented by this function.
   * https://en.wikipedia.org/wiki/Sylvester_equation
   *
   * Syntax:
   *
   *     math.sylvester(A, B, C)
   *
   * Examples:
   *
   *     const A = [[-1, -2], [1, 1]]
   *     const B = [[2, -1], [1, -2]]
   *     const C = [[-3, 2], [3, 0]]
   *     math.sylvester(A, B, C)      // returns DenseMatrix [[-0.25, 0.25], [1.5, -1.25]]
   *
   * See also:
   *
   *     schur, lyap
   *
   * @param {Matrix | Array} A  Matrix A
   * @param {Matrix | Array} B  Matrix B
   * @param {Matrix | Array} C  Matrix C
   * @return {Matrix | Array}   Matrix X, solving the Sylvester equation
   */
  return typed(name, {
    'Matrix, Matrix, Matrix': _sylvester,
    'Array, Matrix, Matrix': function (A, B, C) {
      return _sylvester(matrix(A), B, C)
    },
    'Array, Array, Matrix': function (A, B, C) {
      return _sylvester(matrix(A), matrix(B), C)
    },
    'Array, Matrix, Array': function (A, B, C) {
      return _sylvester(matrix(A), B, matrix(C))
    },
    'Matrix, Array, Matrix': function (A, B, C) {
      return _sylvester(A, matrix(B), C)
    },
    'Matrix, Array, Array': function (A, B, C) {
      return _sylvester(A, matrix(B), matrix(C))
    },
    'Matrix, Matrix, Array': function (A, B, C) {
      return _sylvester(A, B, matrix(C))
    },
    'Array, Array, Array': function (A, B, C) {
      return _sylvester(matrix(A), matrix(B), matrix(C)).toArray()
    }
  })
  function _sylvester (A, B, C) {
    const n = B.size()[0]
    const m = A.size()[0]

    const sA = schur(A)
    const F = sA.T
    const U = sA.U
    const sB = schur(multiply(-1, B))
    const G = sB.T
    const V = sB.U
    const D = multiply(multiply(transpose(U), C), V)
    const all = range(0, m)
    const y = []

    const hc = (a, b) => concat(a, b, 1)
    const vc = (a, b) => concat(a, b, 0)

    for (let k = 0; k < n; k++) {
      if (k < (n - 1) && abs(subset(G, index(k + 1, k))) > 1e-5) {
        let RHS = vc(subset(D, index(all, [k])), subset(D, index(all, [k + 1])))
        for (let j = 0; j < k; j++) {
          RHS = add(RHS,
            vc(multiply(y[j], subset(G, index(j, k))), multiply(y[j], subset(G, index(j, k + 1))))
          )
        }
        const gkk = multiply(identity(m), multiply(-1, subset(G, index(k, k))))
        const gmk = multiply(identity(m), multiply(-1, subset(G, index(k + 1, k))))
        const gkm = multiply(identity(m), multiply(-1, subset(G, index(k, k + 1))))
        const gmm = multiply(identity(m), multiply(-1, subset(G, index(k + 1, k + 1))))
        const LHS = vc(
          hc(add(F, gkk), gmk),
          hc(gkm, add(F, gmm))
        )
        const yAux = lusolve(LHS, RHS)
        y[k] = yAux.subset(index(range(0, m), [0]))
        y[k + 1] = yAux.subset(index(range(m, 2 * m), [0]))
        k++
      } else {
        let RHS = subset(D, index(all, [k]))
        for (let j = 0; j < k; j++) { RHS = add(RHS, multiply(y[j], subset(G, index(j, k)))) }
        const gkk = subset(G, index(k, k))
        const LHS = subtract(F, multiply(gkk, identity(m)))

        y[k] = lusolve(LHS, RHS)
      }
    }
    const Y = matrix(matrixFromColumns(...y))
    const X = multiply(U, multiply(Y, transpose(V)))
    return X
  }
})
