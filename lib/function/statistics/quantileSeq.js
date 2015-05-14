'use strict';

module.exports = function (math) {
  var util = require('../../util/index');
  var collection = math.collection;
  var BigNumber = math.type.BigNumber;
  var Unit = require('../../type/Unit');

  var isArray = Array.isArray;
  var isBoolean = util.boolean.isBoolean;
  var isCollection = collection.isCollection;
  var isInteger = util.number.isInteger;
  var isNumber = util.number.isNumber;

  var add = math.add;
  var flatten = util.array.flatten;
  var multiply = math.multiply;

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
   *     math.quantileSeq(A, prob[, sorted])
   *     math.quantileSeq(A, [prob1, prob2, ...][, sorted])
   *     math.quantileSeq(A, N[, sorted])
   *
   * Examples:
   *
   *     math.quantileSeq([3, -1, 5, 7], 0.5);         // returns 4
   *     math.quantileSeq([3, -1, 5, 7], [1/3, 2/3]);  // returns [3, 5]
   *     math.quantileSeq([3, -1, 5, 7], 2);           // returns [3, 5]
   *     math.quantileSeq([-1, 3, 5, 7], 0.5, true);   // returns 4
   *
   * See also:
   *
   *     median, mean, min, max, sum, prod, std, var
   *
   * @param {Array, Matrix} data                A single matrix or Array
   * @param {Number, BigNumber, Array} probOrN  prob is the order of the quantile, while N is
   *                                            the amount of evenly distributed steps of
   *                                            probabilities; only one of these options can
   *                                            be provided
   * @param {Boolean} sorted=False              is data sorted in ascending order
   * @return {Number, BigNumber, Unit, Array}   Quantile(s)
   */
  math.quantileSeq = function quantileSeq(data, probOrN, sorted) {
    var probArr, dataArr, one;

    if (arguments.length < 2 || arguments.length > 3) {
      throw new SyntaxError('Function quantileSeq requires two or three parameters');
    }

    if (isCollection(data)) {
      sorted = sorted || false;
      if (isBoolean(sorted)) {
        dataArr = data.valueOf();
        if (isNumber(probOrN)) {
          if (probOrN < 0) {
            throw new Error('N/prob must be non-negative');
          }

          if (probOrN <= 1) {
            // quantileSeq([a, b, c, d, ...], prob[,sorted])
            return _quantileSeq(dataArr, probOrN, sorted);
          }

          if (probOrN > 1) {
            // quantileSeq([a, b, c, d, ...], N[,sorted])
            if (!isInteger(probOrN)) {
              throw new Error('N must be a positive integer');
            }

            var nPlusOne = probOrN + 1;
            probArr = new Array(probOrN);
            for (var i = 0; i < probOrN;) {
              probArr[i] = _quantileSeq(dataArr, (++i) / nPlusOne, sorted);
            }
            return probArr;
          }
        }

        if (probOrN instanceof BigNumber) {
          if (probOrN.isNegative()) {
            throw new Error('N/prob must be non-negative');
          }

          one = probOrN.constructor.ONE;

          if (probOrN.lte(one)) {
            // quantileSeq([a, b, c, d, ...], prob[,sorted])
            return _quantileSeq(dataArr, probOrN, sorted);
          }

          if (probOrN.gt(one)) {
            // quantileSeq([a, b, c, d, ...], N[,sorted])
            if (!probOrN.isInteger()) {
              throw new Error('N must be a positive integer');
            }

            var intN = probOrN.toNumber();
            var nPlusOne = new BigNumber(intN + 1);

            probArr = new Array(intN);
            for (var i = 0; i < intN;) {
              probArr[i] = _quantileSeq(dataArr, new BigNumber(++i).div(nPlusOne), sorted);
            }
            return probArr;
          }
        }

        if (isArray(probOrN)) {
          // quantileSeq([a, b, c, d, ...], [prob][,sorted])
          probArr = new Array(probOrN.length);
          for (var i = 0; i < probArr.length; ++i) {
            var currProb = probOrN[i];
            if (isNumber(currProb)) {
              if (currProb < 0 || currProb > 1) {
                throw new Error('Probability must be between 0 and 1, inclusive');
              }
            } else if (currProb instanceof BigNumber) {
              one = currProb.constructor.ONE;
              if (currProb.isNegative() || currProb.gt(one)) {
                throw new Error('Probability must be between 0 and 1, inclusive');
              }
            } else {
              throw new math.error.UnsupportedTypeError('quantileSeq', math['typeof'](currProb));
            }

            probArr[i] = _quantileSeq(dataArr, currProb, sorted);
          }
          return probArr;
        }

        throw new math.error.UnsupportedTypeError('quantileSeq', math['typeof'](probOrN));
      }

      throw new math.error.UnsupportedTypeError('quantileSeq', math['typeof'](sorted));
    }

    throw new math.error.UnsupportedTypeError('quantileSeq', math['typeof'](data));
  };

  /**
   * Calculate the prob order quantile of an n-dimensional array.
   * 
   * @param {Array} array
   * @param {Number, BigNumber} prob
   * @param {Boolean} sorted
   * @return {Number, BigNumber, Unit} prob order quantile
   * @private
   */
  function _quantileSeq(array, prob, sorted) {
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

        typecheck(value);

        return value;
      }

      var integerPart = Math.floor(index);
      var left = flat[integerPart];
      var right = flat[integerPart+1];

      typecheck(left, right);

      return add(multiply(left, 1 - fracPart), multiply(right, fracPart));
    }

    // If prob is a BigNumber
    var index = prob.times(len-1);
    if (index.isInteger()) {
      var value = flat[index.toNumber()];

      typecheck(value);

      return value;
    }

    var integerPart = index.floor();
    var fracPart = index.minus(integerPart);

    var integerPartNumber = integerPart.toNumber();
    var left = flat[integerPartNumber];
    var right = flat[integerPartNumber+1];

    typecheck(left, right);

    var one = fracPart.constructor.ONE;
    return add(multiply(left, one.minus(fracPart)), multiply(right, fracPart));
  }

  /**
   * Check if array value types are valid, throw error otherwise.
   * @param {*} x
   * @param {*} y
   * @private
   */
  function typecheck(x, y) {
    if (!isNumber(x) && !(x instanceof BigNumber) && !(x instanceof Unit)) {
      throw new math.error.UnsupportedTypeError('quantileSeq', math['typeof'](x));
    }
    if (y !== undefined && !isNumber(y) && !(y instanceof BigNumber) && !(y instanceof Unit)) {
      throw new math.error.UnsupportedTypeError('quantileSeq', math['typeof'](y));
    }
  }
};
