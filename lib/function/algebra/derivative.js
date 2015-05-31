'use strict';

function factory (type, config, load, typed, math) {
  var ConstantNode    = load(require('../../expression/node/ConstantNode'));
  var FunctionNode    = load(require('../../expression/node/FunctionNode'));
  var OperatorNode    = load(require('../../expression/node/OperatorNode'));
  var ParenthesisNode = load(require('../../expression/node/ParenthesisNode'));
  var SymbolNode      = load(require('../../expression/node/SymbolNode'));

  /**
   * Takes the derivative of an expression expressed in parser Nodes.
   * This uses rules of differentiation which can be found here:
   *   http://en.wikipedia.org/wiki/Differentiation_rules
   *
   * Syntax:
   *
   *     derivative(expr, variable)
   *
   * Usage:
   *
   *     math.eval('derivative(2*x, x)')
   *
   * @param  {ConstantNode | SymbolNode | ParenthesisNode | FunctionNode | OperatorNode} expr
   * @param  {SymbolNode} variable   The variable to differentiate over
   * @return {ConstantNode | SymbolNode | ParenthesisNode | FunctionNode | OperatorNode}    The derivative of `expr`
   */
  var derivative = typed('derivative', {
    'Node, SymbolNode': function (expr, variable) {
      var constNodes = {};
      constTag(constNodes, expr, variable.name);
      return _derivative(expr, constNodes);
    }
  });

  /**
   * Does a depth-first search on the expression tree to identify what Nodes
   * are constants (e.g. 2 + 2), and stores the ones that are constants in
   * constNodes. Classification is done as follows:
   *
   *   1. ConstantNodes are constants.
   *   2. If there exists a SymbolNode, of which we are differentiating over,
   *      in the subtree it is not constant.
   *
   * @param  {Object} constNodes  Holds the nodes that are constant
   * @param  {ConstantNode | SymbolNode | ParenthesisNode | FunctionNode | OperatorNode} node
   * @param  {string} varName     Variable that we are differentiating
   * @return {boolean}  if node is constant
   */
  var constTag = typed('constTag', {
    'Object, ConstantNode, string': function (constNodes, node) {
      return constNodes[node] = true;
    },

    'Object, SymbolNode, string': function (constNodes, node, varName) {
      if (node.name != varName) {
        return constNodes[node] = true;
      }
      return false;
    },

    'Object, ParenthesisNode, string': function (constNodes, node, varName) {
      return constTag(constNodes, node.content, varName);
    },

    'Object, FunctionNode | OperatorNode, string': function (constNodes, node, varName) {
      if (node.args.length != 0) {
        var isConst = constTag(constNodes, node.args[0], varName);
        for (var i = 1; i < node.args.length; ++i) {
          isConst = constTag(constNodes, node.args[i], varName) && isConst;
        }

        if (isConst) {
          return constNodes[node] = true;
        }
      }
      return false;
    }
  });

  /**
   * Applies differentiation rules.
   *
   * @param  {ConstantNode | SymbolNode | ParenthesisNode | FunctionNode | OperatorNode} node
   * @param  {Object} constNodes  Holds the nodes that are constant
   * @return {ConstantNode | SymbolNode | ParenthesisNode | FunctionNode | OperatorNode}    The derivative of `expr`
   */
  var _derivative = typed('_derivative', {
    'ConstantNode, Object': function (node) {
       return new ConstantNode('0', node.valueType);
    },

    'SymbolNode, Object': function (node, constNodes) {
      if (constNodes[node] !== undefined) {
        return new ConstantNode(0);
      }
      return new ConstantNode(1);
    },

    'ParenthesisNode, Object': function (node, constNodes) {
      return new ParenthesisNode(_derivative(node.content, constNodes));
    },

    'FunctionNode, Object': function (node, constNodes) {
      if (constNodes[node] !== undefined) {
        return new ConstantNode(0);
      }

      // Does not support any non-constant functions with no args,
      // update if this changes
      if (node.args.length == 0) {
        return node;
      }

      var arg1 = node.args[0];

      switch (node.name) {
        /* Chain rule applies to all functions:
           F(x)  = f(g(x))
           F'(x) = g'(x)*f'(g(x)) */
        case 'log':
          if (node.args.length > 2) {
            return node;
          }

          /* d/dx(log(x))    = 1 / x
             d/dx(log(x, c)) = 1 / (x*ln(c)) */
          var newArg2 = (node.args.length == 1)
            ? arg1.clone()
            : new OperatorNode('*', 'multiply', [
                arg1.clone(),
                new FunctionNode('log', [node.args[1]])
              ]);

          return new OperatorNode('/', 'divide', [_derivative(arg1, constNodes), newArg2]);
        case 'exp':
          if (node.args.length > 1) {
            return node;
          }

          // d/dx(e^x) = e^x
          return new OperatorNode('*', 'multiply', [_derivative(arg1, constNodes), arg1.clone()]);
        case 'sin':
          if (node.args.length > 1) {
            return node;
          }

          // d/dx(sin(x)) = cos(x)
          return new OperatorNode('*', 'multiply', [
            _derivative(arg1, constNodes),
            new FunctionNode('cos', [arg1.clone()])
          ]);
        case 'cos':
          if (node.args.length > 1) {
            return node;
          }

          // d/dx(cos(x)) = -sin(x)
          return new OperatorNode('*', 'multiply', [
            _derivative(arg1, constNodes),
            new OperatorNode('-', 'unaryMinus', [
              new FunctionNode('sin', [arg1.clone()])
            ])
          ]);
        case 'tan':
          if (node.args.length > 1) {
            return node;
          }

          // d/dx(tan(x)) = sec(x)^2
          return new OperatorNode('*', 'multiply', [
            _derivative(arg1, constNodes),
            new OperatorNode('^', 'pow', [
              new FunctionNode('sec', [arg1.clone()]),
              new ConstantNode(2)
            ])
          ]);
        case 'sec':
        case 'csc':
        case 'cot':
        case 'asin':
        case 'acos':
        case 'atan':
        case 'atan2':
        case 'asec':
        case 'acsc':
        case 'acot':
        case 'sinh':
        case 'cosh':
        case 'tanh':
        case 'sech':
        case 'csch':
        case 'coth':
        case 'asinh':
        case 'acosh':
        case 'atanh':
        case 'asech':
        case 'acsch':
        case 'acoth':
        case 'add':    // Operator Functions
        case 'median': // Functions whose return is always constant
        case 'gamma':
        default: throw new Error('Function "' + node.name + '" not supported by derivative');
      }
    },

    'OperatorNode, Object': function (node, constNodes) {
      if (constNodes[node] !== undefined) {
        return new ConstantNode(0);
      }

      var arg1 = node.args[0];
      var arg2 = node.args[1];

      switch (node.op) {
        case '-':
        case '+':
          // d/dx(+/-f(x)) = +/-f'(x)
          if (node.args.length == 1) {
            return new OperatorNode(node.op, node.fn, [_derivative(arg1, constNodes)]);
          }

          // Linearity of differentiation, d/dx(f(x) +/- g(x)) = f'(x) +/- g'(x)
          return new OperatorNode(node.op, node.fn, [
            _derivative(arg1, constNodes),
            _derivative(arg2, constNodes)
          ]);
        case '*':
          // d/dx(c*f(x)) = c*f'(x)
          if (constNodes[arg1] !== undefined || constNodes[arg2] !== undefined) {
            var newArgs = (constNodes[arg1] !== undefined)
              ? [arg1.clone(), _derivative(arg2, constNodes)]
              : [arg2.clone(), _derivative(arg1, constNodes)];

            return new OperatorNode('*', 'multiply', newArgs);
          }

          // Product Rule, d/dx(f(x)*g(x)) = f'(x)*g(x) + f(x)*g'(x)
          return new OperatorNode('+', 'add', [
            new OperatorNode('*', 'multiply', [_derivative(arg1, constNodes), arg2.clone()]),
            new OperatorNode('*', 'multiply', [arg1.clone(), _derivative(arg2, constNodes)])
          ]);
        case '/':
          // d/dx(f(x) / c) = f'(x) / c
          if (constNodes[arg2] !== undefined) {
            return new OperatorNode('/', 'divide', [_derivative(arg1, constNodes), arg2]);
          }

          // Reciprocal Rule, d/dx(c / f(x)) = -c(f'(x)/f(x)^2)
          if (constNodes[arg1] !== undefined) {
            return new OperatorNode('*', 'multiply', [
              new OperatorNode('-', 'unaryMinus', [arg1]),
              new OperatorNode('/', 'divide', [
                _derivative(arg2, constNodes),
                new OperatorNode('^', 'pow', [arg2.clone(), new ConstantNode(2)])
              ])
            ]);
          }

          // Quotient rule, d/dx(f(x) / g(x)) = (f'(x)g(x) - f(x)g'(x)) / g(x)^2
          return new OperatorNode('/', 'divide', [
            new OperatorNode('-', 'minus', [
              new OperatorNode('*', 'multiply', [_derivative(arg1, constNodes), arg2.clone()]),
              new OperatorNode('*', 'multiply', [arg1.clone(), _derivative(arg2, constNodes)])
            ]),
            new OperatorNode('^', 'pow', [arg2.clone(), new ConstantNode(2)])
          ]);
        case '^':
          if (constNodes[arg2] !== undefined) {
            if (arg2.isConstantNode) {
              var expValue = arg2.value;

              // If is secretly constant; f(x)^0 = 1 -> d/dx(1) = 0
              if (expValue == '0') {
                return new ConstantNode(0);
              }
              // Ignore exponent; f(x)^1 = f(x)
              if (expValue == '1') {
                return _derivative(arg1, constNodes);
              }
            }

            // Elementary Power Rule, d/dx(f(x)^c) = c*f'(x)*f(x)^(c-1)
            var powMinusOne = new OperatorNode('^', 'pow', [
              arg1.clone(),
              new OperatorNode('-', 'subtract', [
                arg2,
                new ConstantNode(1)
              ])
            ]);

            return new OperatorNode('*', 'multiply', [
              arg2.clone(),
              new OperatorNode('*', 'multiply', [
                _derivative(arg1, constNodes),
                powMinusOne
              ]),
            ]);
          }

          // Functional Power Rule, d/dx(f^g) = f^g*[f'*(g/f) + g'ln(f)]
          return new OperatorNode('*', 'multiply', [
            new OperatorNode('^', 'pow', [arg1.clone(), arg2.clone()]),
            new OperatorNode('+', 'add', [
              new OperatorNode('*', 'multiply', [
                _derivative(arg1, constNodes),
                new OperatorNode('/', 'divide', [arg2.clone(), arg1.clone()])
              ]),
              new OperatorNode('*', 'multiply', [
                _derivative(arg2, constNodes),
                new FunctionNode('log', [arg1.clone()])
              ])
            ])
          ]);
        case '%':
        case 'mod':
        default: throw new Error('Operator "' + node.op + '" not supported by derivative');
      }
    }
  });

  /**
   * A transformation for the derivative function. This transformation will be
   * invoked when the function is used via the expression parser of math.js.
   *
   * @param {Array.<math.expression.node.Node>} args
   *            Expects the following arguments: [f, x]
   * @param {Object} math
   * @param {Object} [scope]
   */
  derivative.transform = typed('derivative_transform', {
    'Array, Object, Object': function (args) {
      return derivative.apply(null, args);
    }
  });

  derivative.transform.rawArgs = true;

  return derivative;
}

exports.name = 'derivative';
exports.factory = factory;
