import { factory } from '../../utils/factory.js'
import { createMatAlgo03xDSf } from '../../type/matrix/utils/matAlgo03xDSf.js'
import { createMatAlgo07xSSf } from '../../type/matrix/utils/matAlgo07xSSf.js'
import { createMatAlgo12xSfs } from '../../type/matrix/utils/matAlgo12xSfs.js'
import { createMatAlgo13xDD } from '../../type/matrix/utils/matAlgo13xDD.js'
import { createMatAlgo14xDs } from '../../type/matrix/utils/matAlgo14xDs.js'

const name = 'equal'
const dependencies = [
  'typed',
  'matrix',
  'equalScalar',
  'DenseMatrix'
]

export const createEqual = /* #__PURE__ */ factory(name, dependencies, ({ typed, matrix, equalScalar, DenseMatrix }) => {
  const matAlgo03xDSf = createMatAlgo03xDSf({ typed })
  const matAlgo07xSSf = createMatAlgo07xSSf({ typed, DenseMatrix })
  const matAlgo12xSfs = createMatAlgo12xSfs({ typed, DenseMatrix })
  const matAlgo13xDD = createMatAlgo13xDD({ typed })
  const matAlgo14xDs = createMatAlgo14xDs({ typed })

  /**
   * Test whether two values are equal.
   *
   * The function tests whether the relative difference between x and y is
   * smaller than the configured epsilon. The function cannot be used to
   * compare values smaller than approximately 2.22e-16.
   *
   * For matrices, the function is evaluated element wise.
   * In case of complex numbers, x.re must equal y.re, and x.im must equal y.im.
   *
   * Values `null` and `undefined` are compared strictly, thus `null` is only
   * equal to `null` and nothing else, and `undefined` is only equal to
   * `undefined` and nothing else. Strings are compared by their numerical value.
   *
   * Syntax:
   *
   *    math.equal(x, y)
   *
   * Examples:
   *
   *    math.equal(2 + 2, 3)         // returns false
   *    math.equal(2 + 2, 4)         // returns true
   *
   *    const a = math.unit('50 cm')
   *    const b = math.unit('5 m')
   *    math.equal(a, b)             // returns true
   *
   *    const c = [2, 5, 1]
   *    const d = [2, 7, 1]
   *
   *    math.equal(c, d)             // returns [true, false, true]
   *    math.deepEqual(c, d)         // returns false
   *
   *    math.equal("1000", "1e3")    // returns true
   *    math.equal(0, null)          // returns false
   *
   * See also:
   *
   *    unequal, smaller, smallerEq, larger, largerEq, compare, deepEqual, equalText
   *
   * @param  {number | BigNumber | boolean | Complex | Unit | string | Array | Matrix} x First value to compare
   * @param  {number | BigNumber | boolean | Complex | Unit | string | Array | Matrix} y Second value to compare
   * @return {boolean | Array | Matrix} Returns true when the compared values are equal, else returns false
   */
  return typed(name, {

    'any, any': function (x, y) {
      // strict equality for null and undefined?
      if (x === null) { return y === null }
      if (y === null) { return x === null }
      if (x === undefined) { return y === undefined }
      if (y === undefined) { return x === undefined }

      return equalScalar(x, y)
    },

    'SparseMatrix, SparseMatrix': function (x, y) {
      return matAlgo07xSSf(x, y, equalScalar)
    },

    'SparseMatrix, DenseMatrix': function (x, y) {
      return matAlgo03xDSf(y, x, equalScalar, true)
    },

    'DenseMatrix, SparseMatrix': function (x, y) {
      return matAlgo03xDSf(x, y, equalScalar, false)
    },

    'DenseMatrix, DenseMatrix': function (x, y) {
      return matAlgo13xDD(x, y, equalScalar)
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
      return matAlgo12xSfs(x, y, equalScalar, false)
    },

    'DenseMatrix, any': function (x, y) {
      return matAlgo14xDs(x, y, equalScalar, false)
    },

    'any, SparseMatrix': function (x, y) {
      return matAlgo12xSfs(y, x, equalScalar, true)
    },

    'any, DenseMatrix': function (x, y) {
      return matAlgo14xDs(y, x, equalScalar, true)
    },

    'Array, any': function (x, y) {
      // use matrix implementation
      return matAlgo14xDs(matrix(x), y, equalScalar, false).valueOf()
    },

    'any, Array': function (x, y) {
      // use matrix implementation
      return matAlgo14xDs(matrix(y), x, equalScalar, true).valueOf()
    }
  })
})

export const createEqualNumber = factory(name, ['typed', 'equalScalar'], ({ typed, equalScalar }) => {
  return typed(name, {
    'any, any': function (x, y) {
      // strict equality for null and undefined?
      if (x === null) { return y === null }
      if (y === null) { return x === null }
      if (x === undefined) { return y === undefined }
      if (y === undefined) { return x === undefined }

      return equalScalar(x, y)
    }
  })
})
