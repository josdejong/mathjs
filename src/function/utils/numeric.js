import { typeOf } from '../../utils/is.js'
import { factory } from '../../utils/factory.js'
import { noBignumber, noFraction } from '../../utils/noop.js'

const name = 'numeric'
const dependencies = ['number', '?bignumber', '?fraction']

export const createNumeric = /* #__PURE__ */ factory(name, dependencies, ({ number, bignumber, fraction }) => {
  const validInputTypes = {
    string: true,
    number: true,
    BigNumber: true,
    Fraction: true
  }

  // Load the conversion functions for each output type
  const validOutputTypes = {
    number: (x) => number(x),
    BigNumber: bignumber
      ? (x) => bignumber(x)
      : noBignumber,
    bigint: (x) => BigInt(x),
    Fraction: fraction
      ? (x) => fraction(x)
      : noFraction
  }

  /**
   * Convert a numeric input to a specific numeric type: number, BigNumber, bigint, or Fraction.
   *
   * Syntax:
   *
   *    math.numeric(x)
   *
   * Examples:
   *
   *    math.numeric('4')                           // returns 4
   *    math.numeric('4', 'number')                 // returns 4
   *    math.numeric('4', 'bigint')                 // returns 4n
   *    math.numeric('4', 'BigNumber')              // returns BigNumber 4
   *    math.numeric('4', 'Fraction')               // returns Fraction 4
   *    math.numeric(4, 'Fraction')                 // returns Fraction 4
   *    math.numeric(math.fraction(2, 5), 'number') // returns 0.4
   *
   * See also:
   *
   *    number, fraction, bignumber, bigint, string, format
   *
   * History:
   *
   *    v6       Created
   *    v13      Added `bigint` support
   *    v14.2.1  Prefer mathjs `bigint()` to built-in `BigInt()`
   *
   * @param {string | number | BigNumber | bigint | Fraction } value
   *              A numeric value or a string containing a numeric value
   * @param {string} outputType
   *              Desired numeric output type.
   *              Available values: 'number', 'BigNumber', or 'Fraction'
   * @return {number | BigNumber | bigint | Fraction}
   *              Returns an instance of the numeric in the requested type
   */
  return function numeric (value, outputType = 'number', check) {
    if (check !== undefined) {
      throw new SyntaxError('numeric() takes one or two arguments')
    }
    const inputType = typeOf(value)

    if (!(inputType in validInputTypes)) {
      throw new TypeError('Cannot convert ' + value + ' of type "' + inputType + '"; valid input types are ' + Object.keys(validInputTypes).join(', '))
    }
    if (!(outputType in validOutputTypes)) {
      throw new TypeError('Cannot convert ' + value + ' to type "' + outputType + '"; valid output types are ' + Object.keys(validOutputTypes).join(', '))
    }

    if (outputType === inputType) {
      return value
    } else {
      return validOutputTypes[outputType](value)
    }
  }
})
