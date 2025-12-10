import { deepMap } from '../../utils/collection.js'
import { factory } from '../../utils/factory.js'
import { product } from '../../utils/product.js'
import { factorialNumber } from '../../plain/number/index.js'

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
   * Compute the factorial of a value.
   *
   * The factorial of _n_ (which you can write as `n!` in the expression
   * parser) is the product of all of the positive integers less than
   * or equal to _n_, with a special case that `0!` is 1. As such, factorial
   * only supports a nonnegative integer value (of any datatype) as its
   * argument, and returns a result of the same datatype, except that the
   * factorial of an (integer) Fraction is returned as a bigint and of a
   * (real, integer) Complex number is returned as a plain number.
   *
   * For matrices, the function is evaluated element wise.
   *
   * **Variant factorials**
   *
   * For computing variations on the factorial, such as the "_n_ th rising
   * factorial of _x_" equal to _x·(x+1)·...·(x+n-1)_, or the "_n_ th falling
   * factorial of _x_" equal to _x·(x-1)·...·(x-(n-1))_, or the "double
   * factorial of _n_" equal to _n·(n-2)·..._ (ending at 2 if _n_ is even or
   * 1 if _n_ is odd), mathjs recommends you use the `prod` function on the
   * arithmetic sequence of factors, generated with the `range` function.
   * Explicitly, we have that
   *
   *   - nth rising factorial of x is `math.prod(math.range(x, x + n))`, or in
   *     the expression parser (which has different conventions for specifying
   *     ranges) `prod(x:x+n-1)`
   *   - nth falling factorial of x is `math.prod(math.range(x, x - n, -1))` or
   *     in the expression parser either `prod(x:-1:x-n+1)` or `prod(x-n+1:x)`.
   *   - double factorial of n is `math.prod(math.range(n, 1, -2))` or in the
   *     expression parser `prod(n:-2:1)`.
   *
   * Of course, you can for example use `prod(1:n)` in the expression parser
   * for `n!` but the `factorial` function has a specialized implementation
   * that is approximately 33% faster for large, high-precision values.
   *
   * Syntax:
   *
   *    math.factorial(n)
   *
   * Examples:
   *
   *    math.factorial(5)      // returns 120
   *    const big21 = math.bignumber(21)
   *    math.factorial(big21)  // returns BigNumber 51090942171709440000
   *
   * See also:
   *
   *    combinations, combinationsWithRep, gamma, permutations, prod, range
   *
   * @param {number | bigint | Fraction | Complex | BigNumber | Array | Matrix} n   An integer number or matrix thereof
   * @return {number | bigint | BigNumber | Array | Matrix}
   *     The (possibly elementwise) factorial of `n`
   */
  return typed(name, {
    number: factorialNumber,
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
      return factorialNumber(z.re)
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
