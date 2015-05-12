'use strict';

module.exports = function (math) {
  var util = require('../../util/index');

  var _quantile_seq = math._quantile_seq;

  /**
   * Compute the prob order quantile of a matrix or a list with values.
   * NOTE: This function assumes the sequence is sorted in ascending order.
   *       See quantile_seq for more functional information.
   *
   * Syntax:
   *
   *     math.quantile_sorted_seq(a, b, c, ..., prob)
   *     math.quantile_sorted_seq(A, prob)
   *
   * Examples:
   *
   *     math.quantile_sorted_seq(2, 5, 7, 0.4);            // returns 4.4
   *     math.quantile_sorted_seq([-1, 3, 5, 7], 0.5);      // returns 4
   *     math.quantile_sorted_seq([[-1, 3], [5, 7]], 0.5);  // returns 4
   *
   * See also:
   *
   *     quantile_seq
   *
   * @param {... *} ascending_args  A single matrix or multiple scalar values
   * @param {Number, BigNumber} prob
   * @return {Number, BigNumber, Unit} prob order quantile
   */
  math.quantile_sorted_seq = function quantile_sorted_seq(ascending_args, prob) {
    if (arguments.length < 2) {
      throw new SyntaxError('Function quantile_sorted_seq requires two or more parameters');
    }

    var arg_arr = new Array(arguments.length);
    for (var i = 0; i < arg_arr.length; ++i) {
      arg_arr[i] = arguments[i];
    }
    return _quantile_seq(arg_arr, true);
  };

};
