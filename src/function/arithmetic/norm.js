'use strict'

import { factory } from '../../utils/factory'

const name = 'norm'
const dependencies = [
  'typed',
  'abs',
  'add',
  'pow',
  'conj',
  'sqrt',
  'multiply',
  'equalScalar',
  'larger',
  'smaller',
  'matrix'
]

export const createNorm = factory(name, dependencies, (scope) => {
  /**
   * Calculate the norm of a number, vector or matrix.
   *
   * The second parameter p is optional. If not provided, it defaults to 2.
   *
   * Syntax:
   *
   *    math.norm(x)
   *    math.norm(x, p)
   *
   * Examples:
   *
   *    math.abs(-3.5)                         // returns 3.5
   *    math.norm(-3.5)                        // returns 3.5
   *
   *    math.norm(math.complex(3, -4))         // returns 5
   *
   *    math.norm([1, 2, -3], Infinity)        // returns 3
   *    math.norm([1, 2, -3], -Infinity)       // returns 1
   *
   *    math.norm([3, 4], 2)                   // returns 5
   *
   *    math.norm([[1, 2], [3, 4]], 1)          // returns 6
   *    math.norm([[1, 2], [3, 4]], 'inf')     // returns 7
   *    math.norm([[1, 2], [3, 4]], 'fro')     // returns 5.477225575051661
   *
   * See also:
   *
   *    abs, hypot
   *
   * @param  {number | BigNumber | Complex | Array | Matrix} x
   *            Value for which to calculate the norm
   * @param  {number | BigNumber | string} [p=2]
   *            Vector space.
   *            Supported numbers include Infinity and -Infinity.
   *            Supported strings are: 'inf', '-inf', and 'fro' (The Frobenius norm)
   * @return {number | BigNumber} the p-norm
   */
  const norm = scope.typed(name, {
    'number': Math.abs,

    'Complex': function (x) {
      return x.abs()
    },

    'BigNumber': function (x) {
      // norm(x) = abs(x)
      return x.abs()
    },

    'boolean': function (x) {
      // norm(x) = abs(x)
      return Math.abs(x)
    },

    'Array': function (x) {
      return _norm(scope.matrix(x), 2)
    },

    'Matrix': function (x) {
      return _norm(x, 2)
    },

    'number | Complex | BigNumber | boolean, number | BigNumber | string': function (x) {
      // ignore second parameter, TODO: remove the option of second parameter for these types
      return norm(x)
    },

    'Array, number | BigNumber | string': function (x, p) {
      return _norm(scope.matrix(x), p)
    },

    'Matrix, number | BigNumber | string': function (x, p) {
      return _norm(x, p)
    }
  })

  /**
   * Calculate the norm for an array
   * @param {Matrix} x
   * @param {number | string} p
   * @returns {number} Returns the norm
   * @private
   */
  function _norm (x, p) {
    // size
    const sizeX = x.size()

    // check if it is a vector
    if (sizeX.length === 1) {
      // check p
      if (p === Number.POSITIVE_INFINITY || p === 'inf') {
        // norm(x, Infinity) = max(abs(x))
        let pinf = 0
        // skip zeros since abs(0) === 0
        x.forEach(
          function (value) {
            const v = scope.abs(value)
            if (scope.larger(v, pinf)) { pinf = v }
          },
          true)
        return pinf
      }
      if (p === Number.NEGATIVE_INFINITY || p === '-inf') {
        // norm(x, -Infinity) = min(abs(x))
        let ninf
        // skip zeros since abs(0) === 0
        x.forEach(
          function (value) {
            const v = scope.abs(value)
            if (!ninf || scope.smaller(v, ninf)) { ninf = v }
          },
          true)
        return ninf || 0
      }
      if (p === 'fro') {
        return _norm(x, 2)
      }
      if (typeof p === 'number' && !isNaN(p)) {
        // check p != 0
        if (!scope.equalScalar(p, 0)) {
          // norm(x, p) = sum(abs(xi) ^ p) ^ 1/p
          let n = 0
          // skip zeros since abs(0) === 0
          x.forEach(
            function (value) {
              n = scope.add(scope.pow(scope.abs(value), p), n)
            },
            true)
          return scope.pow(n, 1 / p)
        }
        return Number.POSITIVE_INFINITY
      }
      // invalid parameter value
      throw new Error('Unsupported parameter value')
    }
    // MxN matrix
    if (sizeX.length === 2) {
      // check p
      if (p === 1) {
        // norm(x) = the largest column sum
        const c = []
        // result
        let maxc = 0
        // skip zeros since abs(0) == 0
        x.forEach(
          function (value, index) {
            const j = index[1]
            const cj = scope.add(c[j] || 0, scope.abs(value))
            if (scope.larger(cj, maxc)) { maxc = cj }
            c[j] = cj
          },
          true)
        return maxc
      }
      if (p === Number.POSITIVE_INFINITY || p === 'inf') {
        // norm(x) = the largest row sum
        const r = []
        // result
        let maxr = 0
        // skip zeros since abs(0) == 0
        x.forEach(
          function (value, index) {
            const i = index[0]
            const ri = scope.add(r[i] || 0, scope.abs(value))
            if (scope.larger(ri, maxr)) { maxr = ri }
            r[i] = ri
          },
          true)
        return maxr
      }
      if (p === 'fro') {
        // norm(x) = sqrt(sum(diag(x'x)))
        let fro = 0
        x.forEach(
          function (value, index) {
            fro = scope.add(fro, scope.multiply(value, scope.conj(value)))
          })
        return scope.abs(scope.sqrt(fro))
      }
      if (p === 2) {
        // not implemented
        throw new Error('Unsupported parameter value, missing implementation of matrix singular value decomposition')
      }
      // invalid parameter value
      throw new Error('Unsupported parameter value')
    }
  }

  norm.toTex = {
    1: `\\left\\|\${args[0]}\\right\\|`,
    2: undefined // use default template
  }

  return norm
})
