'use strict'

function factory (type, config, load, typed) {
  const getTypeOf = load(require('../function/utils/typeof'))

  const validInputTypes = {
    'string': true,
    'number': true,
    'BigNumber': true,
    'Fraction': true
  }

  // Load the conversion functions for each output type
  const validOutputTypes = {
    'number': load(require('./number')),
    'BigNumber': load(require('./bignumber/function/bignumber')),
    'Fraction': load(require('./fraction/function/fraction'))
  }

  /**
   * Convert a numeric value to a specific type: number, BigNumber, or Fraction
   *
   * @param {string | number | BigNumber | Fraction } value
   * @param {'number' | 'BigNumber' | 'Fraction'} outputType
   * @return {number | BigNumber | Fraction} Returns an instance of the
   *                                         numeric in the requested type
   */
  const numeric = function (value, outputType) {
    const inputType = getTypeOf(value)

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

  numeric.toTex = function (node, options) {
    // Not sure if this is strictly right but should work correctly for the vast majority of use cases.
    return node.args[0].toTex()
  }

  return numeric
}

// FIXME: expose numeric in the math namespace after we've decided on a name and have written proper docs for this function. See https://github.com/josdejong/mathjs/pull/1270
// exports.name = 'type._numeric'
exports.path = 'type'
exports.name = '_numeric'
exports.factory = factory
