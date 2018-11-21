'use strict'

import { typeOf } from '../../utils/is'
import { factory } from '../../utils/factory'

// FIXME: expose numeric in the math namespace after we've decided on a name and have written proper docs for this function. See https://github.com/josdejong/mathjs/pull/1270
const name = 'numeric'
const dependencies = ['number', 'bignumber', 'fraction']

export const createNumeric = factory(name, dependencies, ({ number, bignumber, fraction }) => {
  const validInputTypes = {
    'string': true,
    'number': true,
    'BigNumber': true,
    'Fraction': true
  }

  // Load the conversion functions for each output type
  const validOutputTypes = {
    'number': (x) => number(x),
    'BigNumber': (x) => bignumber(x),
    'Fraction': (x) => fraction(x)
  }

  /**
   * Convert a numeric value to a specific type: number, BigNumber, or Fraction
   *
   * @param {string | number | BigNumber | Fraction } value
   * @param {'number' | 'BigNumber' | 'Fraction'} outputType
   * @return {number | BigNumber | Fraction} Returns an instance of the
   *                                         numeric in the requested type
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
