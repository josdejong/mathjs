'use strict'

const extend = require('../../utils/object').extend

function factory (type, config, load, typed) {
  const divideScalar = load(require('./divideScalar'))
  const multiply = load(require('./multiply'))
  const inv = load(require('../matrix/inv'))
  const matrix = load(require('../../type/matrix/function/matrix'))

  const algorithm11 = load(require('../../type/matrix/utils/algorithm11'))
  const algorithm14 = load(require('../../type/matrix/utils/algorithm14'))

  /**
   * Divide two values, `x / y`.
   * To divide matrices, `x` is multiplied with the inverse of `y`: `x * inv(y)`.
   *
   * Syntax:
   *
   *    math.divide(x, y)
   *
   * Examples:
   *
   *    math.divide(2, 3)            // returns number 0.6666666666666666
   *
   *    const a = math.complex(5, 14)
   *    const b = math.complex(4, 1)
   *    math.divide(a, b)            // returns Complex 2 + 3i
   *
   *    const c = [[7, -6], [13, -4]]
   *    const d = [[1, 2], [4, 3]]
   *    math.divide(c, d)            // returns Array [[-9, 4], [-11, 6]]
   *
   *    const e = math.unit('18 km')
   *    math.divide(e, 4.5)          // returns Unit 4 km
   *
   * See also:
   *
   *    multiply
   *
   * @param  {number | BigNumber | Fraction | Complex | Unit | Array | Matrix} x   Numerator
   * @param  {number | BigNumber | Fraction | Complex | Array | Matrix} y          Denominator
   * @return {number | BigNumber | Fraction | Complex | Unit | Array | Matrix}                      Quotient, `x / y`
   */
  const divide = typed('divide', extend({
    // we extend the signatures of divideScalar with signatures dealing with matrices

    'Array | Matrix, Array | Matrix': function (x, y) {
      // TODO: implement matrix right division using pseudo inverse
      // http://www.mathworks.nl/help/matlab/ref/mrdivide.html
      // http://www.gnu.org/software/octave/doc/interpreter/Arithmetic-Ops.html
      // http://stackoverflow.com/questions/12263932/how-does-gnu-octave-matrix-division-work-getting-unexpected-behaviour
      return multiply(x, inv(y))
    },

    'DenseMatrix, any': function (x, y) {
      return algorithm14(x, y, divideScalar, false)
    },

    'SparseMatrix, any': function (x, y) {
      return algorithm11(x, y, divideScalar, false)
    },

    'Array, any': function (x, y) {
      // use matrix implementation
      return algorithm14(matrix(x), y, divideScalar, false).valueOf()
    },

    'any, Array | Matrix': function (x, y) {
      return multiply(x, inv(y))
    }
  }, divideScalar.signatures))

  divide.toTex = { 2: `\\frac{\${args[0]}}{\${args[1]}}` }

  return divide
}

exports.name = 'divide'
exports.factory = factory
