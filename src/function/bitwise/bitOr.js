import { bitOrBigNumber } from '../../utils/bignumber/bitwise.js'
import { factory } from '../../utils/factory.js'
import { createMatAlgo12xSfs } from '../../type/matrix/utils/matAlgo12xSfs.js'
import { createMatAlgo05xSfSf } from '../../type/matrix/utils/matAlgo05xSfSf.js'
import { createMatAlgo03xDSf } from '../../type/matrix/utils/matAlgo03xDSf.js'
import { createMatrixAlgorithmSuite } from '../../type/matrix/utils/matrixAlgorithmSuite.js'
import { bitOrNumber } from '../../plain/number/index.js'

const name = 'bitOr'
const dependencies = ['typed', 'matrix', 'DenseMatrix']

export const createBitOr = /* #__PURE__ */ factory(name, dependencies, ({ typed, matrix, DenseMatrix }) => {
  const matAlgo03xDSf = createMatAlgo03xDSf({ typed })
  const matAlgo05xSfSf = createMatAlgo05xSfSf({ typed })
  const matAlgo12xSfs = createMatAlgo12xSfs({ typed, DenseMatrix })
  const matrixAlgorithmSuite = createMatrixAlgorithmSuite({ typed, matrix })

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
   * History:
   *
   *    v11.6  Support matrix broadcasting
   *    v1.2   Created
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
      // x | 0 and 0 | y are not x and y in general: the bitwise operators
      // convert their operands to 32-bit integers first, so entries where
      // one operand is zero have to be evaluated, not copied
      SS: matAlgo05xSfSf,
      DS: matAlgo03xDSf,
      Ss: matAlgo12xSfs
    })
  )
})
