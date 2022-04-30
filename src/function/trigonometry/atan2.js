import { factory } from '../../utils/factory.js'
import { createMatAlgo02xDS0 } from '../../type/matrix/utils/matAlgo02xDS0.js'
import { createMatAlgo03xDSf } from '../../type/matrix/utils/matAlgo03xDSf.js'
import { createMatAlgo09xS0Sf } from '../../type/matrix/utils/matAlgo09xS0Sf.js'
import { createMatAlgo11xS0s } from '../../type/matrix/utils/matAlgo11xS0s.js'
import { createMatAlgo12xSfs } from '../../type/matrix/utils/matAlgo12xSfs.js'
import { createMatAlgo13xDD } from '../../type/matrix/utils/matAlgo13xDD.js'
import { createMatAlgo14xDs } from '../../type/matrix/utils/matAlgo14xDs.js'

const name = 'atan2'
const dependencies = [
  'typed',
  'matrix',
  'equalScalar',
  'BigNumber',
  'DenseMatrix'
]

export const createAtan2 = /* #__PURE__ */ factory(name, dependencies, ({ typed, matrix, equalScalar, BigNumber, DenseMatrix }) => {
  const matAlgo02xDS0 = createMatAlgo02xDS0({ typed, equalScalar })
  const matAlgo03xDSf = createMatAlgo03xDSf({ typed })
  const matAlgo09xS0Sf = createMatAlgo09xS0Sf({ typed, equalScalar })
  const matAlgo11xS0s = createMatAlgo11xS0s({ typed, equalScalar })
  const matAlgo12xSfs = createMatAlgo12xSfs({ typed, DenseMatrix })
  const matAlgo13xDD = createMatAlgo13xDD({ typed })
  const matAlgo14xDs = createMatAlgo14xDs({ typed })

  /**
   * Calculate the inverse tangent function with two arguments, y/x.
   * By providing two arguments, the right quadrant of the computed angle can be
   * determined.
   *
   * For matrices, the function is evaluated element wise.
   *
   * Syntax:
   *
   *    math.atan2(y, x)
   *
   * Examples:
   *
   *    math.atan2(2, 2) / math.pi       // returns number 0.25
   *
   *    const angle = math.unit(60, 'deg') // returns Unit 60 deg
   *    const x = math.cos(angle)
   *    const y = math.sin(angle)
   *
   *    math.atan(2)             // returns Complex 1.5707963267948966 -1.3169578969248166 i
   *
   * See also:
   *
   *    tan, atan, sin, cos
   *
   * @param {number | Array | Matrix} y  Second dimension
   * @param {number | Array | Matrix} x  First dimension
   * @return {number | Array | Matrix} Four-quadrant inverse tangent
   */
  return typed(name, {

    'number, number': Math.atan2,

    // Complex numbers doesn't seem to have a reasonable implementation of
    // atan2(). Even Matlab removed the support, after they only calculated
    // the atan only on base of the real part of the numbers and ignored the imaginary.

    'BigNumber, BigNumber': function (y, x) {
      return BigNumber.atan2(y, x)
    },

    'SparseMatrix, SparseMatrix': function (x, y) {
      return matAlgo09xS0Sf(x, y, this, false)
    },

    'SparseMatrix, DenseMatrix': function (x, y) {
      // mind the order of y and x!
      return matAlgo02xDS0(y, x, this, true)
    },

    'DenseMatrix, SparseMatrix': function (x, y) {
      return matAlgo03xDSf(x, y, this, false)
    },

    'DenseMatrix, DenseMatrix': function (x, y) {
      return matAlgo13xDD(x, y, this)
    },

    'Array, Array': function (x, y) {
      return this(matrix(x), matrix(y)).valueOf()
    },

    'Array, Matrix': function (x, y) {
      return this(matrix(x), y)
    },

    'Matrix, Array': function (x, y) {
      return this(x, matrix(y))
    },

    'SparseMatrix, number | BigNumber': function (x, y) {
      return matAlgo11xS0s(x, y, this, false)
    },

    'DenseMatrix, number | BigNumber': function (x, y) {
      return matAlgo14xDs(x, y, this, false)
    },

    'number | BigNumber, SparseMatrix': function (x, y) {
      // mind the order of y and x
      return matAlgo12xSfs(y, x, this, true)
    },

    'number | BigNumber, DenseMatrix': function (x, y) {
      // mind the order of y and x
      return matAlgo14xDs(y, x, this, true)
    },

    'Array, number | BigNumber': function (x, y) {
      return matAlgo14xDs(matrix(x), y, this, false).valueOf()
    },

    'number | BigNumber, Array': function (x, y) {
      return matAlgo14xDs(matrix(y), x, this, true).valueOf()
    }
  })
})
