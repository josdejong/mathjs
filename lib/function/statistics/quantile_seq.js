'use strict';

module.exports = function (math) {
  var util = require('../../util/index');

  var _quantile_seq = math._quantile_seq;

  /**
   * Compute the prob order quantile of a matrix or a list with values.
   * The sequence is sorted and the middle value is returned.
   * Supported types of sequence values are: Number, BigNumber, Unit
   * Supported types of probablity are: Number, BigNumber
   *
   * In case of a (multi dimensional) array or matrix, the prob order quantile
   * of all elements will be calculated.
   *
   * Syntax:
   *
   *     math.quantile_seq(a, b, c, ..., prob)
   *     math.quantile_seq(A, prob)
   *
   * Examples:
   *
   *     math.quantile_seq(5, 2, 7, 0.4);        // returns 4.4
   *     math.quantile_seq([3, -1, 5, 7], 0.5);  // returns 4
   *
   * See also:
   *
   *     median, mean, min, max, sum, prod, std, var, multiply
   *
   * @param {... *} args  A single matrix or or multiple scalar values
   * @param {Number, BigNumber} prob
   * @return {Number, BigNumber, Unit} prob order quantile
   */
  math.quantile_seq = function quantile_seq(args, prob) {
    if (arguments.length < 2) {
      throw new SyntaxError('Function quantile_seq requires two or more parameters');
    }

    var arg_arr = new Array(arguments.length);
    for (var i = 0; i < arg_arr.length; ++i) {
      arg_arr[i] = arguments[i];
    }
    return _quantile_seq(arg_arr, false);
  };

};
