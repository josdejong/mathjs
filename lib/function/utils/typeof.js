module.exports = function (math) {
  var types = require('../../util/types'),

      Complex = require('../../type/Complex'),
      Matrix = require('../../type/Matrix'),
      Unit = require('../../type/Unit'),
      Index = require('../../type/Index'),
      Range = require('../../type/Range'),
      Help = require('../../type/Help');

  /**
   * Determine the type of a variable.
   *
   * Syntax:
   *
   *    math.typeof(x)
   *
   * Examples:
   *
   *    var math = mathjs();
   *
   *    math.typeof(3.5);             // returns 'number'
   *    math.typeof(2 - 4i);          // returns 'complex'
   *    math.typeof(45 deg);          // returns 'unit'
   *    math.typeof("hello world");   // returns 'string'
   *
   * @param {*} x  The variable for which to test the type.
   * @return {String} Lower case type, for example 'number', 'string', 'array'.
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
      if (x instanceof Matrix) return 'matrix';
      if (x instanceof Unit) return 'unit';
      if (x instanceof Index) return 'index';
      if (x instanceof Range) return 'range';
      if (x instanceof Help) return 'help';

      // the following types are different instances per math.js instance
      if (x instanceof math.type.BigNumber) return 'bignumber';
      if (x instanceof math.chaining.Selector) return 'selector';
    }

    return type;
  };
};
