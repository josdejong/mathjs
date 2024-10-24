import { factory } from '../../utils/factory.js'
import { format } from '../../utils/string.js'
import { createComplexEigs } from './eigs/complexEigs.js'
import { createRealSymmetric } from './eigs/realSymetric.js'
import { typeOf, isNumber, isBigNumber, isComplex, isFraction } from '../../utils/is.js'

const name = 'eigs'

// The absolute state of math.js's dependency system:
const dependencies = ['config', 'typed', 'matrix', 'addScalar', 'equal', 'subtract', 'abs', 'atan', 'cos', 'sin', 'multiplyScalar', 'divideScalar', 'inv', 'bignumber', 'multiply', 'add', 'larger', 'column', 'flatten', 'number', 'complex', 'sqrt', 'diag', 'size', 'reshape', 'qr', 'usolve', 'usolveAll', 'im', 're', 'smaller', 'matrixFromColumns', 'dot']
export const createEigs = /* #__PURE__ */ factory(name, dependencies, ({ config, typed, matrix, addScalar, subtract, equal, abs, atan, cos, sin, multiplyScalar, divideScalar, inv, bignumber, multiply, add, larger, column, flatten, number, complex, sqrt, diag, size, reshape, qr, usolve, usolveAll, im, re, smaller, matrixFromColumns, dot }) => {
  const doRealSymmetric = createRealSymmetric({ config, addScalar, subtract, column, flatten, equal, abs, atan, cos, sin, multiplyScalar, inv, bignumber, complex, multiply, add })
  const doComplexEigs = createComplexEigs({ config, addScalar, subtract, multiply, multiplyScalar, flatten, divideScalar, sqrt, abs, bignumber, diag, size, reshape, qr, inv, usolve, usolveAll, equal, complex, larger, smaller, matrixFromColumns, dot })

  /**
   * Compute eigenvalues and eigenvectors of a square matrix.
   * The eigenvalues are sorted by their absolute value, ascending, and
   * returned as a vector in the `values` property of the returned project.
   * An eigenvalue with algebraic multiplicity k will be listed k times, so
   * that the returned `values` vector always has length equal to the size
   * of the input matrix.
   *
   * The `eigenvectors` property of the return value provides the eigenvectors.
   * It is an array of plain objects: the `value` property of each gives the
   * associated eigenvalue, and the `vector` property gives the eigenvector
   * itself. Note that the same `value` property will occur as many times in
   * the list provided by `eigenvectors` as the geometric multiplicity of
   * that value.
   *
   * If the algorithm fails to converge, it will throw an error –
   * in that case, however, you may still find useful information
   * in `err.values` and `err.vectors`.
   *
   * Syntax:
   *
   *     math.eigs(x, [prec])
   *
   * Examples:
   *
   *     const { eigs, multiply, column, transpose, matrixFromColumns } = math
   *     const H = [[5, 2.3], [2.3, 1]]
   *     const ans = eigs(H) // returns {values: [E1,E2...sorted], eigenvectors: [{value: E1, vector: v2}, {value: e, vector: v2}, ...]
   *     const E = ans.values
   *     const V = ans.eigenvectors
   *     multiply(H, V[0].vector)) // returns multiply(E[0], V[0].vector))
   *     const U = matrixFromColumns(...V.map(obj => obj.vector))
   *     const UTxHxU = multiply(transpose(U), H, U) // diagonalizes H if possible
   *     E[0] == UTxHxU[0][0]  // returns true always
   *
   * See also:
   *
   *     inv
   *
   * @param {Array | Matrix} x  Matrix to be diagonalized
   *
   * @param {number | BigNumber} [prec] Precision, default value: 1e-15
   * @return {{values: Array|Matrix, eigenvectors: Array<EVobj>}} Object containing an array of eigenvalues and an array of {value: number|BigNumber, vector: Array|Matrix} objects.
   *
   */
  return typed('eigs', {

    // The conversion to matrix in the first two implementations,
    // just to convert back to an array right away in
    // computeValuesAndVectors, is unfortunate, and should perhaps be
    // streamlined. It is done because the Matrix object carries some
    // type information about its entries, and so constructing the matrix
    // is a roundabout way of doing type detection.
    Array: function (x) { return doEigs(matrix(x)) },
    'Array, number|BigNumber': function (x, prec) {
      return doEigs(matrix(x), prec)
    },
    Matrix: function (mat) {
      return doEigs(mat, undefined, true)
    },
    'Matrix, number|BigNumber': function (mat, prec) {
      return doEigs(mat, prec, true)
    }
  })

  function doEigs (mat, prec, matricize = false) {
    const result = computeValuesAndVectors(mat, prec)
    if (matricize) {
      result.values = matrix(result.values)
      result.eigenvectors = result.eigenvectors.map(({ value, vector }) =>
        ({ value, vector: matrix(vector) }))
    }
    Object.defineProperty(result, 'vectors', {
      enumerable: false, // to make sure that the eigenvectors can still be
      // converted to string.
      get: () => {
        throw new Error('eigs(M).vectors replaced with eigs(M).eigenvectors')
      }
    })
    return result
  }

  function computeValuesAndVectors (mat, prec) {
    if (prec === undefined) {
      prec = config.epsilon
    }

    const arr = mat.toArray() // NOTE: arr is guaranteed to be unaliased
    // and so safe to modify in place
    const asize = mat.size()

    if (asize.length !== 2 || asize[0] !== asize[1]) {
      throw new RangeError(`Matrix must be square (size: ${format(asize)})`)
    }

    const N = asize[0]

    if (isReal(arr, N, prec)) {
      coerceReal(arr, N) // modifies arr by side effect

      if (isSymmetric(arr, N, prec)) {
        const type = coerceTypes(mat, arr, N) // modifies arr by side effect
        return doRealSymmetric(arr, N, prec, type)
      }
    }

    const type = coerceTypes(mat, arr, N) // modifies arr by side effect
    return doComplexEigs(arr, N, prec, type)
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