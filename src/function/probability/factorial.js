import { deepMap } from '../../utils/collection.js'
import { factory } from '../../utils/factory.js'
import { product } from '../../utils/product.js'

const name = 'factorial'
const dependencies = ['typed', 'isInteger', '?BigNumber', 'equalScalar']

export const createFactorial = /* #__PURE__ */ factory(name, dependencies, ({
  typed, isInteger, BigNumber, equalScalar
}) => {
  const bigMemo = BigNumber
    ? [1, 1, 2, 6, 24, 120, 720, 5040, 40320, 362880, 3628800]
        .map(n => new BigNumber(n))
    : null
  // Fortunately, the largest argument the factorial of which
  // fits in a BigNumber is less than MAX_SAFE_INTEGER
  // This value was derived, with gratitude, via
  // [Hypercalc](https://mrob.com/pub/comp/hypercalc/hypercalc-javascript.html)
  const MAX_BIGNUMBER_FACTORIAL = 626622622402120

  /**
   * Compute the factorial of a value
   *
   * Factorial only supports an integer value as argument.
   * For matrices, the function is evaluated element wise.
   *
   * Syntax:
   *
   *    math.factorial(n)
   *
   * Examples:
   *
   *    math.factorial(5)    // returns 120
   *    math.factorial(3)    // returns 6
   *
   * See also:
   *
   *    combinations, combinationsWithRep, gamma, permutations
   *
   * @param {number | BigNumber | Array | Matrix} n   An integer number
   * @return {number | BigNumber | Array | Matrix}    The factorial of `n`
   */
  return typed(name, {
    number: numFactorial,
    bigint: function (b) {
      if (b < 0n) {
        throw new RangeError('factorial requires a nonnegative argument.')
      }
      return product(1n, b)
    },
    Fraction: function (f) {
      if (f.s < 0 || !isInteger(f)) {
        throw new RangeError('factorial requires nonnegative integer argument.')
      }
      return product(1n, f.n)
    },
    Complex: function (z) {
      if (!equalScalar(z.re, z.re + z.im)) {
        throw new RangeError('factorial requires nonnegative integer argument.')
      }
      return numFactorial(z.re)
    },
    BigNumber: function (n) {
      // When n overflows `number`, n! will overflow BigNumber
      if (n.toNumber() === Infinity) return new BigNumber(Infinity)
      if (n.isNegative() || !isInteger(n)) {
        throw new RangeError('factorial requires nonnegative integer argument.')
      }
      return bigFactorial(n)
    },

    'Array | Matrix': typed.referToSelf(self => n => deepMap(n, self))
  })

  function numFactorial (n) {
    if (n === Infinity) return Infinity
    if (n < 0 || !isInteger(n)) {
      throw new RangeError('factorial requires nonnegative integer argument.')
    }
    if (n > 171) return Infinity // will overflow
    return product(1, n)
  }

  /* NB: only call this with a nonnegative integer */
  function bigFactorial (n) {
    if (n.lessThan(11)) return bigMemo[n.toNumber()]
    if (n.greaterThan(MAX_BIGNUMBER_FACTORIAL)) return new BigNumber(Infinity)
    if (n.modulo(2).isPositive()) return n.times(bigFactorial(n.minus(1)))

    const Big = BigNumber.clone({
      precision: BigNumber.precision + (Math.log(n.toNumber()) | 0)
    })

    let p = n.toNumber()
    let prod = new Big(n)
    let sum = n // can overflow MAX_SAFE_INTEGER for p < MAX_BIGNUMBER_FACTORIAL
    while (p > 2) {
      p -= 2
      sum = sum.plus(p)
      prod = prod.times(sum)
    }

    return new BigNumber(prod.toPrecision(BigNumber.precision))
  }
})
