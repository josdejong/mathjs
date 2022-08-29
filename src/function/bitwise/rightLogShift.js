import { createMatAlgo02xDS0 } from '../../type/matrix/utils/matAlgo02xDS0.js'
import { createMatAlgo11xS0s } from '../../type/matrix/utils/matAlgo11xS0s.js'
import { createMatAlgo14xDs } from '../../type/matrix/utils/matAlgo14xDs.js'
import { createMatAlgo01xDSid } from '../../type/matrix/utils/matAlgo01xDSid.js'
import { createMatAlgo10xSids } from '../../type/matrix/utils/matAlgo10xSids.js'
import { createMatAlgo08xS0Sid } from '../../type/matrix/utils/matAlgo08xS0Sid.js'
import { factory } from '../../utils/factory.js'
import { createMatrixAlgorithmSuite } from '../../type/matrix/utils/matrixAlgorithmSuite.js'
import { rightLogShiftNumber } from '../../plain/number/index.js'
import { createUseMatrixForArrayScalar } from './useMatrixForArrayScalar.js'

const name = 'rightLogShift'
const dependencies = [
  'typed',
  'matrix',
  'equalScalar',
  'zeros',
  'DenseMatrix'
]

export const createRightLogShift = /* #__PURE__ */ factory(name, dependencies, ({ typed, matrix, equalScalar, zeros, DenseMatrix }) => {
  const matAlgo01xDSid = createMatAlgo01xDSid({ typed })
  const matAlgo02xDS0 = createMatAlgo02xDS0({ typed, equalScalar })
  const matAlgo08xS0Sid = createMatAlgo08xS0Sid({ typed, equalScalar })
  const matAlgo10xSids = createMatAlgo10xSids({ typed, DenseMatrix })
  const matAlgo11xS0s = createMatAlgo11xS0s({ typed, equalScalar })
  const matAlgo14xDs = createMatAlgo14xDs({ typed })
  const matrixAlgorithmSuite = createMatrixAlgorithmSuite({ typed, matrix })
  const useMatrixForArrayScalar = createUseMatrixForArrayScalar({ typed, matrix })

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
   * @param  {number | Array | Matrix} x Value to be shifted
   * @param  {number} y Amount of shifts
   * @return {number | Array | Matrix} `x` zero-filled shifted right `y` times
   */

  return typed(
    name,
    {
      'number, number': rightLogShiftNumber,

      // 'BigNumber, BigNumber': ..., // TODO: implement BigNumber support for rightLogShift

      'SparseMatrix, number | BigNumber': typed.referToSelf(self => (x, y) => {
        // check scalar
        if (equalScalar(y, 0)) {
          return x.clone()
        }
        return matAlgo11xS0s(x, y, self, false)
      }),

      'DenseMatrix, number | BigNumber': typed.referToSelf(self => (x, y) => {
        // check scalar
        if (equalScalar(y, 0)) {
          return x.clone()
        }
        return matAlgo14xDs(x, y, self, false)
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
      })
    },
    useMatrixForArrayScalar,
    matrixAlgorithmSuite({
      SS: matAlgo08xS0Sid,
      DS: matAlgo01xDSid,
      SD: matAlgo02xDS0
    })
  )
})
