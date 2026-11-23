import { factory } from '../utils/factory.js'
import { deepMap } from '../utils/collection.js'

const name = 'number'
const dependencies = ['typed', 'equalScalar']

/**
 * Separates the radix, integer part, and fractional part of a non decimal number string
 * @param {string} input string to parse
 * @returns {object} the parts of the string or null if not a valid input
 */
function getNonDecimalNumberParts (input) {
  const nonDecimalWithRadixMatch =
    input.match(/^\s*(0[box])([0-9a-fA-F]*)\.([0-9a-fA-F]*)\s*$/)
  if (nonDecimalWithRadixMatch) {
    const radix = ({ '0b': 2, '0o': 8, '0x': 16 })[nonDecimalWithRadixMatch[1]]
    const integerPart = nonDecimalWithRadixMatch[2]
    const fractionalPart = nonDecimalWithRadixMatch[3]
    return { input, radix, integerPart, fractionalPart }
  } else {
    return null
  }
}

const radixLimit = { 2: 53, 8: 18, 16: 13 }
/**
 * Makes a number from a radix, and integer part, and a fractional part
 * @param {parts} [x] parts of the number string (from getNonDecimalNumberParts)
 * @returns {number} the number
 */
function makeNumberFromNonDecimalParts (parts, options) {
  if (options.safe &&
    (parts.integerPart.length + parts.fractionalPart.length) >
      radixLimit[parts.radix]
  ) {
    throw new RangeError('too many digits to convert ' +
      `'${parts.integerPart}.${parts.fractionalPart}' base ${parts.radix$} ` +
      'to number without loss of precision')
  }
  const n = parseInt(parts.integerPart, parts.radix)
  let f = 0
  for (let i = 0; i < parts.fractionalPart.length; i++) {
    const digitValue = parseInt(parts.fractionalPart[i], parts.radix)
    f += digitValue / Math.pow(parts.radix, i + 1)
  }
  const result = n + f
  if (isNaN(result)) {
    throw new SyntaxError('String "' + parts.input + '" is not a valid number')
  }
  return result
}

