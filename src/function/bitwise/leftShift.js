import { createMatAlgo02xDS0 } from '../../type/matrix/utils/matAlgo02xDS0.js'
import { createMatAlgo11xS0s } from '../../type/matrix/utils/matAlgo11xS0s.js'
import { createMatAlgo14xDs } from '../../type/matrix/utils/matAlgo14xDs.js'
import { createMatAlgo15xAs } from '../../type/matrix/utils/matAlgo15xAs.js'
import { createMatAlgo03xDSf } from '../../type/matrix/utils/matAlgo03xDSf.js'
import { createMatAlgo12xSfs } from '../../type/matrix/utils/matAlgo12xSfs.js'
import { createMatAlgo09xS0Sf } from '../../type/matrix/utils/matAlgo09xS0Sf.js'
import { factory } from '../../utils/factory.js'
import { createMatrixAlgorithmSuite } from '../../type/matrix/utils/matrixAlgorithmSuite.js'
import { leftShiftNumber } from '../../plain/number/index.js'
import { leftShiftBigNumber } from '../../utils/bignumber/bitwise.js'
import { deepMap } from '../../utils/array.js'

const name = 'leftShift'
const dependencies = [
  'typed',
  'matrix',
  'isZero',
  'zeros',
  'DenseMatrix'
]

export const createLeftShift = /* #__PURE__ */ factory(name, dependencies, ({ typed, matrix, isZero, zeros, DenseMatrix }) => {
  const matAlgo03xDSf = createMatAlgo03xDSf({ typed })
  const matAlgo02xDS0 = createMatAlgo02xDS0({ typed })
  const matAlgo09xS0Sf = createMatAlgo09xS0Sf({ typed })
  const matAlgo12xSfs = createMatAlgo12xSfs({ typed, DenseMatrix })
  const matAlgo11xS0s = createMatAlgo11xS0s({ typed })
  const matAlgo14xDs = createMatAlgo14xDs({ typed })
  const matAlgo15xAs = createMatAlgo15xAs()
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
   *    math.leftShift([1, 2, 4], 4)       // returns Array [16, 32, 64]
   *
   * See also:
   *
   *    leftShift, bitNot, bitOr, bitXor, rightArithShift, rightLogShift
   *
   * History:
   *
   *    v11.6  Support matrix broadcasting
   *    v1.2   Created
   *
   * @param  {number | BigNumber | bigint | Array | Matrix} x Value to be shifted
   * @param  {number | BigNumber | bigint} y Amount of shifts
   * @return {number | BigNumber | bigint | Array | Matrix} `x` shifted left `y` times
   */
  return typed(
    name,
    {
      'number, number': leftShiftNumber,

      'BigNumber, BigNumber': leftShiftBigNumber,

      'bigint, bigint': (x, y) => x << y,

      // note that shifting by zero is not a no-op: the shift operators
      // convert the value to a 32-bit integer first, so there is no
      // shortcut for a scalar shift of zero
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
        if (isZero(x)) {
          return zeros(y.size(), y.storage())
        }
        return matAlgo12xSfs(y, x, self, true)
      }),

      'number | BigNumber, DenseMatrix': typed.referToSelf(self => (x, y) => {
        // check scalar
        if (isZero(x)) {
          return zeros(y.size(), y.storage())
        }
        return matAlgo14xDs(y, x, self, true)
      }),
      'number | BigNumber, Array': typed.referToSelf(self => (x, y) => {
        // check scalar
        if (isZero(x)) {
          return deepMap(y, () => x)
        }
        return matAlgo15xAs(y, x, self, true)
      })
    },
    matrixAlgorithmSuite({
      // a shift by zero still converts the shifted value to a 32-bit
      // integer, so entries where the shift is zero have to be evaluated,
      // not copied; entries where the shifted value is zero are always
      // zero, so they can be skipped
      SS: matAlgo09xS0Sf,
      DS: matAlgo03xDSf,
      SD: matAlgo02xDS0
    })
  )
})
