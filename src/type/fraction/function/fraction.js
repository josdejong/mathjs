import { factory } from '../../../utils/factory'
import { deepMap } from '../../../utils/collection'

const name = 'fraction'
const dependencies = ['typed', 'Fraction']

export const createFraction = /* #__PURE__ */ factory(name, dependencies, ({ typed, Fraction }) => {
  /**
   * Create a fraction convert a value to a fraction.
   *
   * Syntax:
   *     math.fraction(numerator, denominator)
   *     math.fraction({n: numerator, d: denominator})
   *     math.fraction(matrix: Array | Matrix)         Turn all matrix entries
   *                                                   into fractions
   *
   * Examples:
   *
   *     math.fraction(1, 3)
   *     math.fraction('2/3')
   *     math.fraction({n: 2, d: 3})
   *     math.fraction([0.2, 0.25, 1.25])
   *
   * See also:
   *
   *    bignumber, number, string, unit
   *
   * @param {number | string | Fraction | BigNumber | Array | Matrix} [args]
   *            Arguments specifying the numerator and denominator of
   *            the fraction
   * @return {Fraction | Array | Matrix} Returns a fraction
   */
  const fraction = typed('fraction', {
    number: function (x) {
      if (!isFinite(x) || isNaN(x)) {
        throw new Error(x + ' cannot be represented as a fraction')
      }

      return new Fraction(x)
    },

    string: function (x) {
      return new Fraction(x)
    },

    'number, number': function (numerator, denominator) {
      return new Fraction(numerator, denominator)
    },

    null: function (x) {
      return new Fraction(0)
    },

    BigNumber: function (x) {
      return new Fraction(x.toString())
    },

    Fraction: function (x) {
      return x // fractions are immutable
    },

    Object: function (x) {
      return new Fraction(x)
    },

    'Array | Matrix': function (x) {
      return deepMap(x, fraction)
    }
  })

  return fraction
})
