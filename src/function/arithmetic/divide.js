import { factory } from '../../utils/factory.js'
import { extend } from '../../utils/object.js'
import { createMatAlgo11xS0s } from '../../type/matrix/utils/matAlgo11xS0s.js'
import { createMatAlgo14xDs } from '../../type/matrix/utils/matAlgo14xDs.js'

const name = 'divide'
const dependencies = [
  'typed',
  'matrix',
  'multiply',
  'equalScalar',
  'divideScalar',
  'inv'
]

export const createDivide = /* #__PURE__ */ factory(name, dependencies, ({ typed, matrix, multiply, equalScalar, divideScalar, inv }) => {
  const matAlgo11xS0s = createMatAlgo11xS0s({ typed, equalScalar })
  const matAlgo14xDs = createMatAlgo14xDs({ typed })

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
   * @param  {number | BigNumber | bigint | Fraction | Complex | Unit | Array | Matrix} x   Numerator
   * @param  {number | BigNumber | bigint | Fraction | Complex | Array | Matrix} y          Denominator
   * @return {number | BigNumber | bigint | Fraction | Complex | Unit | Array | Matrix}                      Quotient, `x / y`
   */
  return typed('divide', extend({
    // we extend the signatures of divideScalar with signatures dealing with matrices

    'Array | Matrix, Array | Matrix': function (x, y) {
      // TODO: implement matrix right division using pseudo inverse
      // https://www.mathworks.nl/help/matlab/ref/mrdivide.html
      // https://www.gnu.org/software/octave/doc/interpreter/Arithmetic-Ops.html
      // https://stackoverflow.com/questions/12263932/how-does-gnu-octave-matrix-division-work-getting-unexpected-behaviour
      return multiply(x, inv(y))
    },

    'DenseMatrix, any': function (x, y) {
      return matAlgo14xDs(x, y, divideScalar, false)
    },

    'SparseMatrix, any': function (x, y) {
      return matAlgo11xS0s(x, y, divideScalar, false)
    },

    'Array, any': function (x, y) {
      // use matrix implementation
      return matAlgo14xDs(matrix(x), y, divideScalar, false).valueOf()
    },

    'any, Array | Matrix': function (x, y) {
      return multiply(x, inv(y))
    }
  }, divideScalar.signatures))
})
