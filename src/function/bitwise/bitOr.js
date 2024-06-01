import { bitOrBigNumber } from '../../utils/bignumber/bitwise.js'
import { factory } from '../../utils/factory.js'
import { createMatAlgo10xSids } from '../../type/matrix/utils/matAlgo10xSids.js'
import { createMatAlgo04xSidSid } from '../../type/matrix/utils/matAlgo04xSidSid.js'
import { createMatAlgo01xDSid } from '../../type/matrix/utils/matAlgo01xDSid.js'
import { createMatrixAlgorithmSuite } from '../../type/matrix/utils/matrixAlgorithmSuite.js'
import { bitOrNumber } from '../../plain/number/index.js'

const name = 'bitOr'
const dependencies = [
  'typed',
  'matrix',
  'equalScalar',
  'DenseMatrix',
  'concat'
]

export const createBitOr = /* #__PURE__ */ factory(name, dependencies, ({ typed, matrix, equalScalar, DenseMatrix, concat }) => {
  const matAlgo01xDSid = createMatAlgo01xDSid({ typed })
  const matAlgo04xSidSid = createMatAlgo04xSidSid({ typed, equalScalar })
  const matAlgo10xSids = createMatAlgo10xSids({ typed, DenseMatrix })
  const matrixAlgorithmSuite = createMatrixAlgorithmSuite({ typed, matrix, concat })

  /**
   * Bitwise OR two values, `x | y`.
   * For matrices, the function is evaluated element wise.
   * For units, the function is evaluated on the lowest print base.
   *
   * Syntax:
   *
   *    math.bitOr(x, y)
   *
   * Examples:
   *
   *    math.bitOr(1, 2)               // returns number 3
   *
   *    math.bitOr([1, 2, 3], 4)       // returns Array [5, 6, 7]
   *
   * See also:
   *
   *    bitAnd, bitNot, bitXor, leftShift, rightArithShift, rightLogShift
   *
   * @param  {number | BigNumber | bigint | Array | Matrix} x First value to or
   * @param  {number | BigNumber | bigint | Array | Matrix} y Second value to or
   * @return {number | BigNumber | bigint | Array | Matrix} OR of `x` and `y`
   */
  return typed(
    name,
    {
      'number, number': bitOrNumber,
      'BigNumber, BigNumber': bitOrBigNumber,
      'bigint, bigint': (x, y) => x | y
    },
    matrixAlgorithmSuite({
      SS: matAlgo04xSidSid,
      DS: matAlgo01xDSid,
      Ss: matAlgo10xSids
    })
  )
})