function _fromString (x, options = { safe: false }) {
  if (x === 'NaN') return NaN
  const nonDecimalNumberParts = getNonDecimalNumberParts(x)
  if (nonDecimalNumberParts) {
    return makeNumberFromNonDecimalParts(nonDecimalNumberParts, options)
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
    throw new SyntaxError('String "' + x + '" is not a valid number')
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
  if (options.safe) {
    const [mantissa] = x.split(/[Ee]/)
    let limit = 15
    if (mantissa.startsWith('-')) limit++
    if (mantissa.includes('.')) limit++
    if (mantissa.length > limit) {
      throw new RangeError(
        `too many digits to convert ${x} to number without loss of precision`)
    }
    if (!x.includes('finity') && !Number.isFinite(num)) {
      throw new RangeError(`over/underflow converting ${x} to number`)
    }
  }
  return num
}

export const createNumber = /* #__PURE__ */ factory(name, dependencies, ({ typed, equalScalar }) => {
  /**
   * Create a number or convert a string, boolean, or unit to a number.
   * When value is a matrix, all elements will be converted to number.
   *
   * Syntax:
   *
   *    math.number(value)
   *    math.number(value, options)
   *    math.number(unit, valuelessUnit)
   *
   * Where:
   *
   *    - value is the entity to  be converted
   *    - options is a plain object specifying aspects of the conversion
   *      Currently allowed options:
   *        * safe (boolean, default = false): when true, values that
   *          underflow, overflow, or lose precision upon conversion throw
   *          an error; similar to the behavior of implicit conversions
   *        * uniformType (boolean, default = false): when true, the result
   *          of this function is a number no matter what the input. Hence,
   *          attempts to convert arrays/Matrices with more than one entry
   *          or units with any unit dimensions throw an error.
   *
   * Examples:
   *
   *    math.number(2)                         // returns number 2
   *    math.number('7.2')                     // returns number 7.2
   *    math.number(true)                      // returns number 1
   *    math.number([true, false, true, true]) // returns [1, 0, 1, 1]
   *    math.number(math.unit('52cm'), 'm')    // returns 0.52
   *    math.number(1234567890123456789n, {safe: true})
   *      // throws TypeError
   *    math.number(math.unit('52 cm/cm'), {uniformType: true}) // 52
   *    math.number(math.unit('52 cm'), {uniformType: true})
   *      // throws TypeError
   *
   * See also:
   *
   *    bignumber, bigint, boolean, numeric, complex, index, matrix, string, unit
   *
   * History:
   *
   *    v16    allow Complex with trivial imaginary part to convert to number
   *           Add {safe: boolean, uniformType: boolean} options argument
   *    v11.8  Support unit arguments
   *    v9     Support bin, hex, and oct literals for string argument
   *    v2.5   Support Fraction arguments
   *
   * @param {string | number | BigNumber | Fraction | Complex | boolean | Array | Matrix | Unit | null} [value]  Value to be converted
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
    'number, Object': x => x, // no options matter for trivial conversion

    string: _fromString,
    'string, Object': _fromString,

    BigNumber: function (x) {
      return x.toNumber()
    },
    'BigNumber, Object': function (x, options) {
      const num = x.toNumber()
      if (options.safe) {
        if (x.isFinite() && !Number.isFinite(num)) {
          throw new RangeError(`over/underflow converting ${x} to number`)
        }
        if (x.toString() !== num.toString()) {
          throw new RangeError(`loss of precision converting ${x} to number`)
        }
      }
      return num
    },

    Complex: function (z) {
      // if the imaginary part is negligible, ok to return the real part:
      if (equalScalar(z.re, z.re + z.im)) return z.re
      throw new TypeError(
        `cannot convert ${z.re} + ${z.im} i with nontrivial imaginary part ` +
          'to number')
    },
    // since components of complex are numbers, no safety issue
    'Complex, Object': typed.referTo('Complex', selfC => x => selfC(x)),

    bigint: function (x) {
      return Number(x)
    },
    'bigint, Object': function (x, options) {
      if (options.safe) {
        if (x > Number.MAX_SAFE_INTEGER) {
          throw new TypeError('Cannot implicitly convert bigint to number: ' +
            'value exceeds the max safe integer value (value: ' + x + ')')
        }
        if (x < Number.MIN_SAFE_INTEGER) {
          throw new TypeError('Cannot implicitly convert bigint to number: ' +
            'value is below the min safe integer value (value: ' + x + ')')
        }
      }
      return Number(x)
    },

    Fraction: function (x) {
      return x.valueOf()
    },
    'Fraction, Object': function (x, options) {
      const num = x.valueOf()
      if (options.safe) {
        if (!Number.isFinite(num)) {
          throw new RangeError(`over/underflow converting ${x} to number`)
        }
        if (x.n.toString().length > 15 || x.d.toString().length > 15) {
          throw new RangeError(`loss of precision converting ${x} to number`)
        }
      }
      return num
    },

    Unit: typed.referToSelf(self => x => {
      const clone = x.clone()
      clone.value = self(x.value)
      return clone
    }),
    'Unit, Object': typed.referToSelf(self => (x, options) => {
      if (options.uniformType) {
        if (!x.dimensionless()) {
          throw new TypeError(
            `unit ${x} with unit dimensions cannot convert to number`)
        }
        return self(x.value, options)
      }
      const clone = x.clone()
      clone.value = self(x.value, options)
      return clone
    }),

    null: function (x) {
      return 0
    },

    'Unit, string | Unit': function (unit, valuelessUnit) {
      return unit.toNumber(valuelessUnit)
    },

    'Array | Matrix': typed.referToSelf(self => x => deepMap(x, self)),
    'Array | Matrix, Object': typed.referToSelf(self => (x, options) => {
      if (options.uniformType) {
        let arr = x.valueOf()
        while (Array.isArray(arr)) {
          if (arr.length !== 1) {
            throw new TypeError("can't convert multiple entries to single number")
          }
          arr = arr[0]
        }
        return self(arr, options)
      }
      return deepMap(x, entry => self(entry, options))
    })
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
