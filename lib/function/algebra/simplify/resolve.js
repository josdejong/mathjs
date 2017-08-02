'use strict';

function factory(type, config, load, typed, math) {
  var ConstantNode = math.expression.node.ConstantNode;
  var OperatorNode = math.expression.node.OperatorNode;
  var FunctionNode = math.expression.node.FunctionNode;
  var ParenthesisNode = math.expression.node.ParenthesisNode;

  const node0 = new ConstantNode(0);
  const node1 = new ConstantNode(1);

  /**
   * resolve(expr, scope) replaces variable nodes with their scoped values
   *
   * Syntax:
   *
   *     simplify.resolve(expr, scope)
   *
   * Examples:
   *
   *     math.simplify.resolve('x + y', {x:1, y:2}) // Node {1 + 2}
   *     math.simplify.resolve(math.parse('x+y'), {x:1, y:2}) // Node {1 + 2}
   *     math.simplify('x+y', {x:2, y:'x+x'}).toString(); // "6"
   *
   * @param {Node} expr
   *     The expression to be simplified
   */
  function resolve(expr, scope) {
    var node = typeof expr === 'string' ? math.parse(expr) : expr;
    if (scope == null) {
        return node;
    }
    if (node.isSymbolNode) {
        var value = scope[node.name];
        if (typeof value === 'string') {
            return resolve(value, scope);
        } else if (typeof value === 'number') {
            return math.parse(`${value}`);
        }
    } else if (node.isOperatorNode) {
        var args = node.args.map((arg) => resolve(arg, scope));
        return new OperatorNode(node.op, node.fn, args);
    } else if (node.isParenthesisNode) {
        return new ParenthesisNode(resolve(node.content, scope));
    } else if (node.isFunctionNode) {
        var args = node.args.map((arg) => resolve(arg, scope));
        return new FunctionNode(node.name, args);
    }
    return node;
  }

  return resolve;
}

exports.math = true;
exports.name = 'resolve';
exports.path = 'algebra.simplify';
exports.factory = factory;
