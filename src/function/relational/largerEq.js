import { nearlyEqual as bigNearlyEqual } from '../../utils/bignumber/nearlyEqual'
import { nearlyEqual } from '../../utils/number'
import { factory } from '../../utils/factory'
import { createAlgorithm03 } from '../../type/matrix/utils/algorithm03'
import { createAlgorithm07 } from '../../type/matrix/utils/algorithm07'
import { createAlgorithm12 } from '../../type/matrix/utils/algorithm12'
import { createAlgorithm14 } from '../../type/matrix/utils/algorithm14'
import { createAlgorithm13 } from '../../type/matrix/utils/algorithm13'

const name = 'largerEq'
const dependencies = [
  'typed',
  'config',
  'matrix',
  'DenseMatrix'
]

export const createLargerEq = /* #__PURE__ */ factory(name, dependencies, ({ typed, config, matrix, DenseMatrix }) => {
  const algorithm03 = createAlgorithm03({ typed })
  const algorithm07 = createAlgorithm07({ typed, DenseMatrix })
  const algorithm12 = createAlgorithm12({ typed, DenseMatrix })
  const algorithm13 = createAlgorithm13({ typed })
  const algorithm14 = createAlgorithm14({ typed })

  /**
   * Test whether value x is larger or equal to y.
   *
   * The function returns true when x is larger than y or the relative
   * difference between x and y is smaller than the configured epsilon. The
   * function cannot be used to compare values smaller than approximately 2.22e-16.
   *
   * For matrices, the function is evaluated element wise.
   * Strings are compared by their numerical value.
   *
   * Syntax:
   *
   *    math.largerEq(x, y)
   *
   * Examples:
   *
   *    math.larger(2, 1 + 1)         // returns false
   *    math.largerEq(2, 1 + 1)       // returns true
   *
   * See also:
   *
   *    equal, unequal, smaller, smallerEq, larger, compare
   *
   * @param  {number | BigNumber | Fraction | boolean | Unit | string | Array | Matrix} x First value to compare
   * @param  {number | BigNumber | Fraction | boolean | Unit | string | Array | Matrix} y Second value to compare
   * @return {boolean | Array | Matrix} Returns true when the x is larger or equal to y, else returns false
   */
  const largerEq = typed(name, {

    'boolean, boolean': function (x, y) {
      return x >= y
    },

    'number, number': function (x, y) {
      return x >= y || nearlyEqual(x, y, config.epsilon)
    },

    'BigNumber, BigNumber': function (x, y) {
      return x.gte(y) || bigNearlyEqual(x, y, config.epsilon)
    },

    'Fraction, Fraction': function (x, y) {
      return x.compare(y) !== -1
    },

    'Complex, Complex': function () {
      throw new TypeError('No ordering relation is defined for complex numbers')
    },

    'Unit, Unit': function (x, y) {
      if (!x.equalBase(y)) {
        throw new Error('Cannot compare units with different base')
      }
      return largerEq(x.value, y.value)
    },

    'SparseMatrix, SparseMatrix': function (x, y) {
      return algorithm07(x, y, largerEq)
    },

    'SparseMatrix, DenseMatrix': function (x, y) {
      return algorithm03(y, x, largerEq, true)
    },

    'DenseMatrix, SparseMatrix': function (x, y) {
      return algorithm03(x, y, largerEq, false)
    },

    'DenseMatrix, DenseMatrix': function (x, y) {
      return algorithm13(x, y, largerEq)
    },

    'Array, Array': function (x, y) {
      // use matrix implementation
      return largerEq(matrix(x), matrix(y)).valueOf()
    },

    'Array, Matrix': function (x, y) {
      // use matrix implementation
      return largerEq(matrix(x), y)
    },

    'Matrix, Array': function (x, y) {
      // use matrix implementation
      return largerEq(x, matrix(y))
    },

    'SparseMatrix, any': function (x, y) {
      return algorithm12(x, y, largerEq, false)
    },

    'DenseMatrix, any': function (x, y) {
      return algorithm14(x, y, largerEq, false)
    },

    'any, SparseMatrix': function (x, y) {
      return algorithm12(y, x, largerEq, true)
    },

    'any, DenseMatrix': function (x, y) {
      return algorithm14(y, x, largerEq, true)
    },

    'Array, any': function (x, y) {
      // use matrix implementation
      return algorithm14(matrix(x), y, largerEq, false).valueOf()
    },

    'any, Array': function (x, y) {
      // use matrix implementation
      return algorithm14(matrix(y), x, largerEq, true).valueOf()
    }
  })

  return largerEq
})

export const createLargerEqNumber = /* #__PURE__ */ factory(name, ['typed', 'config'], ({ typed, config }) => {
  return typed(name, {
    'number, number': function (x, y) {
      return x >= y || nearlyEqual(x, y, config.epsilon)
    }
  })
})
