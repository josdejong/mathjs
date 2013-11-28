module.exports = function (math) {
  var types = require('../../util/types'),

      BigNumber = require('bignumber.js'),
      Complex = require('../../type/Complex'),
      Matrix = require('../../type/Matrix'),
      Unit = require('../../type/Unit'),
      Index = require('../../type/Index'),
      Range = require('../../type/Range'),
      Help = require('../../type/Help');

  /**
   * Determine the type of a variable
   *
   *     typeof(x)
   *
   * @param {*} x
   * @return {String} type  Lower case type, for example 'number', 'string',
   *                        'array'.
   */
  math['typeof'] = function _typeof (x) {
    if (arguments.length != 1) {
      throw new math.error.ArgumentsError('typeof', arguments.length, 1);
    }

    // JavaScript types
    var type = types.type(x);

    // math.js types
    if (type === 'object') {
      if (x instanceof Complex) return 'complex';
      if (x instanceof BigNumber) return 'bignumber';
      if (x instanceof Matrix) return 'matrix';
      if (x instanceof Unit) return 'unit';
      if (x instanceof Index) return 'index';
      if (x instanceof Range) return 'range';
      if (x instanceof Help) return 'matrix';

      if (x instanceof math.chaining.Selector) return 'selector';
    }

    return type;
  };
};
