'use strict';

module.exports = function(math) {
  var util = require('../../util/index'); 
  var collection = math.collection;
  var BigNumber = math.type.BigNumber;
  var Unit = require('../../type/Unit');

  var isCollection = collection.isCollection;
  var isNumber = util.number.isNumber;

  var add = math.add;
  var flatten = util.array.flatten;
  var multiply = math.multiply;

  /**
   * Calculate the prob order quantile of an n-dimensional array.
   * This function is meant for internal use: it is used by the public functions
   * 
   * @param {Array} args
   * @param {Boolean} sorted
   * @return {Number, BigNumber, Unit} prob order quantile
   * @private
   */
  math._quantile_seq = function _quantile_seq(args, sorted) {
    // TODO: this is a temporary function, to be removed as soon as the library is modularized (i.e. no dependencies on math from the individual functions)
    var prob = args.pop();

    if (isCollection(args[0])) {
      if (args.length == 1) {
        // quantile{_sorted}_seq([a, b, c, d, ...], prob)
        return __quantile_seq(args[0].valueOf(), prob, sorted);
      }

      throw new SyntaxError('Wrong number of parameters');
    }

    // quantile{_sorted}_seq(a, b, c, d, ..., prob)
    return __quantile_seq(args, prob, sorted);
  };


  /**
   * Calculate the prob order quantile of an n-dimensional array.
   * @param {Array} array
   * @param {Number, BigNumber} prob
   * @param {Boolean} sorted
   * @return {Number, BigNumber, Unit} prob order quantile
   * @private
   */
  function __quantile_seq(array, prob, sorted) {
    var error_file_str = (sorted) ? 'quantile_sorted_seq' : 'quantile_seq';
    if (!isNumber(prob) && !(prob instanceof BigNumber)) {
      throw new math.error.UnsupportedTypeError(error_file_str, math['typeof'](prob));
    }
    if ((isNumber(prob) && (prob < 0 || prob > 1)) ||
        (prob instanceof BigNumber && (prob.isNegative() || prob.gt(prob.constructor.ONE)))) {
      throw new Error('Probability must be between 0 and 1, inclusive');
    }

    var flat = flatten(array);
    var len = flat.length;
    if (len === 0) {
      throw new Error('Cannot calculate quantile of an empty sequence');
    }

    if (!sorted) {
      flat.sort(math.compare);
    }

    if (isNumber(prob)) {
      var index = prob * (len-1);
      var fracPart = index % 1;
      if (fracPart === 0) {
        var value = flat[index];

        typecheck(error_file_str, value);

        return value;
      }

      var integerPart = Math.floor(index);
      var left = flat[integerPart];
      var right = flat[integerPart+1];

      typecheck(error_file_str, left, right);

      return add(multiply(left, 1 - fracPart), multiply(right, fracPart));
    }

    // If prob is a BigNumber
    var index = prob.times(len-1);
    if (index.isInteger()) {
      var value = flat[index.toNumber()];

      typecheck(error_file_str, value);

      return value;
    }

    var integerPart = index.floor();
    var fracPart = index.minus(integerPart);

    var integerPartNumber = integerPart.toNumber();
    var left = flat[integerPartNumber];
    var right = flat[integerPartNumber+1];

    typecheck(error_file_str, left, right);

    var one = fracPart.constructor.ONE;
    return add(multiply(left, one.minus(fracPart)), multiply(right, fracPart));
  }

  /**
   * Check if array value types are valid, throw error otherwise.
   * @param {String} error_file_str
   * @param {*} x
   * @param {*} y
   * @private
   */
  function typecheck(error_file_str, x, y) {
    if (!isNumber(x) && !(x instanceof BigNumber) && !(x instanceof Unit)) {
      throw new math.error.UnsupportedTypeError(error_file_str, math['typeof'](x));
    }
    if (y !== undefined && !isNumber(y) && !(y instanceof BigNumber) && !(y instanceof Unit)) {
      throw new math.error.UnsupportedTypeError(error_file_str, math['typeof'](y));
    }
  }
};
