import { factory } from '../../utils/factory.js'
import { deepMap } from '../../utils/collection.js'
import { createMatAlgo12xSfs } from '../../type/matrix/utils/matAlgo12xSfs.js'
import { createMatAlgo14xDs } from '../../type/matrix/utils/matAlgo14xDs.js'

const name = 'fix'
const dependencies = ['typed', 'Complex', 'matrix', 'ceil', 'floor', 'equalScalar', 'zeros', 'DenseMatrix']

export const createFixNumber = /* #__PURE__ */ factory(
  name, ['typed', 'ceil', 'floor'], ({ typed, ceil, floor }) => {
    return typed(name, {
      number: function (x) {
        return (x > 0) ? floor(x) : ceil(x)
      },

      'number, number': function (x, n) {
        return (x > 0) ? floor(x, n) : ceil(x, n)
      }
    })
  }
)

export const createFix = /* #__PURE__ */ factory(name, dependencies, ({ typed, Complex, matrix, ceil, floor, equalScalar, zeros, DenseMatrix }) => {
  const matAlgo12xSfs = createMatAlgo12xSfs({ typed, DenseMatrix })
  const matAlgo14xDs = createMatAlgo14xDs({ typed })

  const fixNumber = createFixNumber({ typed, ceil, floor })
  /**
   * Round a value towards zero.
   * For matrices, the function is evaluated element wise.
   *
   * Syntax:
   *
   *    math.fix(x)
   *    math.fix(x,n)
   *    math.fix(unit, valuelessUnit)
   *    math.fix(unit, n, valuelessUnit)
   *
   * Examples:
   *
   *    math.fix(3.2)                // returns number 3
   *    math.fix(3.8)                // returns number 3
   *    math.fix(-4.2)               // returns number -4
   *    math.fix(-4.7)               // returns number -4
   *
   *    math.fix(3.12, 1)                // returns number 3.1
   *    math.fix(3.18, 1)                // returns number 3.1
   *    math.fix(-4.12, 1)               // returns number -4.1
   *    math.fix(-4.17, 1)               // returns number -4.1
   *
   *    const c = math.complex(3.22, -2.78)
   *    math.fix(c)                  // returns Complex 3 - 2i
   *    math.fix(c, 1)               // returns Complex 3.2 -2.7i
   *
   *    const unit = math.unit('3.241 cm')
   *    const cm = math.unit('cm')
   *    const mm = math.unit('mm')
   *    math.fix(unit, 1, cm)      // returns Unit 3.2 cm
   *    math.fix(unit, 1, mm)      // returns Unit 32.4 mm
   *
   *    math.fix([3.2, 3.8, -4.7])      // returns Array [3, 3, -4]
   *    math.fix([3.2, 3.8, -4.7], 1)   // returns Array [3.2, 3.8, -4.7]
   *
   * See also:
   *
   *    ceil, floor, round
   *
   * @param  {number | BigNumber | Fraction | Complex | Unit | Array | Matrix} x  Value to be rounded
   * @param  {number | BigNumber | Array} [n=0]                            Number of decimals
   * @param  {Unit} [valuelessUnit]                                        A valueless unit
   * @return {number | BigNumber | Fraction | Complex | Unit | Array | Matrix} Rounded value
   */
  return typed('fix', {
    number: fixNumber.signatures.number,
    'number, number | BigNumber': fixNumber.signatures['number,number'],

    Complex: function (x) {
      return new Complex(
        (x.re > 0) ? Math.floor(x.re) : Math.ceil(x.re),
        (x.im > 0) ? Math.floor(x.im) : Math.ceil(x.im)
      )
    },

    'Complex, number': function (x, n) {
      return new Complex(
        (x.re > 0) ? floor(x.re, n) : ceil(x.re, n),
        (x.im > 0) ? floor(x.im, n) : ceil(x.im, n)
      )
    },

    'Complex, BigNumber': function (x, bn) {
      const n = bn.toNumber()
      return new Complex(
        (x.re > 0) ? floor(x.re, n) : ceil(x.re, n),
        (x.im > 0) ? floor(x.im, n) : ceil(x.im, n)
      )
    },

    BigNumber: function (x) {
      return x.isNegative() ? ceil(x) : floor(x)
    },

    'BigNumber, number | BigNumber': function (x, n) {
      return x.isNegative() ? ceil(x, n) : floor(x, n)
    },

    bigint: b => b,
    'bigint, number': (b, _dummy) => b,
    'bigint, BigNumber': (b, _dummy) => b,

    Fraction: function (x) {
      return x.s < 0n ? x.ceil() : x.floor()
    },

    'Fraction, number | BigNumber': function (x, n) {
      return x.s < 0n ? ceil(x, n) : floor(x, n)
    },

    'Unit, number, Unit': typed.referToSelf(self => function (x, n, unit) {
      const valueless = x.toNumeric(unit)
      return unit.multiply(self(valueless, n))
    }),

    'Unit, BigNumber, Unit': typed.referToSelf(self => (x, n, unit) => self(x, n.toNumber(), unit)),

    'Array | Matrix, number | BigNumber, Unit': typed.referToSelf(self => (x, n, unit) => {
      // deep map collection, skip zeros since fix(0) = 0
      return deepMap(x, (value) => self(value, n, unit), true)
    }),

    'Array | Matrix | Unit, Unit': typed.referToSelf(self => (x, unit) => self(x, 0, unit)),

    'Array | Matrix': typed.referToSelf(self => (x) => {
      // deep map collection, skip zeros since fix(0) = 0
      return deepMap(x, self, true)
    }),

    'Array | Matrix, number | BigNumber': typed.referToSelf(self => (x, n) => {
      // deep map collection, skip zeros since fix(0) = 0
      return deepMap(x, i => self(i, n), true)
    }),

    'number | Complex | Fraction | BigNumber, Array':
      typed.referToSelf(self => (x, y) => {
        // use matrix implementation
        return matAlgo14xDs(matrix(y), x, self, true).valueOf()
      }),

    'number | Complex | Fraction | BigNumber, Matrix':
      typed.referToSelf(self => (x, y) => {
        if (equalScalar(x, 0)) return zeros(y.size(), y.storage())
        if (y.storage() === 'dense') {
          return matAlgo14xDs(y, x, self, true)
        }
        return matAlgo12xSfs(y, x, self, true)
      })
  })
})
