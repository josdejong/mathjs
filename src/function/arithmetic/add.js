import { factory } from '../../utils/factory.js'
import { extend } from '../../utils/object.js'
import { createMatAlgo01xDSid } from '../../type/matrix/utils/matAlgo01xDSid.js'
import { createMatAlgo04xSidSid } from '../../type/matrix/utils/matAlgo04xSidSid.js'
import { createMatAlgo10xSids } from '../../type/matrix/utils/matAlgo10xSids.js'
import { createMatAlgo13xDD } from '../../type/matrix/utils/matAlgo13xDD.js'
import { createMatAlgo14xDs } from '../../type/matrix/utils/matAlgo14xDs.js'

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
  const matAlgo01xDSid = createMatAlgo01xDSid({ typed })
  const matAlgo04xSidSid = createMatAlgo04xSidSid({ typed, equalScalar })
  const matAlgo10xSids = createMatAlgo10xSids({ typed, DenseMatrix })
  const matAlgo13xDD = createMatAlgo13xDD({ typed })
  const matAlgo14xDs = createMatAlgo14xDs({ typed })

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
      return matAlgo13xDD(x, y, addScalar)
    },

    'DenseMatrix, SparseMatrix': function (x, y) {
      return matAlgo01xDSid(x, y, addScalar, false)
    },

    'SparseMatrix, DenseMatrix': function (x, y) {
      return matAlgo01xDSid(y, x, addScalar, true)
    },

    'SparseMatrix, SparseMatrix': function (x, y) {
      return matAlgo04xSidSid(x, y, addScalar)
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
      return matAlgo14xDs(x, y, addScalar, false)
    },

    'SparseMatrix, any': function (x, y) {
      return matAlgo10xSids(x, y, addScalar, false)
    },

    'any, DenseMatrix': function (x, y) {
      return matAlgo14xDs(y, x, addScalar, true)
    },

    'any, SparseMatrix': function (x, y) {
      return matAlgo10xSids(y, x, addScalar, true)
    },

    'Array, any': function (x, y) {
      // use matrix implementation
      return matAlgo14xDs(matrix(x), y, addScalar, false).valueOf()
    },

    'any, Array': function (x, y) {
      // use matrix implementation
      return matAlgo14xDs(matrix(y), x, addScalar, true).valueOf()
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
