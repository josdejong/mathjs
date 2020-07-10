import { factory } from '../utils/factory'
import { deepMap } from '../utils/collection'

const name = 'number'
const dependencies = ['typed']

export const createNumber = /* #__PURE__ */ factory(name, dependencies, ({ typed }) => {
  /**
   * Create a number or convert a string, boolean, or unit to a number.
   * When value is a matrix, all elements will be converted to number.
   *
   * Syntax:
   *
   *    math.number(value)
   *    math.number(unit, valuelessUnit)
   *
   * Examples:
   *
   *    math.number(2)                         // returns number 2
   *    math.number('7.2')                     // returns number 7.2
   *    math.number(true)                      // returns number 1
   *    math.number([true, false, true, true]) // returns [1, 0, 1, 1]
   *    math.number(math.unit('52cm'), 'm')    // returns 0.52
   *
   * See also:
   *
   *    bignumber, boolean, complex, index, matrix, string, unit
   *
   * @param {string | number | BigNumber | Fraction | boolean | Array | Matrix | Unit | null} [value]  Value to be converted
   * @param {Unit | string} [valuelessUnit] A valueless unit, used to convert a unit to a number
   * @return {number | Array | Matrix} The created number
   */
  const number = typed('number', {
    '': function () {
      return 0
    },

    number: function (x) {
      return x
    },

    string: function (x) {
      if (x === 'NaN') return NaN
      const num = Number(x)
      if (isNaN(num)) {
        throw new SyntaxError('String "' + x + '" is no valid number')
      }
      return num
    },

    BigNumber: function (x) {
      return x.toNumber()
    },

    Fraction: function (x) {
      return x.valueOf()
    },

    Unit: function (x) {
      throw new Error('Second argument with valueless unit expected')
    },

    null: function (x) {
      return 0
    },

    'Unit, string | Unit': function (unit, valuelessUnit) {
      return unit.toNumber(valuelessUnit)
    },

    'Array | Matrix': function (x) {
      return deepMap(x, this)
    }
  })

  // reviver function to parse a JSON object like:
  //
  //     {"mathjs":"number","value":"2.3"}
  //
  // into a number 2.3
  number.fromJSON = function (json) {
    return parseFloat(json.value)
  }

  return number
})
