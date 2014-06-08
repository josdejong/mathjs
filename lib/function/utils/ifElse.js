module.exports = function (math) {
  var util = require('../../util/index'),

      BigNumber = math.type.BigNumber,
      Matrix = require('../../type/Matrix'),
      Complex = require('../../type/Complex'),
      Unit = require('../../type/Unit'),
      collection = require('../../type/collection'),

      isNumber = util.number.isNumber,
      isString = util.string.isString,
      isBoolean = util['boolean'].isBoolean,
      isComplex = Complex.isComplex,
      isUnit = Unit.isUnit;

  /**
   * Execute a conditional expression.
   *
   * Syntax:
   *
   *    math.ifElse(condition, trueExpr, falseExpr)
   *
   * Examples:
   *
   *    var math = mathjs();
   *
   *    math.ifElse(true, 'yes', 'no');           // returns 'yes'
   *
   * @param {Number | Boolean | String | Complex | BigNumber | Unit} condition
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

    throw new math.error.UnsupportedTypeError('ifElse', math['typeof'](condition));
  };
};
