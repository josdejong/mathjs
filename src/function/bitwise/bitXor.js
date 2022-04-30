import { bitXor as bigBitXor } from '../../utils/bignumber/bitwise.js'
import { createMatAlgo03xDSf } from '../../type/matrix/utils/matAlgo03xDSf.js'
import { createMatAlgo07xSSf } from '../../type/matrix/utils/matAlgo07xSSf.js'
import { createMatAlgo12xSfs } from '../../type/matrix/utils/matAlgo12xSfs.js'
import { createMatAlgo13xDD } from '../../type/matrix/utils/matAlgo13xDD.js'
import { createMatAlgo14xDs } from '../../type/matrix/utils/matAlgo14xDs.js'
import { factory } from '../../utils/factory.js'
import { bitXorNumber } from '../../plain/number/index.js'

const name = 'bitXor'
const dependencies = [
  'typed',
  'matrix',
  'DenseMatrix'
]

export const createBitXor = /* #__PURE__ */ factory(name, dependencies, ({ typed, matrix, DenseMatrix }) => {
  const matAlgo03xDSf = createMatAlgo03xDSf({ typed })
  const matAlgo07xSSf = createMatAlgo07xSSf({ typed, DenseMatrix })
  const matAlgo12xSfs = createMatAlgo12xSfs({ typed, DenseMatrix })
  const matAlgo13xDD = createMatAlgo13xDD({ typed })
  const matAlgo14xDs = createMatAlgo14xDs({ typed })

  /**
   * Bitwise XOR two values, `x ^ y`.
   * For matrices, the function is evaluated element wise.
   *
   * Syntax:
   *
   *    math.bitXor(x, y)
   *
   * Examples:
   *
   *    math.bitXor(1, 2)               // returns number 3
   *
   *    math.bitXor([2, 3, 4], 4)       // returns Array [6, 7, 0]
   *
   * See also:
   *
   *    bitAnd, bitNot, bitOr, leftShift, rightArithShift, rightLogShift
   *
   * @param  {number | BigNumber | Array | Matrix} x First value to xor
   * @param  {number | BigNumber | Array | Matrix} y Second value to xor
   * @return {number | BigNumber | Array | Matrix} XOR of `x` and `y`
   */
  return typed(name, {

    'number, number': bitXorNumber,

    'BigNumber, BigNumber': bigBitXor,

    'SparseMatrix, SparseMatrix': function (x, y) {
      return matAlgo07xSSf(x, y, this)
    },

    'SparseMatrix, DenseMatrix': function (x, y) {
      return matAlgo03xDSf(y, x, this, true)
    },

    'DenseMatrix, SparseMatrix': function (x, y) {
      return matAlgo03xDSf(x, y, this, false)
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
      return matAlgo12xSfs(x, y, this, false)
    },

    'DenseMatrix, any': function (x, y) {
      return matAlgo14xDs(x, y, this, false)
    },

    'any, SparseMatrix': function (x, y) {
      return matAlgo12xSfs(y, x, this, true)
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
