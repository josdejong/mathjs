import { createMatAlgo02xDS0 } from '../../type/matrix/utils/matAlgo02xDS0.js'
import { createMatAlgo11xS0s } from '../../type/matrix/utils/matAlgo11xS0s.js'
import { createMatAlgo14xDs } from '../../type/matrix/utils/matAlgo14xDs.js'
import { createMatAlgo01xDSid } from '../../type/matrix/utils/matAlgo01xDSid.js'
import { createMatAlgo10xSids } from '../../type/matrix/utils/matAlgo10xSids.js'
import { createMatAlgo08xS0Sid } from '../../type/matrix/utils/matAlgo08xS0Sid.js'
import { factory } from '../../utils/factory.js'
import { createMatrixAlgorithmSuite } from '../../type/matrix/utils/matrixAlgorithmSuite.js'
import { leftShiftNumber } from '../../plain/number/index.js'
import { leftShiftBigNumber } from '../../utils/bignumber/bitwise.js'

const name = 'leftShift'
const dependencies = [
  'typed',
  'matrix',
  'equalScalar',
  'zeros',
  'DenseMatrix'
]

export const createLeftShift = /* #__PURE__ */ factory(name, dependencies, ({ typed, matrix, equalScalar, zeros, DenseMatrix }) => {
  const matAlgo01xDSid = createMatAlgo01xDSid({ typed })
  const matAlgo02xDS0 = createMatAlgo02xDS0({ typed, equalScalar })
  const matAlgo08xS0Sid = createMatAlgo08xS0Sid({ typed, equalScalar })
  const matAlgo10xSids = createMatAlgo10xSids({ typed, DenseMatrix })
  const matAlgo11xS0s = createMatAlgo11xS0s({ typed, equalScalar })
  const matAlgo14xDs = createMatAlgo14xDs({ typed })
  const matrixAlgorithmSuite = createMatrixAlgorithmSuite({ typed, matrix })

  /**
   * Bitwise left logical shift of a value x by y number of bits, `x << y`.
   * For matrices, the function is evaluated element wise.
   * For units, the function is evaluated on the best prefix base.
   *
   * Syntax:
   *
   *    math.leftShift(x, y)
   *
   * Examples:
   *
   *    math.leftShift(1, 2)               // returns number 4
   *
   *    math.leftShift([1, 2, 3], 4)       // returns Array [16, 32, 64]
   *
   * See also:
   *
   *    leftShift, bitNot, bitOr, bitXor, rightArithShift, rightLogShift
   *
   * @param  {number | BigNumber | Array | Matrix} x Value to be shifted
   * @param  {number | BigNumber} y Amount of shifts
   * @return {number | BigNumber | Array | Matrix} `x` shifted left `y` times
   */
  return typed(
    name,
    {
      'number, number': leftShiftNumber,

      'BigNumber, BigNumber': leftShiftBigNumber,

      'SparseMatrix, number | BigNumber': function (x, y) {
        // check scalar
        if (equalScalar(y, 0)) {
          return x.clone()
        }
        return matAlgo11xS0s(x, y, this, false)
      },

      'DenseMatrix, number | BigNumber': function (x, y) {
        // check scalar
        if (equalScalar(y, 0)) {
          return x.clone()
        }
        return matAlgo14xDs(x, y, this, false)
      },

      'number | BigNumber, SparseMatrix': function (x, y) {
        // check scalar
        if (equalScalar(x, 0)) {
          return zeros(y.size(), y.storage())
        }
        return matAlgo10xSids(y, x, this, true)
      },

      'number | BigNumber, DenseMatrix': function (x, y) {
        // check scalar
        if (equalScalar(x, 0)) {
          return zeros(y.size(), y.storage())
        }
        return matAlgo14xDs(y, x, this, true)
      },

      'Array, number | BigNumber': function (x, y) {
        // use matrix implementation
        return this(matrix(x), y).valueOf()
      },

      'number | BigNumber, Array': function (x, y) {
        // use matrix implementation
        return this(x, matrix(y)).valueOf()
      }
    },
    matrixAlgorithmSuite({
      SS: matAlgo08xS0Sid,
      DS: matAlgo01xDSid,
      SD: matAlgo02xDS0
    })
  )
})
