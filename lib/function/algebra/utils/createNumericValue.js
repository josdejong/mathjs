'use strict';

function factory(type, config, load, typed) {

  /**
   * Create a numeric value with a specific type: number, BigNumber, or Fraction
   *
   * @param {string | number} value
   * @param {'number' | 'BigNumber' | 'Fraction'}
   * @return {number | BigNumber | Fraction} Returns an instance of the
   *                                         requested type
   */
  return function createNumericValue (value, valueType) {
    if (valueType === 'BigNumber') {
      return new type.BigNumber(value);
    }

    if (valueType === 'Fraction') {
      return new type.Fraction(value);
    }

    if (typeof value === 'number') {
      return value;
    }
    else {
      return parseFloat(value);
    }
  }
}

exports.factory = factory;
