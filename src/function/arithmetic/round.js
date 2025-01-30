import { factory } from '../../utils/factory.js'
import { deepMap } from '../../utils/collection.js'
import { nearlyEqual, splitNumber } from '../../utils/number.js'
import { nearlyEqual as bigNearlyEqual } from '../../utils/bignumber/nearlyEqual.js'
import { createMatAlgo11xS0s } from '../../type/matrix/utils/matAlgo11xS0s.js'
import { createMatAlgo12xSfs } from '../../type/matrix/utils/matAlgo12xSfs.js'
import { createMatAlgo14xDs } from '../../type/matrix/utils/matAlgo14xDs.js'
import { roundNumber } from '../../plain/number/index.js'

const NO_INT = 'Number of decimals in function round must be an integer'

const name = 'round'
const dependencies = [
  'typed',
  'config',
  'matrix',
  'equalScalar',
  'zeros',
  'BigNumber',
  'DenseMatrix'
]

export const createRound = /* #__PURE__ */ factory(name, dependencies, ({ typed, config, matrix, equalScalar, zeros, BigNumber, DenseMatrix }) => {
  const matAlgo11xS0s = createMatAlgo11xS0s({ typed, equalScalar })
  const matAlgo12xSfs = createMatAlgo12xSfs({ typed, DenseMatrix })
  const matAlgo14xDs = createMatAlgo14xDs({ typed })

  function toExponent (epsilon) {
    return Math.abs(splitNumber(epsilon).exponent)
  }

  /**
   * Round a value towards the nearest rounded value.
   * For matrices, the function is evaluated element wise.
   *
   * Syntax:
   *
   *    math.round(x)
   *    math.round(x, n)
   *    math.round(unit, valuelessUnit)
   *    math.round(unit, n, valuelessUnit)
   *
   * Examples:
   *
   *    math.round(3.22)             // returns number 3
   *    math.round(3.82)             // returns number 4
   *    math.round(-4.2)             // returns number -4
   *    math.round(-4.7)             // returns number -5
   *    math.round(3.22, 1)          // returns number 3.2
   *    math.round(3.88, 1)          // returns number 3.9
   *    math.round(-4.21, 1)         // returns number -4.2
   *    math.round(-4.71, 1)         // returns number -4.7
   *    math.round(math.pi, 3)       // returns number 3.142
   *    math.round(123.45678, 2)     // returns number 123.46
   *
   *    const c = math.complex(3.2, -2.7)
   *    math.round(c)                // returns Complex 3 - 3i
   *
   *    const unit = math.unit('3.241 cm')
   *    const cm = math.unit('cm')
   *    const mm = math.unit('mm')
   *    math.round(unit, 1, cm)      // returns Unit 3.2 cm
   *    math.round(unit, 1, mm)      // returns Unit 32.4 mm
   *
   *    math.round([3.2, 3.8, -4.7]) // returns Array [3, 4, -5]
   *
   * See also:
   *
   *    ceil, fix, floor
   *
   * @param  {number | BigNumber | Fraction | Complex | Unit | Array | Matrix} x  Value to be rounded
   * @param  {number | BigNumber | Array} [n=0]                            Number of decimals
   * @param  {Unit} [valuelessUnit]                                        A valueless unit
   * @return {number | BigNumber | Fraction | Complex | Unit | Array | Matrix} Rounded value
   */
  return typed(name, {
    number: function (x) {
      // Handle round off errors by first rounding to relTol precision
      const xEpsilon = roundNumber(x, toExponent(config.relTol))
      const xSelected = nearlyEqual(x, xEpsilon, config.relTol, config.absTol) ? xEpsilon : x
      return roundNumber(xSelected)
    },

    'number, number': function (x, n) {
      // Same as number: unless user specifies more decimals than relTol
      const epsilonExponent = toExponent(config.relTol)
      if (n >= epsilonExponent) { return roundNumber(x, n) }

      const xEpsilon = roundNumber(x, epsilonExponent)
      const xSelected = nearlyEqual(x, xEpsilon, config.relTol, config.absTol) ? xEpsilon : x
      return roundNumber(xSelected, n)
    },

    'number, BigNumber': function (x, n) {
      if (!n.isInteger()) { throw new TypeError(NO_INT) }

      return new BigNumber(x).toDecimalPlaces(n.toNumber())
    },

    Complex: function (x) {
      return x.round()
    },

    'Complex, number': function (x, n) {
      if (n % 1) { throw new TypeError(NO_INT) }

      return x.round(n)
    },

    'Complex, BigNumber': function (x, n) {
      if (!n.isInteger()) { throw new TypeError(NO_INT) }

      const _n = n.toNumber()
      return x.round(_n)
    },

    BigNumber: function (x) {
      // Handle round off errors by first rounding to relTol precision
      const xEpsilon = new BigNumber(x).toDecimalPlaces(toExponent(config.relTol))
      const xSelected = bigNearlyEqual(x, xEpsilon, config.relTol, config.absTol) ? xEpsilon : x
      return xSelected.toDecimalPlaces(0)
    },

    'BigNumber, BigNumber': function (x, n) {
      if (!n.isInteger()) { throw new TypeError(NO_INT) }

      // Same as BigNumber: unless user specifies more decimals than relTol
      const epsilonExponent = toExponent(config.relTol)
      if (n >= epsilonExponent) { return x.toDecimalPlaces(n.toNumber()) }

      const xEpsilon = x.toDecimalPlaces(epsilonExponent)
      const xSelected = bigNearlyEqual(x, xEpsilon, config.relTol, config.absTol) ? xEpsilon : x
      return xSelected.toDecimalPlaces(n.toNumber())
    },

    // bigints can't be rounded
    bigint: b => b,
    'bigint, number': (b, _dummy) => b,
    'bigint, BigNumber': (b, _dummy) => b,

    Fraction: function (x) {
      return x.round()
    },

    'Fraction, number': function (x, n) {
      if (n % 1) { throw new TypeError(NO_INT) }
      return x.round(n)
    },

    'Fraction, BigNumber': function (x, n) {
      if (!n.isInteger()) { throw new TypeError(NO_INT) }
      return x.round(n.toNumber())
    },

    'Unit, number, Unit': typed.referToSelf(self => function (x, n, unit) {
      const valueless = x.toNumeric(unit)
      return unit.multiply(self(valueless, n))
    }),

    'Unit, BigNumber, Unit': typed.referToSelf(self => (x, n, unit) => self(x, n.toNumber(), unit)),

    'Array | Matrix, number | BigNumber, Unit': typed.referToSelf(self => (x, n, unit) => {
      // deep map collection, skip zeros since round(0) = 0
      return deepMap(x, (value) => self(value, n, unit), true)
    }),

    'Array | Matrix | Unit, Unit': typed.referToSelf(self => (x, unit) => self(x, 0, unit)),

    'Array | Matrix': typed.referToSelf(self => x => {
      // deep map collection, skip zeros since round(0) = 0
      return deepMap(x, self, true)
    }),

    'SparseMatrix, number | BigNumber': typed.referToSelf(self => (x, n) => {
      return matAlgo11xS0s(x, n, self, false)
    }),

    'DenseMatrix, number | BigNumber': typed.referToSelf(self => (x, n) => {
      return matAlgo14xDs(x, n, self, false)
    }),

    'Array, number | BigNumber': typed.referToSelf(self => (x, n) => {
      // use matrix implementation
      return matAlgo14xDs(matrix(x), n, self, false).valueOf()
    }),

    'number | Complex | BigNumber | Fraction, SparseMatrix': typed.referToSelf(self => (x, n) => {
      // check scalar is zero
      if (equalScalar(x, 0)) {
        // do not execute algorithm, result will be a zero matrix
        return zeros(n.size(), n.storage())
      }
      return matAlgo12xSfs(n, x, self, true)
    }),

    'number | Complex | BigNumber | Fraction, DenseMatrix': typed.referToSelf(self => (x, n) => {
      // check scalar is zero
      if (equalScalar(x, 0)) {
        // do not execute algorithm, result will be a zero matrix
        return zeros(n.size(), n.storage())
      }
      return matAlgo14xDs(n, x, self, true)
    }),

    'number | Complex | BigNumber | Fraction, Array': typed.referToSelf(self => (x, n) => {
      // use matrix implementation
      return matAlgo14xDs(matrix(n), x, self, true).valueOf()
    })
  })
})
