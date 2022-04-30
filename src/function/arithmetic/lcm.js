import { factory } from '../../utils/factory.js'
import { createMatAlgo02xDS0 } from '../../type/matrix/utils/matAlgo02xDS0.js'
import { createMatAlgo06xS0S0 } from '../../type/matrix/utils/matAlgo06xS0S0.js'
import { createMatAlgo11xS0s } from '../../type/matrix/utils/matAlgo11xS0s.js'
import { createMatAlgo13xDD } from '../../type/matrix/utils/matAlgo13xDD.js'
import { createMatAlgo14xDs } from '../../type/matrix/utils/matAlgo14xDs.js'
import { lcmNumber } from '../../plain/number/index.js'

const name = 'lcm'
const dependencies = [
  'typed',
  'matrix',
  'equalScalar'
]

export const createLcm = /* #__PURE__ */ factory(name, dependencies, ({ typed, matrix, equalScalar }) => {
  const matAlgo02xDS0 = createMatAlgo02xDS0({ typed, equalScalar })
  const matAlgo06xS0S0 = createMatAlgo06xS0S0({ typed, equalScalar })
  const matAlgo11xS0s = createMatAlgo11xS0s({ typed, equalScalar })
  const matAlgo13xDD = createMatAlgo13xDD({ typed })
  const matAlgo14xDs = createMatAlgo14xDs({ typed })

  /**
   * Calculate the least common multiple for two or more values or arrays.
   *
   * lcm is defined as:
   *
   *     lcm(a, b) = abs(a * b) / gcd(a, b)
   *
   * For matrices, the function is evaluated element wise.
   *
   * Syntax:
   *
   *    math.lcm(a, b)
   *    math.lcm(a, b, c, ...)
   *
   * Examples:
   *
   *    math.lcm(4, 6)               // returns 12
   *    math.lcm(6, 21)              // returns 42
   *    math.lcm(6, 21, 5)           // returns 210
   *
   *    math.lcm([4, 6], [6, 21])    // returns [12, 42]
   *
   * See also:
   *
   *    gcd, xgcd
   *
   * @param {... number | BigNumber | Array | Matrix} args  Two or more integer numbers
   * @return {number | BigNumber | Array | Matrix}                           The least common multiple
   */
  return typed(name, {
    'number, number': lcmNumber,

    'BigNumber, BigNumber': _lcmBigNumber,

    'Fraction, Fraction': function (x, y) {
      return x.lcm(y)
    },

    'SparseMatrix, SparseMatrix': function (x, y) {
      return matAlgo06xS0S0(x, y, this)
    },

    'SparseMatrix, DenseMatrix': function (x, y) {
      return matAlgo02xDS0(y, x, this, true)
    },

    'DenseMatrix, SparseMatrix': function (x, y) {
      return matAlgo02xDS0(x, y, this, false)
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
      return matAlgo11xS0s(y, x, this, true)
    },

    'number | BigNumber, DenseMatrix': function (x, y) {
      return matAlgo14xDs(y, x, this, true)
    },

    'Array, number | BigNumber': function (x, y) {
      // use matrix implementation
      return matAlgo14xDs(matrix(x), y, this, false).valueOf()
    },

    'number | BigNumber, Array': function (x, y) {
      // use matrix implementation
      return matAlgo14xDs(matrix(y), x, this, true).valueOf()
    },

    // TODO: need a smarter notation here
    'Array | Matrix | number | BigNumber, Array | Matrix | number | BigNumber, ...Array | Matrix | number | BigNumber': function (a, b, args) {
      let res = this(a, b)
      for (let i = 0; i < args.length; i++) {
        res = this(res, args[i])
      }
      return res
    }
  })

  /**
   * Calculate lcm for two BigNumbers
   * @param {BigNumber} a
   * @param {BigNumber} b
   * @returns {BigNumber} Returns the least common multiple of a and b
   * @private
   */
  function _lcmBigNumber (a, b) {
    if (!a.isInt() || !b.isInt()) {
      throw new Error('Parameters in function lcm must be integer numbers')
    }

    if (a.isZero()) {
      return a
    }
    if (b.isZero()) {
      return b
    }

    // https://en.wikipedia.org/wiki/Euclidean_algorithm
    // evaluate lcm here inline to reduce overhead
    const prod = a.times(b)
    while (!b.isZero()) {
      const t = b
      b = a.mod(t)
      a = t
    }
    return prod.div(a).abs()
  }
})
