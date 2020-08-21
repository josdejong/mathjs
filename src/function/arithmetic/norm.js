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
  'matrix',
  'ctranspose',
  'eigs'
]

export const createNorm = /* #__PURE__ */ factory(
  name,
  dependencies,
  ({
    typed,
    abs,
    add,
    pow,
    conj,
    sqrt,
    multiply,
    equalScalar,
    larger,
    smaller,
    matrix,
    ctranspose,
    eigs
  }) => {
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
    return typed(name, {
      number: Math.abs,

      Complex: function (x) {
        return x.abs()
      },

      BigNumber: function (x) {
        // norm(x) = abs(x)
        return x.abs()
      },

      boolean: function (x) {
        // norm(x) = abs(x)
        return Math.abs(x)
      },

      Array: function (x) {
        return _norm(matrix(x), 2)
      },

      Matrix: function (x) {
        return _norm(x, 2)
      },

      'number | Complex | BigNumber | boolean, number | BigNumber | string': function (
        x
      ) {
        // ignore second parameter, TODO: remove the option of second parameter for these types
        return this(x)
      },

      'Array, number | BigNumber | string': function (x, p) {
        return _norm(matrix(x), p)
      },

      'Matrix, number | BigNumber | string': function (x, p) {
        return _norm(x, p)
      }
    })

    /**
     * Calculate the plus infinity norm for a vector
     * @param {Matrix} x
     * @returns {number} Returns the norm
     * @private
     */
    function _vectorNormPlusInfinity (x) {
      // norm(x, Infinity) = max(abs(x))
      let pinf = 0
      // skip zeros since abs(0) === 0
      x.forEach(function (value) {
        const v = abs(value)
        if (larger(v, pinf)) {
          pinf = v
        }
      }, true)
      return pinf
    }

    /**
     * Calculate the minus infinity norm for a vector
     * @param {Matrix} x
     * @returns {number} Returns the norm
     * @private
     */
    function _vectorNormMinusInfinity (x) {
      // norm(x, -Infinity) = min(abs(x))
      let ninf
      // skip zeros since abs(0) === 0
      x.forEach(function (value) {
        const v = abs(value)
        if (!ninf || smaller(v, ninf)) {
          ninf = v
        }
      }, true)
      return ninf || 0
    }

    /**
     * Calculate the norm for a vector
     * @param {Matrix} x
     * @param {number | string} p
     * @returns {number} Returns the norm
     * @private
     */
    function _vectorNorm (x, p) {
      // check p
      if (p === Number.POSITIVE_INFINITY || p === 'inf') {
        return _vectorNormPlusInfinity(x)
      }
      if (p === Number.NEGATIVE_INFINITY || p === '-inf') {
        return _vectorNormMinusInfinity(x)
      }
      if (p === 'fro') {
        return _norm(x, 2)
      }
      if (typeof p === 'number' && !isNaN(p)) {
        // check p != 0
        if (!equalScalar(p, 0)) {
          // norm(x, p) = sum(abs(xi) ^ p) ^ 1/p
          let n = 0
          // skip zeros since abs(0) === 0
          x.forEach(function (value) {
            n = add(pow(abs(value), p), n)
          }, true)
          return pow(n, 1 / p)
        }
        return Number.POSITIVE_INFINITY
      }
      // invalid parameter value
      throw new Error('Unsupported parameter value')
    }

    /**
     * Calculate the Frobenius norm for a matrix
     * @param {Matrix} x
     * @returns {number} Returns the norm
     * @private
     */
    function _matrixNormFrobenius (x) {
      // norm(x) = sqrt(sum(diag(x'x)))
      let fro = 0
      x.forEach(function (value, index) {
        fro = add(fro, multiply(value, conj(value)))
      })
      return abs(sqrt(fro))
    }

    /**
     * Calculate the norm L1 for a matrix
     * @param {Matrix} x
     * @returns {number} Returns the norm
     * @private
     */
    function _matrixNormOne (x) {
      // norm(x) = the largest column sum
      const c = []
      // result
      let maxc = 0
      // skip zeros since abs(0) == 0
      x.forEach(function (value, index) {
        const j = index[1]
        const cj = add(c[j] || 0, abs(value))
        if (larger(cj, maxc)) {
          maxc = cj
        }
        c[j] = cj
      }, true)
      return maxc
    }

    /**
     * Calculate the norm L2 for a matrix
     * @param {Matrix} x
     * @returns {number} Returns the norm
     * @private
     */
    function _matrixNormTwo (x) {
      // norm(x) = sqrt( max eigenvalue of A*.A)
      const sizeX = x.size()
      if (sizeX[0] !== sizeX[1]) {
        throw new RangeError('Invalid matrix dimensions')
      }
      const tx = ctranspose(x)
      const squaredX = multiply(tx, x)
      const eigenVals = eigs(squaredX).values
      const rho = eigenVals.get([eigenVals.size()[0] - 1])
      return abs(sqrt(rho))
    }

    /**
     * Calculate the infinity norm for a matrix
     * @param {Matrix} x
     * @returns {number} Returns the norm
     * @private
     */
    function _matrixNormInfinity (x) {
      // norm(x) = the largest row sum
      const r = []
      // result
      let maxr = 0
      // skip zeros since abs(0) == 0
      x.forEach(function (value, index) {
        const i = index[0]
        const ri = add(r[i] || 0, abs(value))
        if (larger(ri, maxr)) {
          maxr = ri
        }
        r[i] = ri
      }, true)
      return maxr
    }

    /**
     * Calculate the norm for a 2D Matrix (M*N)
     * @param {Matrix} x
     * @param {number | string} p
     * @returns {number} Returns the norm
     * @private
     */
    function _matrixNorm (x, p) {
      // check p
      if (p === 1) {
        return _matrixNormOne(x)
      }
      if (p === Number.POSITIVE_INFINITY || p === 'inf') {
        return _matrixNormInfinity(x)
      }
      if (p === 'fro') {
        return _matrixNormFrobenius(x)
      }
      if (p === 2) {
        return _matrixNormTwo(x)
      } // invalid parameter value

      throw new Error('Unsupported parameter value ' + p)
    }

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
        return _vectorNorm(x, p)
      }
      // MxN matrix
      if (sizeX.length === 2) {
        if (sizeX[0] && sizeX[1]) {
          return _matrixNorm(x, p)
        } else {
          throw new RangeError('Invalid matrix dimensions')
        }
      }
    }
  }
)
