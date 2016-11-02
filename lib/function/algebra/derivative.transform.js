'use strict';

function factory (type, config, load, typed) {
  var derivative = load(require('./derivative'));

  /**
   * A transformation for the derivative function. This transformation will be
   * invoked when the function is used via the expression parser of math.js.
   *
   * @param {Array.<Node>} args
   *            Expects the following arguments: [f, x]
   * @param {Object} math
   * @param {Object} [scope]
   */
  var derivativeTransform = typed('derivative', {
    'Array, Object, Object': function (args, math, scope) {
      var deriv = derivative.apply(null, args);
      return deriv.eval(scope);
    }
  });

  derivativeTransform.rawArgs = true;

  return derivativeTransform;
}

exports.name = 'derivative';
exports.path = 'expression.transform';
exports.factory = factory;
