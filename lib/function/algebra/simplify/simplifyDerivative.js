'use strict';

function factory(type, config, load, typed) {
  var derivative = load(require('../derivative'));

  function simplifyDerivative(expr) {
    return expr.transform(function(node, path, parent){
      if (node.isFunctionNode && node.name === 'derivative') {
        return derivative(node.args[0], node.args[1]);
      }
      return node;
    });
  }

  return simplifyDerivative;
}

exports.name = 'derivative';
exports.path = 'simplify';
exports.factory = factory;