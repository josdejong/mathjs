'use strict';

function factory(type, config, load, typed) {

  // TODO: expose this function to mathjs, add documentation

  /**
   * Create a numeric value with a specific type: number, BigNumber, or Fraction
   *
   * @param {string | number} value
   * @param {'number' | 'BigNumber' | 'Fraction'}
   * @return {number | BigNumber | Fraction} Returns an instance of the
   *                                         numeric requested type
   */
  return function numeric (value, valueType) {
    if (valueType === 'BigNumber') {
      return new type.BigNumber(value);
    }
    else if (valueType === 'Fraction') {
      return new type.Fraction(value);
    }
    else {
      // valueType === 'number' or undefined // TODO: check this
      if (typeof value === 'number') {
        return value;
      }
      else {
        if (value === 'Infinity') {
          return Infinity;
        }

        if (value === 'NaN') {
          return NaN;
        }

        // The following regexp is relatively permissive
        if (!/^[\-+]?((\d+\.?\d*)|(\d*\.?\d+))([eE][+\-]?\d+)?$/.test(value)) {
          throw new Error('Invalid numeric value "' + value + '"');
        }

        // remove leading zeros like '003.2' which are not allowed by JavaScript
        return parseFloat(value.replace(/^(0*)[0-9]/, function (match, zeros) {
          return match.substring(zeros.length);
        }));
      }
    }
  }
}

exports.factory = factory;
