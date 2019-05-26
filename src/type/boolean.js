import { factory } from '../utils/factory'
import { deepMap } from '../utils/collection'

const name = 'boolean'
const dependencies = ['typed']

export const createBoolean = /* #__PURE__ */ factory(name, dependencies, ({ typed }) => {
  /**
   * Create a boolean or convert a string or number to a boolean.
   * In case of a number, `true` is returned for non-zero numbers, and `false` in
   * case of zero.
   * Strings can be `'true'` or `'false'`, or can contain a number.
   * When value is a matrix, all elements will be converted to boolean.
   *
   * Syntax:
   *
   *    math.boolean(x)
   *
   * Examples:
   *
   *    math.boolean(0)     // returns false
   *    math.boolean(1)     // returns true
   *    math.boolean(-3)     // returns true
   *    math.boolean('true')     // returns true
   *    math.boolean('false')     // returns false
   *    math.boolean([1, 0, 1, 1])     // returns [true, false, true, true]
   *
   * See also:
   *
   *    bignumber, complex, index, matrix, string, unit
   *
   * @param {string | number | boolean | Array | Matrix | null} value  A value of any type
   * @return {boolean | Array | Matrix} The boolean value
   */
  const bool = typed(name, {
    '': function () {
      return false
    },

    'boolean': function (x) {
      return x
    },

    'number': function (x) {
      return !!x
    },

    'null': function (x) {
      return false
    },

    'BigNumber': function (x) {
      return !x.isZero()
    },

    'string': function (x) {
      // try case insensitive
      const lcase = x.toLowerCase()
      if (lcase === 'true') {
        return true
      } else if (lcase === 'false') {
        return false
      }

      // test whether value is a valid number
      const num = Number(x)
      if (x !== '' && !isNaN(num)) {
        return !!num
      }

      throw new Error('Cannot convert "' + x + '" to a boolean')
    },

    'Array | Matrix': function (x) {
      return deepMap(x, bool)
    }
  })

  return bool
})
