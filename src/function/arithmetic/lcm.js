import { factory } from '../../utils/factory.js'
import { createMatAlgo02xDS0 } from '../../type/matrix/utils/matAlgo02xDS0.js'
import { createMatAlgo06xS0S0 } from '../../type/matrix/utils/matAlgo06xS0S0.js'
import { createMatAlgo11xS0s } from '../../type/matrix/utils/matAlgo11xS0s.js'
import { createMatrixAlgorithmSuite } from '../../type/matrix/utils/matrixAlgorithmSuite.js'
import { lcmNumber } from '../../plain/number/index.js'

const name = 'lcm'
const dependencies = [
  'typed',
  'matrix',
  'equalScalar',
  'concat'
]

export const createLcm = /* #__PURE__ */ factory(name, dependencies, ({ typed, matrix, equalScalar, concat }) => {
  const matAlgo02xDS0 = createMatAlgo02xDS0({ typed, equalScalar })
  const matAlgo06xS0S0 = createMatAlgo06xS0S0({ typed, equalScalar })
  const matAlgo11xS0s = createMatAlgo11xS0s({ typed, equalScalar })
  const matrixAlgorithmSuite = createMatrixAlgorithmSuite({ typed, matrix, concat })

  const lcmTypes = 'number | BigNumber | Fraction | Matrix | Array'
  const lcmManySignature = {}
  lcmManySignature[`${lcmTypes}, ${lcmTypes}, ...${lcmTypes}`] =
    typed.referToSelf(self => (a, b, args) => {
      let res = self(a, b)
      for (let i = 0; i < args.length; i++) {
        res = self(res, args[i])
      }
      return res
    })

  /**
   * Calculate the least common multiple for two or more values or arrays.
   *
   * lcm is defined as:
   *
   *     lcm(a, b) = abs(a * b) / gcd(a, b)
   *
   * For matrices, the function is evaluated element wise.
   *
   * Syntax:
   *
   *    math.lcm(a, b)
   *    math.lcm(a, b, c, ...)
   *
   * Examples:
   *
   *    math.lcm(4, 6)               // returns 12
   *    math.lcm(6, 21)              // returns 42
   *    math.lcm(6, 21, 5)           // returns 210
   *
   *    math.lcm([4, 6], [6, 21])    // returns [12, 42]
   *
   * See also:
   *
   *    gcd, xgcd
   *
   * @param {... number | BigNumber | Array | Matrix} args  Two or more integer numbers
   * @return {number | BigNumber | Array | Matrix}                           The least common multiple
   */
  return typed(
    name, {
      'number, number': lcmNumber,
      'BigNumber, BigNumber': _lcmBigNumber,
      'Fraction, Fraction': (x, y) => x.lcm(y)
    },
    matrixAlgorithmSuite({
      SS: matAlgo06xS0S0,
      DS: matAlgo02xDS0,
      Ss: matAlgo11xS0s
    }),
    lcmManySignature
  )

  /**
   * Calculate lcm for two BigNumbers
   * @param {BigNumber} a
   * @param {BigNumber} b
   * @returns {BigNumber} Returns the least common multiple of a and b
   * @private
   */
  function _lcmBigNumber (a, b) {
    if (!a.isInt() || !b.isInt()) {
      throw new Error('Parameters in function lcm must be integer numbers')
    }

    if (a.isZero()) {
      return a
    }
    if (b.isZero()) {
      return b
    }

    // https://en.wikipedia.org/wiki/Euclidean_algorithm
    // evaluate lcm here inline to reduce overhead
    const prod = a.times(b)
    while (!b.isZero()) {
      const t = b
      b = a.mod(t)
      a = t
    }
    return prod.div(a).abs()
  }
})
