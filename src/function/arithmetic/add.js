import { factory } from '../../utils/factory'
import { extend } from '../../utils/object'
import { createAlgorithm01 } from '../../type/matrix/utils/algorithm01'
import { createAlgorithm04 } from '../../type/matrix/utils/algorithm04'
import { createAlgorithm10 } from '../../type/matrix/utils/algorithm10'
import { createAlgorithm13 } from '../../type/matrix/utils/algorithm13'
import { createAlgorithm14 } from '../../type/matrix/utils/algorithm14'

const name = 'add'
const dependencies = [
  'typed',
  'matrix',
  'addScalar',
  'equalScalar',
  'DenseMatrix',
  'SparseMatrix'
]

export const createAdd = /* #__PURE__ */ factory(name, dependencies, ({ typed, matrix, addScalar, equalScalar, DenseMatrix, SparseMatrix }) => {
  const algorithm01 = createAlgorithm01({ typed })
  const algorithm04 = createAlgorithm04({ typed, equalScalar })
  const algorithm10 = createAlgorithm10({ typed, DenseMatrix })
  const algorithm13 = createAlgorithm13({ typed })
  const algorithm14 = createAlgorithm14({ typed })

  /**
   * Add two or more values, `x + y`.
   * For matrices, the function is evaluated element wise.
   *
   * Syntax:
   *
   *    math.add(x, y)
   *    math.add(x, y, z, ...)
   *
   * Examples:
   *
   *    math.add(2, 3)               // returns number 5
   *    math.add(2, 3, 4)            // returns number 9
   *
   *    const a = math.complex(2, 3)
   *    const b = math.complex(-4, 1)
   *    math.add(a, b)               // returns Complex -2 + 4i
   *
   *    math.add([1, 2, 3], 4)       // returns Array [5, 6, 7]
   *
   *    const c = math.unit('5 cm')
   *    const d = math.unit('2.1 mm')
   *    math.add(c, d)               // returns Unit 52.1 mm
   *
   *    math.add("2.3", "4")         // returns number 6.3
   *
   * See also:
   *
   *    subtract, sum
   *
   * @param  {number | BigNumber | Fraction | Complex | Unit | Array | Matrix} x First value to add
   * @param  {number | BigNumber | Fraction | Complex | Unit | Array | Matrix} y Second value to add
   * @return {number | BigNumber | Fraction | Complex | Unit | Array | Matrix} Sum of `x` and `y`
   */
  return typed(name, extend({
    // we extend the signatures of addScalar with signatures dealing with matrices

    'DenseMatrix, DenseMatrix': function (x, y) {
      return algorithm13(x, y, addScalar)
    },

    'DenseMatrix, SparseMatrix': function (x, y) {
      return algorithm01(x, y, addScalar, false)
    },

    'SparseMatrix, DenseMatrix': function (x, y) {
      return algorithm01(y, x, addScalar, true)
    },

    'SparseMatrix, SparseMatrix': function (x, y) {
      return algorithm04(x, y, addScalar)
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
      return algorithm14(x, y, addScalar, false)
    },

    'SparseMatrix, any': function (x, y) {
      return algorithm10(x, y, addScalar, false)
    },

    'any, DenseMatrix': function (x, y) {
      return algorithm14(y, x, addScalar, true)
    },

    'any, SparseMatrix': function (x, y) {
      return algorithm10(y, x, addScalar, true)
    },

    'Array, any': function (x, y) {
      // use matrix implementation
      return algorithm14(matrix(x), y, addScalar, false).valueOf()
    },

    'any, Array': function (x, y) {
      // use matrix implementation
      return algorithm14(matrix(y), x, addScalar, true).valueOf()
    },

    'any, any': addScalar,

    'any, any, ...any': function (x, y, rest) {
      let result = this(x, y)

      for (let i = 0; i < rest.length; i++) {
        result = this(result, rest[i])
      }

      return result
    }
  }, addScalar.signatures))
})
