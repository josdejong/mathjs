import { factory } from '../../utils/factory.js'
import { createMatAlgo03xDSf } from '../../type/matrix/utils/matAlgo03xDSf.js'
import { createMatAlgo07xSSf } from '../../type/matrix/utils/matAlgo07xSSf.js'
import { createMatAlgo12xSfs } from '../../type/matrix/utils/matAlgo12xSfs.js'
import { createMatAlgo14xDs } from '../../type/matrix/utils/matAlgo14xDs.js'
import { createMatAlgo13xDD } from '../../type/matrix/utils/matAlgo13xDD.js'

const name = 'unequal'
const dependencies = [
  'typed',
  'config',
  'equalScalar',
  'matrix',
  'DenseMatrix'
]

export const createUnequal = /* #__PURE__ */ factory(name, dependencies, ({ typed, config, equalScalar, matrix, DenseMatrix }) => {
  const matAlgo03xDSf = createMatAlgo03xDSf({ typed })
  const matAlgo07xSSf = createMatAlgo07xSSf({ typed, DenseMatrix })
  const matAlgo12xSfs = createMatAlgo12xSfs({ typed, DenseMatrix })
  const matAlgo13xDD = createMatAlgo13xDD({ typed })
  const matAlgo14xDs = createMatAlgo14xDs({ typed })

  /**
   * Test whether two values are unequal.
   *
   * The function tests whether the relative difference between x and y is
   * larger than the configured epsilon. The function cannot be used to compare
   * values smaller than approximately 2.22e-16.
   *
   * For matrices, the function is evaluated element wise.
   * In case of complex numbers, x.re must unequal y.re, or x.im must unequal y.im.
   * Strings are compared by their numerical value.
   *
   * Values `null` and `undefined` are compared strictly, thus `null` is unequal
   * with everything except `null`, and `undefined` is unequal with everything
   * except `undefined`.
   *
   * Syntax:
   *
   *    math.unequal(x, y)
   *
   * Examples:
   *
   *    math.unequal(2 + 2, 3)       // returns true
   *    math.unequal(2 + 2, 4)       // returns false
   *
   *    const a = math.unit('50 cm')
   *    const b = math.unit('5 m')
   *    math.unequal(a, b)           // returns false
   *
   *    const c = [2, 5, 1]
   *    const d = [2, 7, 1]
   *
   *    math.unequal(c, d)           // returns [false, true, false]
   *    math.deepEqual(c, d)         // returns false
   *
   *    math.unequal(0, null)        // returns true
   * See also:
   *
   *    equal, deepEqual, smaller, smallerEq, larger, largerEq, compare
   *
   * @param  {number | BigNumber | Fraction | boolean | Complex | Unit | string | Array | Matrix | undefined} x First value to compare
   * @param  {number | BigNumber | Fraction | boolean | Complex | Unit | string | Array | Matrix | undefined} y Second value to compare
   * @return {boolean | Array | Matrix} Returns true when the compared values are unequal, else returns false
   */
  return typed('unequal', {

    'any, any': function (x, y) {
      // strict equality for null and undefined?
      if (x === null) { return y !== null }
      if (y === null) { return x !== null }
      if (x === undefined) { return y !== undefined }
      if (y === undefined) { return x !== undefined }

      return _unequal(x, y)
    },

    'SparseMatrix, SparseMatrix': function (x, y) {
      return matAlgo07xSSf(x, y, _unequal)
    },

    'SparseMatrix, DenseMatrix': function (x, y) {
      return matAlgo03xDSf(y, x, _unequal, true)
    },

    'DenseMatrix, SparseMatrix': function (x, y) {
      return matAlgo03xDSf(x, y, _unequal, false)
    },

    'DenseMatrix, DenseMatrix': function (x, y) {
      return matAlgo13xDD(x, y, _unequal)
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
      return matAlgo12xSfs(x, y, _unequal, false)
    },

    'DenseMatrix, any': function (x, y) {
      return matAlgo14xDs(x, y, _unequal, false)
    },

    'any, SparseMatrix': function (x, y) {
      return matAlgo12xSfs(y, x, _unequal, true)
    },

    'any, DenseMatrix': function (x, y) {
      return matAlgo14xDs(y, x, _unequal, true)
    },

    'Array, any': function (x, y) {
      // use matrix implementation
      return matAlgo14xDs(matrix(x), y, _unequal, false).valueOf()
    },

    'any, Array': function (x, y) {
      // use matrix implementation
      return matAlgo14xDs(matrix(y), x, _unequal, true).valueOf()
    }
  })

  function _unequal (x, y) {
    return !equalScalar(x, y)
  }
})

export const createUnequalNumber = factory(name, ['typed', 'equalScalar'], ({ typed, equalScalar }) => {
  return typed(name, {
    'any, any': function (x, y) {
      // strict equality for null and undefined?
      if (x === null) { return y !== null }
      if (y === null) { return x !== null }
      if (x === undefined) { return y !== undefined }
      if (y === undefined) { return x !== undefined }

      return !equalScalar(x, y)
    }
  })
})
