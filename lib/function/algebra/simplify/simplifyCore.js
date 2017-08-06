'use strict';

function factory(type, config, load, typed, math) {
  var ConstantNode = math.expression.node.ConstantNode;
  var OperatorNode = math.expression.node.OperatorNode;
  var FunctionNode = math.expression.node.FunctionNode;

  var node0 = new ConstantNode(0);
  var node1 = new ConstantNode(1);

  /**
   * simplifyCore() performs single pass simplification suitable for
   * applications requiring ultimate performance. In contrast, simplify() 
   * extends simplifyCore() with additional passes to provide deeper
   * simplification.
   *
   * Syntax:
   *
   *     simplify.simpifyCore(expr)
   *
   * Examples:
   *
   *     var f = math.parse('2 * 1 * x ^ (2 - 1)');
   *     math.simplify.simpifyCore(f);                          // Node {2 * x}
   *     math.simplify('2 * 1 * x ^ (2 - 1)', [math.simplify.simpifyCore]); // Node {2 * x};
   *
   * See also:
   *
   *     derivative 
   *
   * @param {Node} expr
   *     The expression to be simplified
   */
  function simplifyCore(node) {
    if (node.isOperatorNode && node.args.length <= 2) {
      var a0 = simplifyCore(node.args[0]);
      var a1 = node.args[1] && simplifyCore(node.args[1]);
      if (node.op === "+") {
          if (node.args.length === 1) {
            return node.args[0];
          }
          if (a0.isConstantNode) {
              if (a0.value === "0") {
                  return a1;
              } else if (a1.isConstantNode && a0.value && a0.value.length < 5 && a1.value && a1.value.length < 5) {
                  return new ConstantNode(Number(a0.value) + Number(a1.value));
              }
          }
          if (a1 && a1.isConstantNode && a1.value === "0") {
              return a0;
          }
          return new OperatorNode(node.op, node.fn, a1 ? [a0,a1] : [a0]);
      } else if (node.op === "-") {
          if (a0.isConstantNode && a1) {
              if (a1.isConstantNode && a0.value && a0.value.length < 5 && a1.value && a1.value.length < 5) {
                  return new ConstantNode(Number(a0.value) - Number(a1.value));
              } else if (a0.value === "0") {
                  return new OperatorNode("-", "unaryMinus", [a1]);
              }
          }
          if (node.fn === "subtract") {
              if (a1.isConstantNode && a1.value === "0") {
                  return a0;
              }
              if (a1.isOperatorNode && a1.fn === "unaryMinus") {
                  return simplifyCore(new OperatorNode("+", "add", [a0, a1.args[0]]));
              }
              return new OperatorNode(node.op, node.fn, [a0,a1]);
          } else if (node.fn === "unaryMinus") {
              return new OperatorNode(node.op, node.fn, [a0]);
          }
      } else if (node.op === "*") {
          if (a0.isConstantNode) {
              if (a0.value === "0") {
                  return node0;
              } else if (a0.value === "1") {
                  return a1;
              } else if (a1.isConstantNode && a0.value && a0.value.length < 5 && a1.value && a1.value.length < 5) {
                  return new ConstantNode(Number(a0.value) * Number(a1.value));
              }
          }
          if (a1.isConstantNode) {
              if (a1.value === "0") {
                  return node0;
              } else if (a1.value === "1") {
                  return a0;
              } else if (a0.isOperatorNode && a0.op === node.op) {
                  var a00 = a0.args[0];
                  if (a00.isConstantNode && a1.value && a1.value.length < 5 && a00.value && a00.value.length < 5) {
                      var a00_a1 =  new ConstantNode(Number(a0.args[0].value) * Number(a1.value));
                      return new OperatorNode(node.op, node.fn, [a00_a1, a0.args[1]]); // constants on left
                  }
              }
              return new OperatorNode(node.op, node.fn, [a1, a0]); // constants on left
          }
          return new OperatorNode(node.op, node.fn, [a0, a1]);
      } else if (node.op === "/") {
          if (a0.isConstantNode) {
              if (a0.value === "0") {
                  return node0;
              } else if (a1.isConstantNode && a0.value && a0.value.length < 5 && (a1.value === "1" || a1.value==="2" || a1.value==="4")) {
                  return new ConstantNode(Number(a0.value) / Number(a1.value));
              }
          }
          return new OperatorNode(node.op, node.fn, [a0, a1]);
      } else if (node.op === "^") {
          if (a1.isConstantNode) {
              if (a1.value === "0") {
                  return node1;
              } else if (a1.value === "1") {
                  return a0;
              } else if (a1.isConstantNode && a0.value && a0.value.length < 5 && a1.value && a1.value.length < 2) { // fold constant
                  return new ConstantNode(
                      math.pow(Number(a0.value), Number(a1.value)));
              }
          }
          return new OperatorNode(node.op, node.fn, [a0, a1]);
      } 
    } else if (node.isParenthesisNode) {
        var c = simplifyCore(node.content);
        if (c.isParenthesisNode || c.isSymbolNode || c.isConstantNode) {
            return c;
        }
        return new ParenthesisNode(c);
    } else if (node.isFunctionNode) {
        var args = node.args.map(function (arg) {
          return simplifyCore(arg)
        });
        if (args.length === 1) {
            if (args[0].isParenthesisNode) {
                args[0] = args[0].content;
            }
        }
        return new FunctionNode(node.name, args);
    }
    return node;
  }

  return simplifyCore;
}

exports.math = true;
exports.name = 'simplifyCore';
exports.path = 'algebra.simplify';
exports.factory = factory;
