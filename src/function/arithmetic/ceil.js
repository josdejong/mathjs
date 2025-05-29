import Decimal from 'decimal.js'
import { factory } from '../../utils/factory.js'
import { deepMap } from '../../utils/collection.js'
import { isInteger, nearlyEqual } from '../../utils/number.js'
import { nearlyEqual as bigNearlyEqual } from '../../utils/bignumber/nearlyEqual.js'
import { createMatAlgo11xS0s } from '../../type/matrix/utils/matAlgo11xS0s.js'
import { createMatAlgo12xSfs } from '../../type/matrix/utils/matAlgo12xSfs.js'
import { createMatAlgo14xDs } from '../../type/matrix/utils/matAlgo14xDs.js'

const name = 'ceil'
const dependencies = ['typed', 'config', 'round', 'matrix', 'equalScalar', 'zeros', 'DenseMatrix']

const bigTen = new Decimal(10)

export const createCeilNumber = /* #__PURE__ */ factory(
  name, ['typed', 'config', 'round'], ({ typed, config, round }) => {
    function _ceilNumber (x) {
      // See ./floor.js _floorNumber for rationale here
      const c = Math.ceil(x)
      const r = round(x)
      if (c === r) return c
      if (
        nearlyEqual(x, r, config.relTol, config.absTol) &&
        !nearlyEqual(x, c, config.relTol, config.absTol)
      ) {
        return r
      }
      return c
    }

    return typed(name, {
      number: _ceilNumber,
      'number, number': function (x, n) {
        if (!isInteger(n)) {
          throw new RangeError(
            'number of decimals in function ceil must be an integer')
        }
        if (n < 0 || n > 15) {
          throw new RangeError(
            'number of decimals in ceil number must be in range 0-15')
        }
        const shift = 10 ** n
        return _ceilNumber(x * shift) / shift
      }
    })
  }
)

export const createCeil = /* #__PURE__ */ factory(name, dependencies, ({ typed, config, round, matrix, equalScalar, zeros, DenseMatrix }) => {
  const matAlgo11xS0s = createMatAlgo11xS0s({ typed, equalScalar })
  const matAlgo12xSfs = createMatAlgo12xSfs({ typed, DenseMatrix })
  const matAlgo14xDs = createMatAlgo14xDs({ typed })

  const ceilNumber = createCeilNumber({ typed, config, round })
  function _bigCeil (x) {
    // see ./floor.js _floorNumber for rationale
    const bne = (a, b) => bigNearlyEqual(a, b, config.relTol, config.absTol)
    const c = x.ceil()
    const r = round(x)
    if (c.eq(r)) return c
    if (bne(x, r) && !bne(x, c)) return r
    return c
  }
  /**
   * Round a value towards plus infinity
   * If `x` is complex, both real and imaginary part are rounded towards plus infinity.
   * For matrices, the function is evaluated element wise.
   *
   * Syntax:
   *
   *    math.ceil(x)
   *    math.ceil(x, n)
   *    math.ceil(unit, valuelessUnit)
   *    math.ceil(unit, n, valuelessUnit)
   *
   * Examples:
   *
   *    math.ceil(3.2)               // returns number 4
   *    math.ceil(3.8)               // returns number 4
   *    math.ceil(-4.2)              // returns number -4
   *    math.ceil(-4.7)              // returns number -4
   *
   *    math.ceil(3.212, 2)          // returns number 3.22
   *    math.ceil(3.288, 2)          // returns number 3.29
   *    math.ceil(-4.212, 2)         // returns number -4.21
   *    math.ceil(-4.782, 2)         // returns number -4.78
   *
   *    const c = math.complex(3.24, -2.71)
   *    math.ceil(c)                 // returns Complex 4 - 2i
   *    math.ceil(c, 1)              // returns Complex 3.3 - 2.7i
   *
   *    const unit = math.unit('3.241 cm')
   *    const cm = math.unit('cm')
   *    const mm = math.unit('mm')
   *    math.ceil(unit, 1, cm)      // returns Unit 3.3 cm
   *    math.ceil(unit, 1, mm)      // returns Unit 32.5 mm
   *
   *    math.ceil([3.2, 3.8, -4.7])  // returns Array [4, 4, -4]
   *    math.ceil([3.21, 3.82, -4.71], 1)  // returns Array [3.3, 3.9, -4.7]
   *
   * See also:
   *
   *    floor, fix, round
   *
   * @param  {number | BigNumber | Fraction | Complex | Unit | Array | Matrix} x  Value to be rounded
   * @param  {number | BigNumber | Array} [n=0]                            Number of decimals
   * @param  {Unit} [valuelessUnit]                                        A valueless unit
   * @return {number | BigNumber | Fraction | Complex | Unit | Array | Matrix} Rounded value
   */
  return typed('ceil', {
    number: ceilNumber.signatures.number,
    'number,number': ceilNumber.signatures['number,number'],

    Complex: function (x) {
      return x.ceil()
    },

    'Complex, number': function (x, n) {
      return x.ceil(n)
    },

    'Complex, BigNumber': function (x, n) {
      return x.ceil(n.toNumber())
    },

    BigNumber: _bigCeil,

    'BigNumber, BigNumber': function (x, n) {
      const shift = bigTen.pow(n)
      return _bigCeil(x.mul(shift)).div(shift)
    },

    bigint: b => b,
    'bigint, number': (b, _dummy) => b,
    'bigint, BigNumber': (b, _dummy) => b,

    Fraction: function (x) {
      return x.ceil()
    },

    'Fraction, number': function (x, n) {
      return x.ceil(n)
    },

    'Fraction, BigNumber': function (x, n) {
      return x.ceil(n.toNumber())
    },

    'Unit, number, Unit': typed.referToSelf(self => function (x, n, unit) {
      const valueless = x.toNumeric(unit)
      return unit.multiply(self(valueless, n))
    }),

    'Unit, BigNumber, Unit': typed.referToSelf(self => (x, n, unit) => self(x, n.toNumber(), unit)),

    'Array | Matrix, number | BigNumber, Unit': typed.referToSelf(self => (x, n, unit) => {
      // deep map collection, skip zeros since ceil(0) = 0
      return deepMap(x, (value) => self(value, n, unit), true)
    }),

    'Array | Matrix | Unit, Unit': typed.referToSelf(self => (x, unit) => self(x, 0, unit)),

    'Array | Matrix': typed.referToSelf(self => (x) => {
      // deep map collection, skip zeros since ceil(0) = 0
      return deepMap(x, self, true)
    }),

    'Array, number | BigNumber': typed.referToSelf(self => (x, n) => {
      // deep map collection, skip zeros since ceil(0) = 0
      return deepMap(x, i => self(i, n), true)
    }),

    'SparseMatrix, number | BigNumber': typed.referToSelf(self => (x, y) => {
      return matAlgo11xS0s(x, y, self, false)
    }),

    'DenseMatrix, number | BigNumber': typed.referToSelf(self => (x, y) => {
      return matAlgo14xDs(x, y, self, false)
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
