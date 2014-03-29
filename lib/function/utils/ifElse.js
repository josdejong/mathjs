module.exports = function (math) {

  /**
   * Executes a ternary operation
   * @param {*} conditionalExpr           The conditional expression
   * @param {*} trueExpr                  The true expression
   * @param {*} falseExpr                 The false expression
   * @return {*}                          The evaluated return expression
   */
  math.ifElse = function ifElse(conditionalExpr, trueExpr, falseExpr) {
    if (arguments.length != 3) {
      throw new math.error.ArgumentsError('ifElse', arguments.length, 3);
    }

    return conditionalExpr ? trueExpr : falseExpr;
  };
};
