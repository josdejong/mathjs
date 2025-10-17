import { factory } from '../../../utils/factory.js'
import { deepMap } from '../../../utils/collection.js'

const name = 'fraction'
const dependencies = ['typed', 'Fraction']

export const createFraction = /* #__PURE__ */ factory(name, dependencies, ({ typed, Fraction }) => {
  /**
   * Create a fraction or convert a value to a fraction.
   *
   * With one numeric argument, produces the closest rational approximation to the
   * input.
   * With two arguments, the first is the numerator and the second is the denominator,
   * and creates the corresponding fraction. Both numerator and denominator must be
   * integers.
   * With one object argument, looks for the integer numerator as the value of property
   * 'n' and the integer denominator as the value of property 'd'.
   * With a matrix argument, creates a matrix of the same shape with entries
   * converted into fractions.
   *
   * Syntax:
   *     math.fraction(value)
   *     math.fraction(numerator, denominator)
   *     math.fraction({n: numerator, d: denominator})
   *     math.fraction(matrix: Array | Matrix)
   *
   * Examples:
   *
   *     math.fraction(6.283)             // returns Fraction 6283/1000
   *     math.fraction(1, 3)              // returns Fraction 1/3
   *     math.fraction('2/3')             // returns Fraction 2/3
   *     math.fraction({n: 2, d: 3})      // returns Fraction 2/3
   *     math.fraction([0.2, 0.25, 1.25]) // returns Array [1/5, 1/4, 5/4]
   *     math.fraction(4, 5.1)            // throws Error: Parameters must be integer
   *
   * See also:
   *
   *    bignumber, number, string, unit
   *
   * @param {number | string | Fraction | BigNumber | bigint | Unit | Array | Matrix} [args]
   *            Arguments specifying the value, or numerator and denominator of
   *            the fraction
   * @return {Fraction | Array | Matrix} Returns a fraction
   */
  return typed('fraction', {
    number: function (x) {
      if (!Number.isFinite(x) || isNaN(x)) {
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

    'bigint, bigint': function (numerator, denominator) {
      return new Fraction(numerator, denominator)
    },

    null: function (x) {
      return new Fraction(0)
    },

    BigNumber: function (x) {
      return new Fraction(x.toString())
    },

    bigint: function (x) {
      return new Fraction(x.toString())
    },

    Fraction: function (x) {
      return x // fractions are immutable
    },

    Unit: typed.referToSelf(self => (x) => {
      const clone = x.clone()
      clone.value = self(x.value)
      return clone
    }),

    Object: function (x) {
      return new Fraction(x)
    },

    'Array | Matrix': typed.referToSelf(self => x => deepMap(x, self))
  })
})
