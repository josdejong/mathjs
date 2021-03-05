import { factory } from '../utils/factory.js'
import { deepMap } from '../utils/collection.js'

const name = 'number'
const dependencies = ['typed']

/**
 * Parse a non decimal number of the form 0RI.F as a Number
 * @param {number} [radix] the radix in [2, 8, 16]
 * @param {string} [integerPart] the part before the radix point
 * @param {string} [fractionalPart] the part after the radix point
 */
function parseNonDecimalWithRadixPoint(radix, integerPart, fractionalPart) {
  const n = parseInt(integerPart, radix)
  let f = 0
  for (let i = 0; i < fractionalPart.length; i++) {
    let digitValue = parseInt(fractionalPart[i], radix)
    f += digitValue / Math.pow(radix, i + 1)
  }
  return n + f
}

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
      const nonDecimalWithRadixMatch = x.match(/(0[box])([0-9a-fA-F]*)\.([0-9a-fA-F]*)/)
      if (nonDecimalWithRadixMatch) {
        const radix = ({'0b': 2, '0o':8, '0x':16})[nonDecimalWithRadixMatch[1]]
        const integerPart = nonDecimalWithRadixMatch[2]
        const fractionalPart = nonDecimalWithRadixMatch[3]
        return parseNonDecimalWithRadixPoint(radix, integerPart, fractionalPart)
      }
      let size = 0
      const wordSizeSuffixMatch = x.match(/(0[box][0-9a-fA-F]*)i([0-9]*)/)
      if (wordSizeSuffixMatch) {
        // x includes a size suffix like 0xffffi32, so we extract
        // the suffix and remove it from x
        size = Number(wordSizeSuffixMatch[2])
        x = wordSizeSuffixMatch[1]
      }
      let num = Number(x)
      if (isNaN(num)) {
        throw new SyntaxError('String "' + x + '" is no valid number')
      }
      if (wordSizeSuffixMatch) {
        // x is a signed bin, oct, or hex literal
        // num is the value of string x if x is interpreted as unsigned
        if (num > 2 ** size - 1) {
          // literal is too large for size suffix
          throw new SyntaxError(`String "${x}" is out of range`)
        }
        // check if the bit at index size - 1 is set and if so do the twos complement
        if (num >= 2 ** (size - 1)) {
          num = num - 2 ** size
        }
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
