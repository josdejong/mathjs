import { factory } from '../../utils/factory.js'
import { createMatAlgo01xDSid } from '../../type/matrix/utils/matAlgo01xDSid.js'
import { createMatAlgo02xDS0 } from '../../type/matrix/utils/matAlgo02xDS0.js'
import { createMatAlgo06xS0S0 } from '../../type/matrix/utils/matAlgo06xS0S0.js'
import { createMatAlgo11xS0s } from '../../type/matrix/utils/matAlgo11xS0s.js'
import { createMatAlgo13xDD } from '../../type/matrix/utils/matAlgo13xDD.js'
import { createMatAlgo14xDs } from '../../type/matrix/utils/matAlgo14xDs.js'
import { nthRootNumber } from '../../plain/number/index.js'

const name = 'nthRoot'
const dependencies = [
  'typed',
  'matrix',
  'equalScalar',
  'BigNumber'
]

export const createNthRoot = /* #__PURE__ */ factory(name, dependencies, ({ typed, matrix, equalScalar, BigNumber }) => {
  const matAlgo01xDSid = createMatAlgo01xDSid({ typed })
  const matAlgo02xDS0 = createMatAlgo02xDS0({ typed, equalScalar })
  const matAlgo06xS0S0 = createMatAlgo06xS0S0({ typed, equalScalar })
  const matAlgo11xS0s = createMatAlgo11xS0s({ typed, equalScalar })
  const matAlgo13xDD = createMatAlgo13xDD({ typed })
  const matAlgo14xDs = createMatAlgo14xDs({ typed })

  /**
   * Calculate the nth root of a value.
   * The principal nth root of a positive real number A, is the positive real
   * solution of the equation
   *
   *     x^root = A
   *
   * For matrices, the function is evaluated element wise.
   *
   * Syntax:
   *
   *     math.nthRoot(a)
   *     math.nthRoot(a, root)
   *
   * Examples:
   *
   *     math.nthRoot(9, 2)    // returns 3, as 3^2 == 9
   *     math.sqrt(9)          // returns 3, as 3^2 == 9
   *     math.nthRoot(64, 3)   // returns 4, as 4^3 == 64
   *
   * See also:
   *
   *     sqrt, pow
   *
   * @param {number | BigNumber | Array | Matrix | Complex} a
   *              Value for which to calculate the nth root
   * @param {number | BigNumber} [root=2]    The root.
   * @return {number | Complex | Array | Matrix} Returns the nth root of `a`
   */
  const complexErr = ('' +
    'Complex number not supported in function nthRoot. ' +
    'Use nthRoots instead.'
  )
  return typed(name, {

    number: nthRootNumber,
    'number, number': nthRootNumber,

    BigNumber: function (x) {
      return _bigNthRoot(x, new BigNumber(2))
    },
    Complex: function (x) {
      throw new Error(complexErr)
    },
    'Complex, number': function (x, y) {
      throw new Error(complexErr)
    },
    'BigNumber, BigNumber': _bigNthRoot,

    'Array | Matrix': function (x) {
      return this(x, 2)
    },

    'SparseMatrix, SparseMatrix': function (x, y) {
      // density must be one (no zeros in matrix)
      if (y.density() === 1) {
        // sparse + sparse
        return matAlgo06xS0S0(x, y, this)
      } else {
        // throw exception
        throw new Error('Root must be non-zero')
      }
    },

    'SparseMatrix, DenseMatrix': function (x, y) {
      return matAlgo02xDS0(y, x, this, true)
    },

    'DenseMatrix, SparseMatrix': function (x, y) {
      // density must be one (no zeros in matrix)
      if (y.density() === 1) {
        // dense + sparse
        return matAlgo01xDSid(x, y, this, false)
      } else {
        // throw exception
        throw new Error('Root must be non-zero')
      }
    },

    'DenseMatrix, DenseMatrix': function (x, y) {
      return matAlgo13xDD(x, y, this)
    },

    'Array, Array': function (x, y) {
      // use matrix implementation
      return this(matrix(x), matrix(y)).valueOf()
    },

    'Array, Matrix': function (x, y) {
      // use matrix implementation
      return this(matrix(x), y)
    },

    'Matrix, Array': function (x, y) {
      // use matrix implementation
      return this(x, matrix(y))
    },

    'SparseMatrix, number | BigNumber': function (x, y) {
      return matAlgo11xS0s(x, y, this, false)
    },

    'DenseMatrix, number | BigNumber': function (x, y) {
      return matAlgo14xDs(x, y, this, false)
    },

    'number | BigNumber, SparseMatrix': function (x, y) {
      // density must be one (no zeros in matrix)
      if (y.density() === 1) {
        // sparse - scalar
        return matAlgo11xS0s(y, x, this, true)
      } else {
        // throw exception
        throw new Error('Root must be non-zero')
      }
    },

    'number | BigNumber, DenseMatrix': function (x, y) {
      return matAlgo14xDs(y, x, this, true)
    },

    'Array, number | BigNumber': function (x, y) {
      // use matrix implementation
      return this(matrix(x), y).valueOf()
    },

    'number | BigNumber, Array': function (x, y) {
      // use matrix implementation
      return this(x, matrix(y)).valueOf()
    }
  })

  /**
   * Calculate the nth root of a for BigNumbers, solve x^root == a
   * https://rosettacode.org/wiki/Nth_root#JavaScript
   * @param {BigNumber} a
   * @param {BigNumber} root
   * @private
   */
  function _bigNthRoot (a, root) {
    const precision = BigNumber.precision
    const Big = BigNumber.clone({ precision: precision + 2 })
    const zero = new BigNumber(0)

    const one = new Big(1)
    const inv = root.isNegative()
    if (inv) {
      root = root.neg()
    }

    if (root.isZero()) {
      throw new Error('Root must be non-zero')
    }
    if (a.isNegative() && !root.abs().mod(2).equals(1)) {
      throw new Error('Root must be odd when a is negative.')
    }

    // edge cases zero and infinity
    if (a.isZero()) {
      return inv ? new Big(Infinity) : 0
    }
    if (!a.isFinite()) {
      return inv ? zero : a
    }

    let x = a.abs().pow(one.div(root))
    // If a < 0, we require that root is an odd integer,
    // so (-1) ^ (1/root) = -1
    x = a.isNeg() ? x.neg() : x
    return new BigNumber((inv ? one.div(x) : x).toPrecision(precision))
  }
})

export const createNthRootNumber = /* #__PURE__ */ factory(name, ['typed'], ({ typed }) => {
  return typed(name, {
    number: nthRootNumber,
    'number, number': nthRootNumber
  })
})
