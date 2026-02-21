import { factory } from '../../utils/factory.js'

const name = 'divideScalar'
const dependencies = ['typed', 'Complex']

export const createDivideScalar = /* #__PURE__ */ factory(name, dependencies, ({ typed, Complex }) => {
  function isZeroComplex (z) {
    return z.re === 0 && z.im === 0
  }

  /**
   * Divide two scalar values, `x / y`.
   * This function is meant for internal use: it is used by the public functions
   * `divide` and `inv`.
   *
   * This function does not support collections (Array or Matrix).
   *
   * @param  {number | BigNumber | bigint | Fraction | Complex | Unit} x   Numerator
   * @param  {number | BigNumber | bigint | Fraction | Complex} y          Denominator
   * @return {number | BigNumber | bigint | Fraction | Complex | Unit}     Quotient, `x / y`
   * @private
   */
  return typed(name, {
    'number, number': function (x, y) {
      if (!Number.isFinite(x) && y === 0) {
        return new Complex(Infinity, NaN)
      }

      return x / y
    },

    'Complex, Complex': function (x, y) {
      if (isZeroComplex(y)) {
        if (isZeroComplex(x)) {
          return x.div(y)
        }

        // Normalize non-zero complex divided by zero to complex infinity
        // (infinite magnitude with undetermined phase).
        return new x.constructor(Infinity, NaN)
      }

      return x.div(y)
    },

    'BigNumber, BigNumber': function (x, y) {
      return x.div(y)
    },

    'bigint, bigint': function (x, y) {
      return x / y
    },

    'Fraction, Fraction': function (x, y) {
      return x.div(y)
    },

    'Unit, number | Complex | Fraction | BigNumber | Unit':
      (x, y) => x.divide(y),

    'number | Fraction | Complex | BigNumber, Unit':
    (x, y) => y.divideInto(x)
  })
})
