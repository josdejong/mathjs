import { compareText as _compareText } from '../../utils/string'
import { factory } from '../../utils/factory'
import { createAlgorithm14 } from '../../type/matrix/utils/algorithm14'
import { createAlgorithm13 } from '../../type/matrix/utils/algorithm13'

const name = 'compareText'
const dependencies = [
  'typed',
  'matrix'
]

export const createCompareText = /* #__PURE__ */ factory(name, dependencies, ({ typed, matrix }) => {
  const algorithm13 = createAlgorithm13({ typed })
  const algorithm14 = createAlgorithm14({ typed })

  /**
   * Compare two strings lexically. Comparison is case sensitive.
   * Returns 1 when x > y, -1 when x < y, and 0 when x == y.
   *
   * For matrices, the function is evaluated element wise.
   *
   * Syntax:
   *
   *    math.compareText(x, y)
   *
   * Examples:
   *
   *    math.compareText('B', 'A')     // returns 1
   *    math.compareText('2', '10')    // returns 1
   *    math.compare('2', '10')        // returns -1
   *    math.compareNatural('2', '10') // returns -1
   *
   *    math.compareText('B', ['A', 'B', 'C']) // returns [1, 0, -1]
   *
   * See also:
   *
   *    equal, equalText, compare, compareNatural
   *
   * @param  {string | Array | DenseMatrix} x First string to compare
   * @param  {string | Array | DenseMatrix} y Second string to compare
   * @return {number | Array | DenseMatrix} Returns the result of the comparison:
   *                                        1 when x > y, -1 when x < y, and 0 when x == y.
   */
  return typed(name, {

    'any, any': _compareText,

    'DenseMatrix, DenseMatrix': function (x, y) {
      return algorithm13(x, y, _compareText)
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

    'DenseMatrix, any': function (x, y) {
      return algorithm14(x, y, _compareText, false)
    },

    'any, DenseMatrix': function (x, y) {
      return algorithm14(y, x, _compareText, true)
    },

    'Array, any': function (x, y) {
      // use matrix implementation
      return algorithm14(matrix(x), y, _compareText, false).valueOf()
    },

    'any, Array': function (x, y) {
      // use matrix implementation
      return algorithm14(matrix(y), x, _compareText, true).valueOf()
    }
  })
})

export const createCompareTextNumber = /* #__PURE__ */ factory(name, ['typed'], ({ typed }) => {
  return typed(name, {
    'any, any': _compareText
  })
})
