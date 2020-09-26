import { factory } from '../../utils/factory'
import { format } from '../../utils/string'
import { typeOf, isNumber, isBigNumber, isComplex, isFraction } from '../../utils/is'
import { createRealSymmetric } from './eigs/realSymetric'
import { createComplex } from './eigs/complex'

const name = 'eigs'

const dependencies = ['config', 'typed', 'matrix', 'addScalar', 'equal', 'subtract', 'abs', 'atan', 'cos', 'sin', 'multiplyScalar', 'divideScalar', 'inv', 'bignumber', 'multiply', 'add', 'larger', 'column', 'flatten', 'number', 'complex', 'sqrt', 'diag', 'qr', 'usolveAll', 'im', 're', 'smaller']

export const createEigs = /* #__PURE__ */ factory(name, dependencies, ({ config, typed, matrix, addScalar, subtract, equal, abs, atan, cos, sin, multiplyScalar, divideScalar, inv, bignumber, multiply, add, larger, column, flatten, number, complex, sqrt, diag, qr, usolveAll, im, re, smaller }) => {

  const doRealSymetric = createRealSymmetric({ config, addScalar, subtract, column, flatten, equal, abs, atan, cos, sin, multiplyScalar, inv, bignumber, complex, multiply, add })
  const doComplex = createComplex({ config, addScalar, subtract, multiply, multiplyScalar, divideScalar, sqrt, abs, bignumber, diag, qr, inv, usolveAll, equal, complex, larger, smaller })

  /**
   * Compute eigenvalues and eigenvectors of a matrix.
   *
   * Syntax:
   *
   *     math.eigs(x, [prec])
   *
   * Examples:
   *
   *     const H = [[5, 2.3], [2.3, 1]]
   *     const ans = math.eigs(H) // returns {values: [E1,E2...sorted], vectors: [v1,v2.... corresponding vectors as columns]}
   *     const E = ans.values
   *     const U = ans.vectors
   *     math.multiply(H, math.column(U, 0)) // returns math.multiply(E[0], math.column(U, 0))
   *     const UTxHxU = math.multiply(math.transpose(U), H, U) // rotates H to the eigen-representation
   *     E[0] == UTxHxU[0][0]  // returns true
   *
   * See also:
   *
   *     inv
   *
   * @param {Array | Matrix} x  Matrix to be diagonalized
   *
   * @param {number | BigNumber} [prec] Precision, default value: 1e-15
   * @return {{values: Array, vectors: Matrix[]}} Object containing an array of eigenvalues and an array of eigenvectors.
   *
   */
  return typed('eigs', {

    Array: function (x) {
      const mat = matrix(x)
      return computeValuesAndVectors(mat)
    },

    'Array, number|BigNumber': function (x, prec) {
      const mat = matrix(x)
      return computeValuesAndVectors(mat, prec)
    },

    Matrix: function (mat) {
      return computeValuesAndVectors(mat)
    },

    'Matrix, number|BigNumber': function (mat, prec) {
      return computeValuesAndVectors(mat, prec)
    }
  })

  function computeValuesAndVectors (mat, prec) {
    if (prec === undefined) {
      prec = 1e-14
    }

    prec = bignumber(prec)

    const size = mat.size()

    if (size.length !== 2 || size[0] !== size[1]) {
      throw new RangeError('Matrix must be square (size: ' + format(size) + ')')
    }

    const arr = mat.toArray()
    const N = size[0]

    if (isReal(arr, N, prec)) {
      coerceReal(arr, N)

      if (isSymmetric(arr, N, prec)) {
        const type = coerceTypes(mat, arr, N)
        return doRealSymetric(arr, N, prec, type)
      }
    }

    const type = coerceTypes(mat, arr, N)
    return doComplex(arr, N, prec, type)
  }

  /** @return {boolean} */
  function isSymmetric (arr, N, prec) {
    for (let i = 0; i < N; i++) {
      for (let j = i; j < N; j++) {
        // TODO proper comparison of bignum and frac
        if (larger(bignumber(abs(subtract(arr[i][j], arr[j][i]))), prec)) {
          return false
        }
      }
    }

    return true
  }


  /** @return {boolean} */
  function isReal (arr, N, prec) {
    for (let i = 0; i < N; i++) {
      for (let j = 0; j < N; j++) {
        // TODO proper comparison of bignum and frac
        if (larger(bignumber(abs(im(arr[i][j]))), prec)) {
          return false
        }
      }
    }

    return true
  }

  function coerceReal (arr, N) {
    for (let i = 0; i < N; i++) {
      for (let j = 0; j < N; j++) {
        arr[i][j] = re(arr[i][j])
      }
    }
  }

  /** @return {'number' | 'BigNumber' | 'Complex'} */
  function coerceTypes (mat, arr, N) {
    /** @type {string} */
    const type = mat.datatype()

    if (type === 'number' || type === 'BigNumber' || type === 'Complex') {
      return type
    }

    let hasNumber = false
    let hasBig = false
    let hasComplex = false

    for (let i = 0; i < N; i++) {
      for (let j = 0; j < N; j++) {
        const el = arr[i][j]

        if (isNumber(el) || isFraction(el)) {
          hasNumber = true
        } else if (isBigNumber(el)) {
          hasBig = true
        } else if (isComplex(el)) {
          hasComplex = true
        } else {
          throw TypeError('Unsupported type in Matrix: ' + typeOf(el))
        }
      }
    }

    if (hasBig && hasComplex) {
      console.warn('Complex BigNumbers not supported, this operation will lose precission.')
    }

    if (hasComplex) {
      for (let i = 0; i < N; i++) {
        for (let j = 0; j < N; j++) {
          arr[i][j] = complex(arr[i][j])
        }
      }

      return 'Complex'
    }

    if (hasBig) {
      for (let i = 0; i < N; i++) {
        for (let j = 0; j < N; j++) {
          arr[i][j] = bignumber(arr[i][j])
        }
      }

      return 'BigNumber'
    }

    if (hasNumber) {
      for (let i = 0; i < N; i++) {
        for (let j = 0; j < N; j++) {
          arr[i][j] = number(arr[i][j])
        }
      }

      return 'number'
    } else {
      throw TypeError('Matrix contains unsupported types only.')
    }
  }
})
