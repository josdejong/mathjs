import { createMatAlgo02xDS0 } from '../../type/matrix/utils/matAlgo02xDS0.js'
import { createMatAlgo11xS0s } from '../../type/matrix/utils/matAlgo11xS0s.js'
import { createMatAlgo14xDs } from '../../type/matrix/utils/matAlgo14xDs.js'
import { createMatAlgo03xDSf } from '../../type/matrix/utils/matAlgo03xDSf.js'
import { createMatAlgo10xSids } from '../../type/matrix/utils/matAlgo10xSids.js'
import { createMatAlgo09xS0Sf } from '../../type/matrix/utils/matAlgo09xS0Sf.js'
import { createMatAlgo15xAs } from '../../type/matrix/utils/matAlgo15xAs.js'
import { factory } from '../../utils/factory.js'
import { createMatrixAlgorithmSuite } from '../../type/matrix/utils/matrixAlgorithmSuite.js'
import { rightLogShiftNumber } from '../../plain/number/index.js'
import { deepMap } from '../../utils/array.js'

const name = 'rightLogShift'
const dependencies = [
  'typed',
  'matrix',
  'equalScalar',
  'zeros',
  'DenseMatrix'
]

export const createRightLogShift = /* #__PURE__ */ factory(name, dependencies, ({ typed, matrix, equalScalar, zeros, DenseMatrix }) => {
  const matAlgo02xDS0 = createMatAlgo02xDS0({ typed })
  const matAlgo03xDSf = createMatAlgo03xDSf({ typed })
  const matAlgo09xS0Sf = createMatAlgo09xS0Sf({ typed })
  const matAlgo10xSids = createMatAlgo10xSids({ typed, DenseMatrix })
  const matAlgo11xS0s = createMatAlgo11xS0s({ typed, equalScalar })
  const matAlgo14xDs = createMatAlgo14xDs({ typed })
  const matAlgo15xAs = createMatAlgo15xAs()
  const matrixAlgorithmSuite = createMatrixAlgorithmSuite({ typed, matrix })

  /**
   * Bitwise right logical shift of value x by y number of bits, `x >>> y`.
   * For matrices, the function is evaluated element wise.
   * For units, the function is evaluated on the best prefix base.
   *
   * Syntax:
   *
   *    math.rightLogShift(x, y)
   *
   * Examples:
   *
   *    math.rightLogShift(4, 2)               // returns number 1
   *
   *    math.rightLogShift([16, 32, 64], 4)    // returns Array [1, 2, 4]
   *
   * See also:
   *
   *    bitAnd, bitNot, bitOr, bitXor, leftShift, rightLogShift
   *
   * History:
   *
   *    v11.6  Support matrix broadcasting
   *    v1.2   Created
   *
   * @param  {number | Array | Matrix} x Value to be shifted
   * @param  {number} y Amount of shifts
   * @return {number | Array | Matrix} `x` zero-filled shifted right `y` times
   */

  return typed(
    name,
    {
      'number, number': rightLogShiftNumber,

      // 'BigNumber, BigNumber': ..., // TODO: implement BigNumber support for rightLogShift

      // note that x >>> 0 is not x for a negative x, so there is no shortcut
      // for shifting a matrix by zero
      'SparseMatrix, number | BigNumber': typed.referToSelf(self => (x, y) => {
        return matAlgo11xS0s(x, y, self, false)
      }),

      'DenseMatrix, number | BigNumber': typed.referToSelf(self => (x, y) => {
        return matAlgo14xDs(x, y, self, false)
      }),

      'Array, number | BigNumber': typed.referToSelf(self => (x, y) => {
        return matAlgo15xAs(x, y, self, false)
      }),

      'number | BigNumber, SparseMatrix': typed.referToSelf(self => (x, y) => {
        // check scalar
        if (equalScalar(x, 0)) {
          return zeros(y.size(), y.storage())
        }
        return matAlgo10xSids(y, x, self, true)
      }),

      'number | BigNumber, DenseMatrix': typed.referToSelf(self => (x, y) => {
        // check scalar
        if (equalScalar(x, 0)) {
          return zeros(y.size(), y.storage())
        }
        return matAlgo14xDs(y, x, self, true)
      }),

      'number | BigNumber, Array': typed.referToSelf(self => (x, y) => {
        // check scalar
        if (equalScalar(x, 0)) {
          return deepMap(y, () => x)
        }
        return matAlgo15xAs(y, x, self, true)
      })
    },
    matrixAlgorithmSuite({
      // a zero shift still has to be evaluated: x >>> 0 is not x for x < 0
      SS: matAlgo09xS0Sf,
      DS: matAlgo03xDSf,
      SD: matAlgo02xDS0
    })
  )
})
