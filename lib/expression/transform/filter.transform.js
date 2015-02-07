'use strict';

var SymbolNode = require('../../expression/node/SymbolNode');
var isBoolean = require('../../util/boolean').isBoolean;
var argsToArray = require('../../util/array').argsToArray;
var ArgumentsError = require('../../error/ArgumentsError');

/**
 * Attach a transform function to math.filter
 * Adds a property transform containing the transform function.
 *
 * This transform adds support for equations as test function for math.filter,
 * so you can do something like 'filter([3, -2, 5], x > 0)'.
 * @param {Object} math
 */
module.exports = function (math) {
  var _filter = math.filter;

  _filter.transform = function (args, math, scope) {
    if (args.length !== 2) {
      throw new ArgumentsError('filter', arguments.length, 2);
    }

    var x = args[0].compile(math).eval(scope);
    var test;
    if (args[1] instanceof SymbolNode) {
      // a function pointer, like filter([3, -2, 5], myTestFunction);
      test = args[1].compile(math).eval(scope);
    }
    else {
      // an equation like filter([3, -2, 5], x > 0)

      // find an undefined symbol
      var _scope = scope || {};
      var symbol = args[1]
          .filter(function (node) {
            return (node instanceof SymbolNode) &&
                !(node.name in math) &&
                !(node.name in _scope);
          })[0];

      // create a test function for this equation
      var sub = Object.create(_scope);
      var eq = args[1].compile(math);
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

    return _filter(x, test);
  };

  math.filter.transform.rawArgs = true;
};
