import { factory } from '../../utils/factory.js'
import { deepMap } from '../../utils/collection.js'

const name = 'num'
const dependencies = ['typed', 'fraction']

export const createNum = /* #__PURE__ */ factory(
  name,
  dependencies,
  ({ typed, fraction }) => {
    /**
     * Get the numerator of a fraction.
     * For a fraction `a/b`, the function returns `a`.
     *
     * The result is always in lowest terms. For example, `num(fraction(8, 6))`
     * returns `4n` because 8/6 simplifies to 4/3.
     *
     * For negative fractions like `-a/b` or `a/-b`, the sign is always
     * included in the numerator. Both forms are normalized internally, so
     * `num(fraction(-2, 3))` and `num(fraction(2, -3))` both return `-2`.
     *
     * For matrices, the function is evaluated element wise.
     *
     * Syntax:
     *
     *    math.num(x)
     *
     * Examples:
     *
     *    math.num(math.fraction(2, 3))   // returns 2n
     *    math.num(math.fraction(8, 6))   // returns 4n
     *    math.num(math.fraction('5/8'))  // returns 5n
     *    math.num(math.fraction(-2, 3))  // returns -2n
     *    math.num(math.fraction(2, -3))  // returns -2n
     *    math.num(math.bignumber('0.5'))  // returns 1n
     *
     * See also:
     *
     *    den, fraction
     *
     * @param {Fraction | BigNumber | Array | Matrix} x
     *            A fraction, BigNumber, or array with fractions
     * @return {bigint | Array | Matrix} The numerator of x (in lowest terms)
     */
    return typed(name, {
      Fraction: x => x.s * x.n,
      BigNumber: x => {
        const f = fraction(x)
        return f.s * f.n
      },
      'Array | Matrix': typed.referToSelf(self => x => deepMap(x, self))
    })
  }
)
