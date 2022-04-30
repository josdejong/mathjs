import { factory } from '../../utils/factory.js'
import { DimensionError } from '../../error/DimensionError.js'
import { createMatAlgo01xDSid } from '../../type/matrix/utils/matAlgo01xDSid.js'
import { createMatAlgo03xDSf } from '../../type/matrix/utils/matAlgo03xDSf.js'
import { createMatAlgo05xSfSf } from '../../type/matrix/utils/matAlgo05xSfSf.js'
import { createMatAlgo10xSids } from '../../type/matrix/utils/matAlgo10xSids.js'
import { createMatAlgo13xDD } from '../../type/matrix/utils/matAlgo13xDD.js'
import { createMatAlgo14xDs } from '../../type/matrix/utils/matAlgo14xDs.js'

const name = 'subtract'
const dependencies = [
  'typed',
  'matrix',
  'equalScalar',
  'addScalar',
  'unaryMinus',
  'DenseMatrix'
]

export const createSubtract = /* #__PURE__ */ factory(name, dependencies, ({ typed, matrix, equalScalar, addScalar, unaryMinus, DenseMatrix }) => {
  // TODO: split function subtract in two: subtract and subtractScalar

  const matAlgo01xDSid = createMatAlgo01xDSid({ typed })
  const matAlgo03xDSf = createMatAlgo03xDSf({ typed })
  const matAlgo05xSfSf = createMatAlgo05xSfSf({ typed, equalScalar })
  const matAlgo10xSids = createMatAlgo10xSids({ typed, DenseMatrix })
  const matAlgo13xDD = createMatAlgo13xDD({ typed })
  const matAlgo14xDs = createMatAlgo14xDs({ typed })

  /**
   * Subtract two values, `x - y`.
   * For matrices, the function is evaluated element wise.
   *
   * Syntax:
   *
   *    math.subtract(x, y)
   *
   * Examples:
   *
   *    math.subtract(5.3, 2)        // returns number 3.3
   *
   *    const a = math.complex(2, 3)
   *    const b = math.complex(4, 1)
   *    math.subtract(a, b)          // returns Complex -2 + 2i
   *
   *    math.subtract([5, 7, 4], 4)  // returns Array [1, 3, 0]
   *
   *    const c = math.unit('2.1 km')
   *    const d = math.unit('500m')
   *    math.subtract(c, d)          // returns Unit 1.6 km
   *
   * See also:
   *
   *    add
   *
   * @param  {number | BigNumber | Fraction | Complex | Unit | Array | Matrix} x
   *            Initial value
   * @param  {number | BigNumber | Fraction | Complex | Unit | Array | Matrix} y
   *            Value to subtract from `x`
   * @return {number | BigNumber | Fraction | Complex | Unit | Array | Matrix}
   *            Subtraction of `x` and `y`
   */
  return typed(name, {

    'number, number': function (x, y) {
      return x - y
    },

    'Complex, Complex': function (x, y) {
      return x.sub(y)
    },

    'BigNumber, BigNumber': function (x, y) {
      return x.minus(y)
    },

    'Fraction, Fraction': function (x, y) {
      return x.sub(y)
    },

    'Unit, Unit': function (x, y) {
      if (x.value === null) {
        throw new Error('Parameter x contains a unit with undefined value')
      }

      if (y.value === null) {
        throw new Error('Parameter y contains a unit with undefined value')
      }

      if (!x.equalBase(y)) {
        throw new Error('Units do not match')
      }

      const res = x.clone()
      res.value = this(res.value, y.value)
      res.fixPrefix = false

      return res
    },

    'SparseMatrix, SparseMatrix': function (x, y) {
      checkEqualDimensions(x, y)
      return matAlgo05xSfSf(x, y, this)
    },

    'SparseMatrix, DenseMatrix': function (x, y) {
      checkEqualDimensions(x, y)
      return matAlgo03xDSf(y, x, this, true)
    },

    'DenseMatrix, SparseMatrix': function (x, y) {
      checkEqualDimensions(x, y)
      return matAlgo01xDSid(x, y, this, false)
    },

    'DenseMatrix, DenseMatrix': function (x, y) {
      checkEqualDimensions(x, y)
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

    'SparseMatrix, any': function (x, y) {
      return matAlgo10xSids(x, unaryMinus(y), addScalar)
    },

    'DenseMatrix, any': function (x, y) {
      return matAlgo14xDs(x, y, this)
    },

    'any, SparseMatrix': function (x, y) {
      return matAlgo10xSids(y, x, this, true)
    },

    'any, DenseMatrix': function (x, y) {
      return matAlgo14xDs(y, x, this, true)
    },

    'Array, any': function (x, y) {
      // use matrix implementation
      return matAlgo14xDs(matrix(x), y, this, false).valueOf()
    },

    'any, Array': function (x, y) {
      // use matrix implementation
      return matAlgo14xDs(matrix(y), x, this, true).valueOf()
    }
  })
})

/**
 * Check whether matrix x and y have the same number of dimensions.
 * Throws a DimensionError when dimensions are not equal
 * @param {Matrix} x
 * @param {Matrix} y
 */
function checkEqualDimensions (x, y) {
  const xsize = x.size()
  const ysize = y.size()

  if (xsize.length !== ysize.length) {
    throw new DimensionError(xsize.length, ysize.length)
  }
}
