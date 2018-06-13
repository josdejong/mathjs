'use strict'

const extend = require('../../utils/object').extend

function factory (type, config, load, typed) {
  const matrix = load(require('../../type/matrix/function/matrix'))
  const addScalar = load(require('./addScalar'))
  const latex = require('../../utils/latex.js')

  const algorithm01 = load(require('../../type/matrix/utils/algorithm01'))
  const algorithm04 = load(require('../../type/matrix/utils/algorithm04'))
  const algorithm10 = load(require('../../type/matrix/utils/algorithm10'))
  const algorithm13 = load(require('../../type/matrix/utils/algorithm13'))
  const algorithm14 = load(require('../../type/matrix/utils/algorithm14'))

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
  const add = typed('add', extend({
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
      return add(matrix(x), matrix(y)).valueOf()
    },

    'Array, Matrix': function (x, y) {
      // use matrix implementation
      return add(matrix(x), y)
    },

    'Matrix, Array': function (x, y) {
      // use matrix implementation
      return add(x, matrix(y))
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
      let result = add(x, y)

      for (let i = 0; i < rest.length; i++) {
        result = add(result, rest[i])
      }

      return result
    }
  }, addScalar.signatures))

  add.toTex = {
    2: `\\left(\${args[0]}${latex.operators['add']}\${args[1]}\\right)`
  }

  return add
}

exports.name = 'add'
exports.factory = factory
