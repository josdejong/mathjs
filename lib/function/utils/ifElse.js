module.exports = function (math) {
  var util = require('../../util/index'),

      BigNumber = math.type.BigNumber,
      Matrix = require('../../type/Matrix'),
      Complex = require('../../type/Complex'),
      Unit = require('../../type/Unit'),
      collection = require('../../type/collection'),

      deepEqual = util.object.deepEqual,
      isNumber = util.number.isNumber,
      isString = util.string.isString,
      isBoolean = util['boolean'].isBoolean,
      isComplex = Complex.isComplex,
      isUnit = Unit.isUnit,
      isCollection = collection.isCollection;

  /**
   * Execute a conditional expression.
   *
   * In case of a matrix or array, the test is done element wise, the
   * true and false part can be either a matrix/array with the same size
   * of the condition, or a scalar value.
   *
   * @param {Number | Boolean | String | Complex | BigNumber | Unit | Matrix | Array} condition
   *                        The conditional expression
   * @param {*} trueExpr    The true expression
   * @param {*} falseExpr   The false expression
   * @return {*}            The evaluated return expression
   */
  math.ifElse = function ifElse(condition, trueExpr, falseExpr) {
    if (arguments.length != 3) {
      throw new math.error.ArgumentsError('ifElse', arguments.length, 3);
    }

    if (isNumber(condition) || isBoolean(condition)) {
      return condition ? trueExpr : falseExpr;
    }

    if (condition instanceof BigNumber) {
      return condition.isZero() ? falseExpr : trueExpr;
    }

    if (isString(condition)) {
      return condition ? trueExpr : falseExpr;
    }

    if (isComplex(condition)) {
      return (condition.re || condition.im) ? trueExpr : falseExpr;
    }

    if (isUnit(condition)) {
      return condition.value ? trueExpr : falseExpr;
    }

    if (condition === null || condition === undefined) {
      return falseExpr;
    }

    if (isCollection(condition)) {
      return _ifElseCollection(condition, trueExpr, falseExpr);
    }

    throw new math.error.UnsupportedTypeError('ifElse', math['typeof'](condition));
  };

  /**
   * Execute the if-else condition element wise
   * @param {Matrix | Array} condition
   * @param {*} trueExpr
   * @param {*} falseExpr
   * @returns {*}
   * @private
   */
  function _ifElseCollection(condition, trueExpr, falseExpr) {
    var asMatrix = (condition instanceof Matrix) ||
        (trueExpr instanceof Matrix) ||
        (falseExpr instanceof Matrix);

    // change an array into a matrix
    if (!(condition instanceof Matrix)) condition = new Matrix(condition);

    // change the true expression into a matrix and check whether the size
    // matches with the condition matrix
    if (isCollection(trueExpr)) {
      if (!(trueExpr instanceof Matrix)) trueExpr = new Matrix(trueExpr);

      if (!deepEqual(condition.size(), trueExpr.size())) {
        throw new RangeError('Dimension mismatch ([' +
            condition.size().join(', ') + '] != [' +
            trueExpr.size().join(', ')
            + '])');
        throw new math.error.DimensionError(condition.size(), trueExpr.size());
      }
    }

    // change the false expression into a matrix and check whether the size
    // matches with the condition matrix
    if (isCollection(falseExpr)) {
      if (!(falseExpr instanceof Matrix)) falseExpr = new Matrix(falseExpr);

      if (!deepEqual(condition.size(), falseExpr.size())) {
        throw new math.error.DimensionError(condition.size(), falseExpr.size());
      }
    }

    // do the actual conditional test element wise
    var trueIsMatrix = trueExpr instanceof Matrix,
        falseIsMatrix = falseExpr instanceof Matrix;
    var result = condition.map(function (value, index) {
      return math.ifElse(value,
          trueIsMatrix ? trueExpr.get(index) : trueExpr,
          falseIsMatrix ? falseExpr.get(index) : falseExpr
      );
    });

    return asMatrix ? result : result.valueOf();
  }
};
