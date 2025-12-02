import { factory } from '../../utils/factory.js'
import { deepMap } from '../../utils/collection.js'

const name = 'den'
const dependencies = ['typed']

export const createDen = /* #__PURE__ */ factory(
  name,
  dependencies,
  ({ typed }) => {
    /**
     * Get the denominator of a fraction.
     * For a fraction `a/b`, the function returns `b`.
     *
     * For matrices, the function is evaluated element wise.
     *
     * Syntax:
     *
     *    math.den(x)
     *
     * Examples:
     *
     *    const a = math.fraction(2, 3)
     *    math.num(a)                    // returns number 2
     *    math.den(a)                    // returns number 3
     *
     *    math.den(math.fraction('5/8')) // returns number 8
     *
     * See also:
     *
     *    num, fraction
     *
     * @param {Fraction | Array | Matrix} x
     *            A fraction or array with fractions
     * @return {number | Array | Matrix} The denominator of x
     */
    return typed(name, {
      Fraction: (x) => Number(x.d),
      'Array | Matrix': typed.referToSelf((self) => (x) => deepMap(x, self))
    })
  }
)
