import { factory } from '../../utils/factory.js'
import { deepMap } from '../../utils/collection.js'

const name = 'num'
const dependencies = ['typed']

export const createNum = /* #__PURE__ */ factory(
  name,
  dependencies,
  ({ typed }) => {
    /**
     * Get the numerator of a fraction.
     * For a fraction `a/b`, the function returns `a`.
     *
     * For matrices, the function is evaluated element wise.
     *
     * Syntax:
     *
     *    math.num(x)
     *
     * Examples:
     *
     *    const a = math.fraction(2, 3)
     *    math.num(a)                    // returns number 2
     *    math.den(a)                    // returns number 3
     *
     *    math.num(math.fraction('5/8')) // returns number 5
     *
     * See also:
     *
     *    den, fraction
     *
     * @param {Fraction | Array | Matrix} x
     *            A fraction or array with fractions
     * @return {number | Array | Matrix} The numerator of x
     */
    return typed(name, {
      Fraction: (x) => Number(x.s * x.n),
      'Array | Matrix': typed.referToSelf((self) => (x) => deepMap(x, self))
    })
  }
)
