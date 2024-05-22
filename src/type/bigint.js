import { factory } from '../utils/factory.js'
import { deepMap } from '../utils/collection.js'

const name = 'bigint'
const dependencies = ['typed']

export const createBigint = /* #__PURE__ */ factory(name, dependencies, ({ typed }) => {
  /**
   * Create a BigInt or convert a string, boolean, or unit to a BigInt.
   * When value is a matrix, all elements will be converted to BigInt.
   *
   * Syntax:
   *
   *    math.bigint(value)
   *
   * Examples:
   *
   *    math.bigint(2)                         // returns BigInt 2n
   *    math.bigint('123')                     // returns BigInt 123n
   *    math.bigint(true)                      // returns BigInt 1n
   *    math.bigint([true, false, true, true]) // returns [1n, 0n, 1n, 1n]
   *
   * See also:
   *
   *    number, bignumber, boolean, complex, index, matrix, string, unit
   *
   * @param {string | number | BigNumber | BigInt | Fraction | boolean | Array | Matrix | null} [value]  Value to be converted
   * @return {BigInt | Array | Matrix} The created BigInt
   */
  return typed('bigint', {
    '': function () {
      return 0n
    },

    BigInt: function (x) {
      return x
    },

    'number': function (x) {
      return BigInt(x.toFixed())
    },

    'BigNumber': function (x) {
      return BigInt(x.round().toString())
    },

    'Fraction': function (x) {
      return BigInt(x.valueOf().toFixed())
    },

    'string | boolean': function (x) {
      return BigInt(x)
    },

    null: function (x) {
      return 0n
    },

    'Array | Matrix': typed.referToSelf(self => x => deepMap(x, self))
  })
})
