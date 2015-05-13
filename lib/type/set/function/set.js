'use strict';

function factory (type, config, load, typed) {
  /**
   * Create an set. 
   *
   * Syntax:
   *
   *     math.set([1, 2, 3])
   *
   * @param {Array | Matrix} values   The set values.
   * @return {Set}          Returns the created set
   */
  return typed('set', {
    'Array | Matrix': function (values) {
      return new type.Set(values);
    }
  });
}

exports.name = 'set';
exports.factory = factory;
