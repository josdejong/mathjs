import { typeOf } from '../../utils/is'
import { factory } from '../../utils/factory'
import { noBignumber, noFraction } from '../../utils/noop'

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
    Fraction: fraction
      ? (x) => fraction(x)
      : noFraction
  }

  /**
   * Convert a numeric input to a specific numeric type: number, BigNumber, or Fraction.
   *
   * Syntax:
   *
   *    math.numeric(x)
   *
   * Examples:
   *
   *    math.numeric('4')                           // returns number 4
   *    math.numeric('4', 'number')                 // returns number 4
   *    math.numeric('4', 'BigNumber')              // returns BigNumber 4
   *    math.numeric('4', 'Fraction')               // returns Fraction 4
   *    math.numeric(4, 'Fraction')                 // returns Fraction 4
   *    math.numeric(math.fraction(2, 5), 'number') // returns number 0.4
   *
   * See also:
   *
   *    number, fraction, bignumber, string, format
   *
   * @param {string | number | BigNumber | Fraction } value
   *              A numeric value or a string containing a numeric value
   * @param {string} outputType
   *              Desired numeric output type.
   *              Available values: 'number', 'BigNumber', or 'Fraction'
   * @return {number | BigNumber | Fraction}
   *              Returns an instance of the numeric in the requested type
   */
  return function numeric (value, outputType) {
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
