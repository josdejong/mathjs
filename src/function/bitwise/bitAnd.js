import { bitAndBigNumber } from '../../utils/bignumber/bitwise.js'
import { createMatAlgo02xDS0 } from '../../type/matrix/utils/matAlgo02xDS0.js'
import { createMatAlgo11xS0s } from '../../type/matrix/utils/matAlgo11xS0s.js'
import { createMatAlgo06xS0S0 } from '../../type/matrix/utils/matAlgo06xS0S0.js'
import { factory } from '../../utils/factory.js'
import { createMatrixAlgorithmSuite } from '../../type/matrix/utils/matrixAlgorithmSuite.js'
import { bitAndNumber } from '../../plain/number/index.js'

const name = 'bitAnd'
const dependencies = [
  'typed',
  'matrix',
  'equalScalar',
  'concat'
]

export const createBitAnd = /* #__PURE__ */ factory(name, dependencies, ({ typed, matrix, equalScalar, concat }) => {
  const matAlgo02xDS0 = createMatAlgo02xDS0({ typed, equalScalar })
  const matAlgo06xS0S0 = createMatAlgo06xS0S0({ typed, equalScalar })
  const matAlgo11xS0s = createMatAlgo11xS0s({ typed, equalScalar })
  const matrixAlgorithmSuite = createMatrixAlgorithmSuite({ typed, matrix, concat })

  /**
   * Bitwise AND two values, `x & y`.
   * For matrices, the function is evaluated element wise.
   *
   * Syntax:
   *
   *    math.bitAnd(x, y)
   *
   * Examples:
   *
   *    math.bitAnd(53, 131)               // returns number 1
   *
   *    math.bitAnd([1, 12, 31], 42)       // returns Array [0, 8, 10]
   *
   * See also:
   *
   *    bitNot, bitOr, bitXor, leftShift, rightArithShift, rightLogShift
   *
   * @param  {number | BigNumber | bigint | Array | Matrix} x First value to and
   * @param  {number | BigNumber | bigint | Array | Matrix} y Second value to and
   * @return {number | BigNumber | bigint | Array | Matrix} AND of `x` and `y`
   */
  return typed(
    name,
    {
      'number, number': bitAndNumber,
      'BigNumber, BigNumber': bitAndBigNumber,
      'bigint, bigint': (x, y) => x & y
    },
    matrixAlgorithmSuite({
      SS: matAlgo06xS0S0,
      DS: matAlgo02xDS0,
      Ss: matAlgo11xS0s
    })
  )
})
