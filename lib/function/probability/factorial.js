'use strict';

var bignumber = require('../../util/bignumber');

function factory (type, config, load, typed) {
  var collection = load(require('../../type/matrix/collection'));
  var gamma = load(require('./gamma'));

  /**
   * Compute the factorial of a value
   *
   * Factorial only supports an integer value as argument.
   * For matrices, the function is evaluated element wise.
   *
   * Syntax:
   *
   *    math.factorial(n)
   *
   * Examples:
   *
   *    math.factorial(5);    // returns 120
   *    math.factorial(3);    // returns 6
   *
   * See also:
   *
   *    combinations, gamma, permutations
   *
   * @param {Number | BigNumber | Array | Matrix} n   An integer number
   * @return {Number | BigNumber | Array | Matrix}    The factorial of `n`
   */
  var factorial = typed('factorial', {
    'number': function (n) {
      if (n === Number.POSITIVE_INFINITY) {
       return Math.sqrt(2 * Math.PI);
      }

      return gamma(n + 1);
    },

    'BigNumber': function (n) {
      if (!n.isFinite() && !n.isNegative()) {
        return bignumber.tau(config.precision).sqrt();
      }

      return gamma(n.plus(1));
    },

    'Array | Matrix': function (n) {
      return collection.deepMap(n, factorial);
    }
  });

  return factorial;
}

exports.name = 'factorial';
exports.factory = factory;
