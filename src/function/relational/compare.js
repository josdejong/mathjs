import { nearlyEqual as bigNearlyEqual } from '../../utils/bignumber/nearlyEqual'
import { nearlyEqual } from '../../utils/number'
import { factory } from '../../utils/factory'
import { createAlgorithm03 } from '../../type/matrix/utils/algorithm03'
import { createAlgorithm12 } from '../../type/matrix/utils/algorithm12'
import { createAlgorithm14 } from '../../type/matrix/utils/algorithm14'
import { createAlgorithm13 } from '../../type/matrix/utils/algorithm13'
import { createAlgorithm05 } from '../../type/matrix/utils/algorithm05'

const name = 'compare'
const dependencies = [
  'typed',
  'config',
  'matrix',
  'equalScalar',
  'BigNumber',
  'Fraction',
  'DenseMatrix'
]

export const createCompare = /* #__PURE__ */ factory(name, dependencies, ({ typed, config, equalScalar, matrix, BigNumber, Fraction, DenseMatrix }) => {
  const algorithm03 = createAlgorithm03({ typed })
  const algorithm05 = createAlgorithm05({ typed, equalScalar })
  const algorithm12 = createAlgorithm12({ typed, DenseMatrix })
  const algorithm13 = createAlgorithm13({ typed })
  const algorithm14 = createAlgorithm14({ typed })

  /**
   * Compare two values. Returns 1 when x > y, -1 when x < y, and 0 when x == y.
   *
   * x and y are considered equal when the relative difference between x and y
   * is smaller than the configured epsilon. The function cannot be used to
   * compare values smaller than approximately 2.22e-16.
   *
   * For matrices, the function is evaluated element wise.
   * Strings are compared by their numerical value.
   *
   * Syntax:
   *
   *    math.compare(x, y)
   *
   * Examples:
   *
   *    math.compare(6, 1)           // returns 1
   *    math.compare(2, 3)           // returns -1
   *    math.compare(7, 7)           // returns 0
   *    math.compare('10', '2')      // returns 1
   *    math.compare('1000', '1e3')  // returns 0
   *
   *    const a = math.unit('5 cm')
   *    const b = math.unit('40 mm')
   *    math.compare(a, b)           // returns 1
   *
   *    math.compare(2, [1, 2, 3])   // returns [1, 0, -1]
   *
   * See also:
   *
   *    equal, unequal, smaller, smallerEq, larger, largerEq, compareNatural, compareText
   *
   * @param  {number | BigNumber | Fraction | Unit | string | Array | Matrix} x First value to compare
   * @param  {number | BigNumber | Fraction | Unit | string | Array | Matrix} y Second value to compare
   * @return {number | BigNumber | Fraction | Array | Matrix} Returns the result of the comparison:
   *                                                          1 when x > y, -1 when x < y, and 0 when x == y.
   */
  return typed(name, {

    'boolean, boolean': function (x, y) {
      return x === y ? 0 : (x > y ? 1 : -1)
    },

    'number, number': function (x, y) {
      return nearlyEqual(x, y, config.epsilon)
        ? 0
        : (x > y ? 1 : -1)
    },

    'BigNumber, BigNumber': function (x, y) {
      return bigNearlyEqual(x, y, config.epsilon)
        ? new BigNumber(0)
        : new BigNumber(x.cmp(y))
    },

    'Fraction, Fraction': function (x, y) {
      return new Fraction(x.compare(y))
    },

    'Complex, Complex': function () {
      throw new TypeError('No ordering relation is defined for complex numbers')
    },

    'Unit, Unit': function (x, y) {
      if (!x.equalBase(y)) {
        throw new Error('Cannot compare units with different base')
      }
      return this(x.value, y.value)
    },

    'SparseMatrix, SparseMatrix': function (x, y) {
      return algorithm05(x, y, this)
    },

    'SparseMatrix, DenseMatrix': function (x, y) {
      return algorithm03(y, x, this, true)
    },

    'DenseMatrix, SparseMatrix': function (x, y) {
      return algorithm03(x, y, this, false)
    },

    'DenseMatrix, DenseMatrix': function (x, y) {
      return algorithm13(x, y, this)
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

    'SparseMatrix, any': function (x, y) {
      return algorithm12(x, y, this, false)
    },

    'DenseMatrix, any': function (x, y) {
      return algorithm14(x, y, this, false)
    },

    'any, SparseMatrix': function (x, y) {
      return algorithm12(y, x, this, true)
    },

    'any, DenseMatrix': function (x, y) {
      return algorithm14(y, x, this, true)
    },

    'Array, any': function (x, y) {
      // use matrix implementation
      return algorithm14(matrix(x), y, this, false).valueOf()
    },

    'any, Array': function (x, y) {
      // use matrix implementation
      return algorithm14(matrix(y), x, this, true).valueOf()
    }
  })
})

export const createCompareNumber = /* #__PURE__ */ factory(name, ['typed', 'config'], ({ typed, config }) => {
  return typed(name, {
    'number, number': function (x, y) {
      return nearlyEqual(x, y, config.epsilon)
        ? 0
        : (x > y ? 1 : -1)
    }
  })
})
