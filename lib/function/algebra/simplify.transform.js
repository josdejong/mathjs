'use strict';

function factory (type, config, load, typed) {
  var simplify = load(require('./simplify'));

  /**
   * A transformation for the simplify function. This transformation will be
   * invoked when the function is used via the expression parser of math.js.
   *
   * @param {Array.<Node>} args
   *            Expects the following arguments: [f, x]
   * @param {Object} math
   * @param {Object} [scope]
   */
  var simplifyTransform = typed('simplify', {
    'Array, Object, Object': function (args, math, scope) {
      return simplify.apply(null, args).eval(scope);
    }
  });

  simplifyTransform.rawArgs = true;

  return simplifyTransform;
}

exports.name = 'simplify';
exports.path = 'expression.transform';
exports.factory = factory;
