import { bitOrBigNumber } from '../../utils/bignumber/bitwise.js'
import { factory } from '../../utils/factory.js'
import { createMatAlgo14xDs } from '../../type/matrix/utils/matAlgo14xDs.js'
import { createMatAlgo13xDD } from '../../type/matrix/utils/matAlgo13xDD.js'
import { createMatAlgo10xSids } from '../../type/matrix/utils/matAlgo10xSids.js'
import { createMatAlgo04xSidSid } from '../../type/matrix/utils/matAlgo04xSidSid.js'
import { createMatAlgo01xDSid } from '../../type/matrix/utils/matAlgo01xDSid.js'
import { bitOrNumber } from '../../plain/number/index.js'

const name = 'bitOr'
const dependencies = [
  'typed',
  'matrix',
  'equalScalar',
  'DenseMatrix'
]

export const createBitOr = /* #__PURE__ */ factory(name, dependencies, ({ typed, matrix, equalScalar, DenseMatrix }) => {
  const matAlgo01xDSid = createMatAlgo01xDSid({ typed })
  const matAlgo04xSidSid = createMatAlgo04xSidSid({ typed, equalScalar })
  const matAlgo10xSids = createMatAlgo10xSids({ typed, DenseMatrix })
  const matAlgo13xDD = createMatAlgo13xDD({ typed })
  const matAlgo14xDs = createMatAlgo14xDs({ typed })

  /**
   * Bitwise OR two values, `x | y`.
   * For matrices, the function is evaluated element wise.
   * For units, the function is evaluated on the lowest print base.
   *
   * Syntax:
   *
   *    math.bitOr(x, y)
   *
   * Examples:
   *
   *    math.bitOr(1, 2)               // returns number 3
   *
   *    math.bitOr([1, 2, 3], 4)       // returns Array [5, 6, 7]
   *
   * See also:
   *
   *    bitAnd, bitNot, bitXor, leftShift, rightArithShift, rightLogShift
   *
   * @param  {number | BigNumber | Array | Matrix} x First value to or
   * @param  {number | BigNumber | Array | Matrix} y Second value to or
   * @return {number | BigNumber | Array | Matrix} OR of `x` and `y`
   */
  return typed(name, {

    'number, number': bitOrNumber,

    'BigNumber, BigNumber': bitOrBigNumber,

    'SparseMatrix, SparseMatrix': function (x, y) {
      return matAlgo04xSidSid(x, y, this)
    },

    'SparseMatrix, DenseMatrix': function (x, y) {
      return matAlgo01xDSid(y, x, this, true)
    },

    'DenseMatrix, SparseMatrix': function (x, y) {
      return matAlgo01xDSid(x, y, this, false)
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

    'SparseMatrix, any': function (x, y) {
      return matAlgo10xSids(x, y, this, false)
    },

    'DenseMatrix, any': function (x, y) {
      return matAlgo14xDs(x, y, this, false)
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
