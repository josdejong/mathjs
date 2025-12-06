import { factory } from '../../utils/factory.js'
import { deepMap } from '../../utils/collection.js'

const name = 'den'
const dependencies = ['typed', 'fraction']

export const createDen = /* #__PURE__ */ factory(
  name,
  dependencies,
  ({ typed, fraction }) => {
    /**
     * Get the denominator of a fraction.
     * For a fraction `a/b`, the function returns `b`.
     *
     * For negative fractions like `-a/b` or `a/-b`, the denominator is
     * always returned as a positive bigint. The sign is stored in the
     * numerator. So `den(fraction(-2, 3))` and `den(fraction(2, -3))`
     * both return `3n`.
     *
     * For matrices, the function is evaluated element wise.
     *
     * Syntax:
     *
     *    math.den(x)
     *
     * Examples:
     *
     *    math.den(math.fraction(2, 3))   // returns 3n
     *    math.den(math.fraction('5/8'))  // returns 8n
     *    math.den(math.fraction(-2, 3))  // returns 3n
     *    math.den(math.fraction(2, -3))  // returns 3n
     *    math.den(math.bignumber('0.5'))  // returns 2n
     *
     * See also:
     *
     *    num, fraction
     *
     * @param {Fraction | BigNumber | Array | Matrix} x
     *            A fraction, BigNumber, or array with fractions
     * @return {bigint | Array | Matrix} The denominator of x
     */
    return typed(name, {
      Fraction: (x) => x.d,
      BigNumber: (x) => fraction(x).d,
      'Array | Matrix': typed.referToSelf((self) => (x) => deepMap(x, self))
    })
  }
)
