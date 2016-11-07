'use strict';

var maxArgumentCount = require('../../utils/function').maxArgumentCount;

/**
 * Attach a transform function to math.filter
 * Adds a property transform containing the transform function.
 *
 * This transform adds support for equations as test function for math.filter,
 * so you can do something like 'filter([3, -2, 5], x > 0)'.
 */
function factory (type, config, load, typed) {
  var filter = load(require('../../function/matrix/filter'));
  var SymbolNode = load(require('../node/SymbolNode'));

  function filterTransform(args, math, scope) {
    var x, test;

    if (args[0]) {
      x = args[0].compile().eval(scope);
    }

    if (args[1]) {
      if (args[1] && args[1].isSymbolNode) {
        // a function pointer, like filter([3, -2, 5], myTestFunction);
        test = args[1].compile().eval(scope);
      }
      else {
        // an equation like filter([3, -2, 5], x > 0)

        // find an undefined symbol
        var _scope = scope || {};
        var symbol = args[1]
            .filter(function (node) {
              return (node && node.isSymbolNode) &&
                  !(node.name in math) &&
                  !(node.name in _scope);
            })[0];

        // create a test function for this equation
        var sub = Object.create(_scope);
        var eq = args[1].compile();
        if (symbol) {
          var name = symbol.name;
          test = function (x) {
            sub[name] = x;
            return eq.eval(sub);
          }
        }
        else {
          throw new Error('No undefined variable found in filter equation');
        }
      }
    }

    return filter(x, test);
  }

  filterTransform.rawArgs = true;

  return filterTransform;
}

exports.name = 'filter';
exports.path = 'expression.transform';
exports.factory = factory;
